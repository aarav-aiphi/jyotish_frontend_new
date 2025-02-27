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

    const handleNewMessage = ({
      chatId,
      message,
    }: {
      chatId: string;
      message: ChatMessageType;
    }) => {
      if (chatId === selectedChatId) {
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
      }
    };

    socket.on("newMessage", handleNewMessage);

    // Cleanup
    return () => {
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

      socket.emit("sendMessage", messageData, (response: SocketResponse) => {
        if (response?.success) {
          console.log("Message sent successfully");
        }
      });

      setCurrentMessage("");
      setReplyTo(null);
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
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {groupedMessages.map((item, index) => {
          if (isDivider(item)) {
            return (
              <div key={`divider-${index}-${Date.now()}`} className="text-center text-gray-500 text-sm my-4">
                {item.label}
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
        })}
        {isTyping && <div className="text-sm text-gray-500 mx-14">Typing...</div>}
        {summary && (
          <div className="p-4 bg-yellow-100 rounded">
            <h3 className="font-bold">Chat Summary:</h3>
            <p>{summary}</p>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 flex border-t flex-col">
        {replyTo && (
          <div className="p-2 bg-gray-100 rounded mb-2 flex justify-between items-center">
            <span>
              Replying to: <strong>{replyTo.content}</strong>
            </span>
            <button onClick={() => setReplyTo(null)} className="text-red-500">
              Cancel
            </button>
          </div>
        )}
        <div className="flex">
          <input
            className="flex-1 border p-2 rounded-lg"
            type="text"
            placeholder="Type a message..."
            value={currentMessage}
            onChange={handleTyping}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-black px-4 rounded-lg text-white hover:bg-gray-900"
          >
            Send
          </button>
          <button
            onClick={requestSummary}
            className="ml-2 bg-black px-4 rounded-lg text-white hover:bg-gray-900"
          >
            Summary
          </button>
        </div>
      </div>
    </>
  );
}