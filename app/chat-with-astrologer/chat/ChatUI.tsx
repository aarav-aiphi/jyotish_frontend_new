"use client";

import React, { useEffect, useState, useRef } from "react";
import ChatMessage from "@/components/ui/ChatMessage";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setTypingStatus,
  setSummary,
  selectTypingStatus,
  setOnlineUser,
  markChatAsRead
} from "@/redux/chatSlice";
import { groupMessagesByDate, isDivider } from "./utils";
import { getCookie } from "@/lib/utils";

interface ChatMessageType {
  _id: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  type: string;
  replyTo?: ChatMessageType | null;
  reactions: { [userId: string]: string };
}

interface User {
  _id: string;
  userId: string;
  status: "online" | "offline";
  name: string;
  email: string;
  role: string;
}

interface ChatUIProps {
  socket: Socket;
  selectedChatId: string;
  user: User;
}

interface SocketResponse {
  success: boolean;
  message?: string;
}

const TYPING_DEBOUNCE_DELAY = 3000;

export default function ChatUI({ socket, selectedChatId, user }: ChatUIProps) {
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [replyTo, setReplyTo] = useState<ChatMessageType | null>(null);
  const [summary, setSummaryState] = useState<string>("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const isTyping = useAppSelector(state => selectTypingStatus(state, selectedChatId));
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Testing
  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleUserStatusUpdate = ({ userId, status }: User) => {
      dispatch(setOnlineUser({ userId, status }));
    };

    socket.on('userStatusUpdate', handleUserStatusUpdate);

    return () => {
      socket.off('userStatusUpdate', handleUserStatusUpdate);
    };
  }, [socket, dispatch]);

  // Join the room + fetch existing messages
  useEffect(() => {
    if (!socket || !selectedChatId) return;

    // 1) Join the room
    socket.emit('joinRoom', { chatId: selectedChatId }, (response: SocketResponse) => {
      if (response?.success) {
        console.log('Successfully joined room:', selectedChatId);
      } else {
        console.error('Failed to join room:', selectedChatId);
      }
    });

    // 2) Fetch chat messages
    const loadMessages = async () => {
      try {
        const token = getCookie('token'); 
        const response = await fetch(
          `/api/v1/chat/${selectedChatId}`,
          {
            credentials: "include",
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          }
        );

        if (!response.ok) {
          // Handle HTTP errors
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch messages");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch messages");
        }

        setMessages(data.messages || []);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
        // toast notification system
      }
    };
    loadMessages();

    // Clean up: leave the room
    return () => {
      socket.emit("leaveRoom", { chatId: selectedChatId });
    };
  }, [socket, selectedChatId]);

  // Socket listener for new messages
  useEffect(() => {
    if (!socket) return;

    console.log("Setting up newMessage listener for chat ID:", selectedChatId);

    const handleNewMessage = ({
      chatId,
      message,
    }: {
      chatId: string;
      message: ChatMessageType;
    }) => {
      console.log("Received new message:", { chatId, messageContent: message.content });
      
      if (chatId === selectedChatId) {
        console.log("Adding message to chat:", message);
        setMessages((prev) => [...prev, message]);

        // Show browser notification if not sent by current user
        if (message.sender._id !== user._id) {
          if (Notification.permission === "granted") {
            new Notification(`New message from ${message.sender.name}`, {
              body: message.content,
              icon: message.sender.avatar || "/default-avatar.png",
            });
          }
        }
      } else {
        console.log("Message was for a different chat:", chatId);
      }
    };

    socket.on("newMessage", handleNewMessage);

    // Cleanup
    return () => {
      console.log("Removing newMessage listener");
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedChatId, user]);


  // Handle Edited Message
  useEffect(() => {
    if (!socket) return;

    const handleMessageEdited = ({ chatId, message }: { chatId: string; message: ChatMessageType }) => {
      if (chatId === selectedChatId) {
        setMessages(prev => prev.map(msg => msg._id === message._id ? message : msg));
      }
    };

    socket.on('messageEdited', handleMessageEdited);

    return () => {
      socket.off('messageEdited', handleMessageEdited);
    };
  }, [socket, selectedChatId]);

  // Handle Deleted Message
  useEffect(() => {
    if (!socket) return;

    const handleMessageDeleted = ({ chatId, messageId }: { chatId: string; messageId: string }) => {
      if (chatId === selectedChatId) {
        setMessages(prev => prev.filter(msg => msg._id !== messageId));
      }
    };

    socket.on('messageDeleted', handleMessageDeleted);

    return () => {
      socket.off('messageDeleted', handleMessageDeleted);
    };
  }, [socket, selectedChatId]);

  // Handle Typing Indicator
  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({ isTyping }: { userId: string; isTyping: boolean }) => {
      // Update typing status in Redux
      dispatch(setTypingStatus({ chatId: selectedChatId, isTyping }));
    };

    socket.on('typing', handleTyping);

    return () => {
      socket.off('typing', handleTyping);
    };
  }, [socket, selectedChatId, dispatch]);

  // Handle Reaction Updates from Server
  useEffect(() => {
    if (!socket) return;

    const handleMessageReactionUpdated = ({
      chatId,
      messageId,
      reactions
    }: {
      chatId: string;
      messageId: string;
      reactions: { [key: string]: string };
    }) => {
      if (chatId === selectedChatId) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageId
              ? { ...msg, reactions: reactions || {} }
              : msg
          )
        );
      }
    };

    socket.on("messageReactionUpdated", handleMessageReactionUpdated);

    return () => {
      socket.off("messageReactionUpdated", handleMessageReactionUpdated);
    };
  }, [socket, selectedChatId]);

  // Handle Summary
  useEffect(() => {
    if (!socket) return;

    const handleSummary = ({ summary }: { summary: string }) => {
      setSummaryState(summary);
      dispatch(setSummary({ chatId: selectedChatId, summary }));
    };

    socket.on('summary', handleSummary);

    return () => {
      socket.off('summary', handleSummary);
    };
  }, [socket, selectedChatId, dispatch]);

  // Auto-scroll
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, summary]);

  // Request notification permission on mount
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (selectedChatId) {
      // Mark as read when component mounts
      dispatch(markChatAsRead(selectedChatId));
    }
  }, [selectedChatId, dispatch]);

  // Send message
  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    if (socket && selectedChatId) {
      const messageData = {
        chatId: selectedChatId,
        message: currentMessage,
        replyTo: replyTo?._id || null
      };

      console.log('Attempting to send message:', messageData);
      
      socket.emit("sendMessage", messageData, (response: SocketResponse) => {
        console.log('Message send response:', response);
        if (response?.success) {
          console.log("Message sent successfully");
        } else {
          console.error("Failed to send message:", response?.message || 'Unknown error');
        }
      });

      setCurrentMessage("");
      setReplyTo(null);
    } else {
      console.error('Cannot send message: socket or selectedChatId is missing', { 
        socketConnected: !!socket, 
        selectedChatId 
      });
    }
  };

  // Handle Edit Message
  const handleEditMessage = (messageId: string, newContent: string) => {
    if (socket && selectedChatId) {
      socket.emit('editMessage', { chatId: selectedChatId, messageId, newContent });
    }
  };

  // Handle Delete Message
  const handleDeleteMessage = (messageId: string) => {
    if (socket && selectedChatId) {
      socket.emit('deleteMessage', { chatId: selectedChatId, messageId });
    }
  };

  // Handle Reply
  const handleReply = (message: ChatMessageType) => {
    setReplyTo(message);
  };

  // Handle Typing
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentMessage(value);

    if (socket && selectedChatId) {
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Immediately send typing status if there's content
      const isTyping = value.length > 0;
      socket.emit('typing', { chatId: selectedChatId, isTyping });

      // Set timeout to send false after delay if input is not empty
      if (isTyping) {
        typingTimeoutRef.current = setTimeout(() => {
          socket.emit('typing', { chatId: selectedChatId, isTyping: false });
        }, TYPING_DEBOUNCE_DELAY);
      }
    }
  };

  //cleanup for the timeout
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Request AI Summary
  const requestSummary = () => {
    if (socket && selectedChatId) {
      socket.emit('generateSummary', { chatId: selectedChatId });
    }
  };


  const reactToMessage = (messageId: string, emoji: string) => {
    if (socket && selectedChatId) {
      socket.emit("reactToMessage", {
        chatId: selectedChatId,
        messageId,
        emoji,
      });
    }
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <>
      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="p-4 md:p-6 space-y-4 max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-center text-sm">Start the conversation by sending a message below</p>
            </div>
          ) : (
            groupedMessages.map((item, index) => {
              if (isDivider(item)) {
                return (
                  <div key={`divider-${index}-${Date.now()}`} className="flex items-center justify-center my-6">
                    <div className="bg-gray-300 dark:bg-gray-700 h-px flex-grow"></div>
                    <span className="mx-4 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm">
                      {item.label}
                    </span>
                    <div className="bg-gray-300 dark:bg-gray-700 h-px flex-grow"></div>
                  </div>
                );
              }

              return (
                <ChatMessage
                  key={`${item._id}-${item.createdAt}`}
                  message={item}
                  currentUserId={user._id}
                  onReply={handleReply}
                  onEdit={handleEditMessage}
                  onDelete={handleDeleteMessage}
                  onReact={reactToMessage}
                />
              );
            })
          )}
          
          {isTyping && (
            <div className="flex items-center space-x-2 pl-12 text-gray-500 animate-pulse">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <circle cx="4" cy="12" r="3" fill="currentColor">
                  <animate attributeName="opacity" from="1" to="0.3" dur="0.8s" repeatCount="indefinite" begin="0" />
                </circle>
                <circle cx="12" cy="12" r="3" fill="currentColor">
                  <animate attributeName="opacity" from="1" to="0.3" dur="0.8s" repeatCount="indefinite" begin="0.2s" />
                </circle>
                <circle cx="20" cy="12" r="3" fill="currentColor">
                  <animate attributeName="opacity" from="1" to="0.3" dur="0.8s" repeatCount="indefinite" begin="0.4s" />
                </circle>
              </svg>
              <span className="text-sm font-medium">Typing</span>
            </div>
          )}
          
          {summary && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-semibold text-amber-800 dark:text-amber-300">Chat Summary</h3>
              </div>
              <p className="text-amber-700 dark:text-amber-200 text-sm">{summary}</p>
            </div>
          )}
          
          <div ref={endOfMessagesRef} />
        </div>
      </div>

      {/* INPUT */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="max-w-3xl mx-auto">
          {replyTo && (
            <div className="mb-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500 dark:border-blue-400 flex items-start justify-between">
              <div className="flex-1 pr-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Replying to <span className="font-semibold">{replyTo.sender.name}</span>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{replyTo.content}</p>
              </div>
              <button 
                onClick={() => setReplyTo(null)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2">
            <button className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 mr-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <input
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 py-2 text-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              type="text"
              placeholder="Type a message..."
              value={currentMessage}
              onChange={handleTyping}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={requestSummary}
              className="text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 ml-2"
              title="Generate summary"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </button>
            <button
              onClick={sendMessage}
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 flex items-center justify-center transition-colors"
              disabled={!currentMessage.trim()}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}