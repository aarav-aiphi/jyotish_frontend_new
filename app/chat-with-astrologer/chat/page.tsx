"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState, store } from "@/redux/store";
import { io, Socket } from "socket.io-client";
import ChatUI from "./ChatUI";
import CallUI from "./CallUI";
import Image from "next/image";
import {
  setOnlineUser,
  selectOnlineUsers,
  deleteConversation,
  incrementUnreadCount,
  markChatAsRead,
  selectUnreadCounts
} from "@/redux/chatSlice";
import { getCookie } from "@/lib/utils";

interface Participant {
  _id: string;
  name: string;
  avatar: string;
}

interface ChatItem {
  _id: string;
  userId: Participant;
  astrologerId: Participant;
  unreadCount: number;
}

interface OnlineUser {
  userId: string;
  status: "online" | "offline";
}

const ChatContent = () => {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const params = useParams();
  const astrologerId = params.id as string;

  const user = useAppSelector((state: RootState) => state.user.user);
  const onlineUsers = useAppSelector(selectOnlineUsers);
  const unreadCounts = useAppSelector(selectUnreadCounts);
  const dispatch = useAppDispatch();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatList, setChatList] = useState<ChatItem[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(chatId || null);
  const [contextMenu, setContextMenu] = useState<{ chatId: string | null; position: { x: number; y: number } }>({ chatId: null, position: { x: 0, y: 0 } });

  useEffect(() => {
    // const token = getCookie('token'); 
    const newSocket = io('http://localhost:7000', {
      auth: { token: store.getState().user.token },
      transports: ['websocket']
    });
    newSocket.on("connect", () => console.log("Connected to socket.io server"));
    newSocket.on("connect_error", (err) => console.error("Connection error:", err.message));
    newSocket.on("userStatusUpdate", ({ userId, status }: OnlineUser) =>
      dispatch(setOnlineUser({ userId, status }))
    );
    newSocket.on("onlineUsers", (users: OnlineUser[]) =>
      users.forEach(user => dispatch(setOnlineUser({ userId: user.userId, status: "online" })))
    );

    setSocket(newSocket);

    return () => {
      if (newSocket.connected) {
        newSocket.disconnect();
      }
    };
  }, [dispatch]);

  useEffect(() => {
    const loadChatList = async () => {
      try {
        const token = getCookie('token'); 

        const response = await fetch(`/api/v1/chat/list`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) throw new Error("Failed to fetch chat list");
        const data = await response.json();
        setChatList(data);

        // Initialize Redux unread counts from server data
        const initialCounts = data.reduce((acc: Record<string, number>, chat: ChatItem) => ({
          ...acc,
          [chat._id]: chat.unreadCount
        }), {});
        dispatch(markChatAsRead(initialCounts));
      } catch (error) {
        console.error("Error fetching chat list:", error);
      }
    };
    loadChatList();
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return undefined;

    const handleNewMessage = ({ chatId }: { chatId: string }) => {
      if (chatId !== selectedChatId) {
        dispatch(incrementUnreadCount(chatId));
      }
    };

    socket.on("newMessage", handleNewMessage);

    // Return cleanup function
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedChatId, dispatch]);

  const selectedChatData = chatList.find(chat => chat._id === selectedChatId);
  const participant = selectedChatData ? (selectedChatData.userId._id === user?._id ? selectedChatData.astrologerId : selectedChatData.userId) : null;

  const handleContextMenu = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    setContextMenu({ chatId, position: { x: e.clientX, y: e.clientY } });
  };

  const closeContextMenu = () => setContextMenu({ chatId: null, position: { x: 0, y: 0 } });

  const handleDeleteConversation = () => {
    if (contextMenu.chatId) {
      dispatch(deleteConversation(contextMenu.chatId));
      if (selectedChatId === contextMenu.chatId) setSelectedChatId(null);
      closeContextMenu();
    }
  };

  const handleMarkAsRead = async (chatId: string) => {
    try {
      const token = getCookie('token'); 

      await fetch(`/api/v1/chat/${chatId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      dispatch(markChatAsRead(chatId));
    } catch (error) {
      console.error('Error marking chat as read:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => closeContextMenu();
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Context Menu */}
      {contextMenu.chatId && (
        <div
          className="absolute bg-white dark:bg-gray-800 shadow-lg rounded-lg p-1 z-50"
          style={{ left: contextMenu.position.x, top: contextMenu.position.y }}
        >
          <button
            onClick={handleDeleteConversation}
            className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m4-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Conversation
          </button>
        </div>
      )}

      {/* Chat Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Messages
          </h2>
          
          {/* Search bar */}
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-100 dark:bg-gray-700 border-none text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <svg 
              className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chatList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400 p-4">
              <svg className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-center">No conversations yet</p>
              <p className="text-center text-xs mt-2">Your chat history will appear here</p>
            </div>
          ) : (
            chatList.map(chat => {
              const chatParticipant = chat.userId._id === user?._id ? chat.astrologerId : chat.userId;
              const isOnline = onlineUsers.find(u => u.userId === chatParticipant._id)?.status === "online";
              const unread = unreadCounts[chat._id] || 0;

              return (
                <div
                  key={chat._id}
                  onContextMenu={(e) => handleContextMenu(e, chat._id)}
                  onClick={async () => {
                    setSelectedChatId(chat._id);
                    closeContextMenu();
                    await handleMarkAsRead(chat._id);
                  }}
                  className={`p-3 cursor-pointer transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 relative
                    ${selectedChatId === chat._id 
                      ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400" 
                      : "border-l-4 border-transparent"}`}
                >
                  <div className="flex items-start">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <Image
                        src={chatParticipant.avatar || "/default-avatar.png"}
                        alt="Avatar"
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                      />
                      <div 
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-700 
                          ${isOnline ? "bg-green-500" : "bg-gray-400"}`}
                        title={isOnline ? "Online" : "Offline"} 
                      />
                    </div>
                    
                    {/* Chat Info */}
                    <div className="ml-3 flex-1 overflow-hidden">
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {chatParticipant.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-1">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                        Start a conversation with {chatParticipant.name}
                      </p>
                    </div>
                  </div>
                  
                  {/* Unread Badge */}
                  {unread > 0 && (
                    <span className="absolute top-4 right-3 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
        
        {/* User Info Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {user && (
            <div className="flex items-center">
              <Image
                src={user.avatar || "/default-avatar.png"}
                alt="Your avatar"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-700"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
              </div>
              <div className="ml-auto">
                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat + Call UI */}
      <div className="flex-1 flex flex-col relative">
        {selectedChatId && socket ? (
          participant && user ? (
            <>
              <CallUI
                socket={socket}
                user={user}
                participant={participant}
                chatId={selectedChatId}
                astrologerId={astrologerId}
              />
              <ChatUI
                socket={socket}
                selectedChatId={selectedChatId}
                user={{ ...user, userId: user._id, status: "online" }}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                <p>Loading participant details...</p>
              </div>
            </div>
          )
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="max-w-md p-8 text-center">
              <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No conversation selected</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Select a chat from the sidebar or start a new conversation with an astrologer
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your messages are end-to-end encrypted
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ChatPage() {
  return <Suspense fallback={<div>Loading...</div>}><ChatContent /></Suspense>;
}