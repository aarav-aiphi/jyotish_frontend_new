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
    const newSocket = io('https://jyotishconnect.onrender.com', {
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
    <div className="flex h-screen">
      {/* Context Menu */}
      {contextMenu.chatId && (
        <div
          className="absolute bg-white shadow-lg rounded-md p-2 z-50"
          style={{ left: contextMenu.position.x, top: contextMenu.position.y }}
        >
          <button
            onClick={handleDeleteConversation}
            className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 rounded-md"
          >
            Delete Conversation
          </button>
        </div>
      )}

      {/* Chat List */}
      <div className="w-1/4 border-r border-gray-300 flex flex-col">
        <h2 className="p-4 font-bold text-lg">Chat History</h2>
        <div className="flex-1 overflow-y-auto">
          {chatList.map(chat => {
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
                className={`p-3 border-b cursor-pointer flex items-center justify-between ${selectedChatId === chat._id ? "bg-gray-200" : "hover:bg-gray-100"
                  }`}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <Image
                      src={chatParticipant.avatar || "/default-avatar.png"}
                      alt="Avatar"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover mx-2"
                    />
                    <div className={`absolute top-0 right-2 w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-500"
                      }`}
                      title={isOnline ? "Online" : "Offline"} />
                  </div>
                  <div className="font-semibold">{chatParticipant.name}</div>
                </div>
                {unread > 0 && (
                  <span className="bg-green-500 text-white rounded-full px-2 py-1 text-xs">
                    {unread}
                  </span>
                )}
              </div>
            );
          })}
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
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Loading participant details...
            </div>
          )
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            {selectedChatId ? "Connecting..." : "Select a chat to start messaging"}
          </div>
        )}
      </div>

    </div>
  );
};

export default function ChatPage() {
  return <Suspense fallback={<div>Loading...</div>}><ChatContent /></Suspense>;
}