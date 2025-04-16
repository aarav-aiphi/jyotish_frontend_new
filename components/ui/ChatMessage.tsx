"use client";
import React, { useState } from "react";
import { FaCheckDouble } from "react-icons/fa";
import Image from "next/image";
import { ChatMessageType } from "@/redux/chatSlice";

interface ChatMessageProps {
  message: ChatMessageType;
  currentUserId: string;
  onReply: (message: ChatMessageType) => void;
  onEdit: (messageId: string, newContent: string) => void;
  onDelete: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  onReact,
}) => {
  const isSentByUser = message.sender._id === currentUserId;
  const fallbackAvatar = "/default-avatar.png";

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

  const handleReply = () => {
    onReply({
      _id: message._id,
      sender: message.sender,
      content: message.content,
      createdAt: message.createdAt,
      type: message.type,
      reactions: message.reactions
    });
  };

  // Just an example of a "10-minute" check
  const canEdit = () => {
    const createdAt = new Date(message.createdAt);
    const now = new Date();
    const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
    return isSentByUser && diffMinutes <= 10;
  };

  const renderReactions = () => {
    if (!message.reactions || Object.keys(message.reactions).length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {Object.entries(message.reactions).map(([userId, emoji]) => (
          <span
            key={`${userId}-${emoji}`}
            className="bg-gray-100 rounded-full px-2 py-0.5 text-sm"
            title={userId === currentUserId ? "You reacted" : "User reaction"}
          >
            {emoji}
          </span>
        ))}
      </div>
    );
  };

  // ================ Action Handlers ================

  return (
    <div className={`flex group/message items-start mb-4 ${isSentByUser ? "justify-end" : "justify-start"}`}>
      {/* Avatar (on the left if not user) */}
      {!isSentByUser && (
        <div className="flex-shrink-0 mr-2">
          <Image
            src={message.sender.avatar || fallbackAvatar}
            alt={message.sender.name}
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
          />
        </div>
      )}

      <div className={`flex flex-col max-w-[75%] ${isSentByUser ? 'items-end' : 'items-start'}`}>
        {/* Sender name - only show for received messages */}
        {!isSentByUser && (
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-2 mb-1">
            {message.sender.name}
          </span>
        )}

        {/* Message Bubble */}
        <div
          className={`relative group rounded-xl shadow-sm px-4 py-3 ${
            isSentByUser
              ? "bg-blue-500 text-white rounded-br-none"
              : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none"
          }`}
        >
          {/* Message Actions Menu */}
          <div className={`absolute opacity-0 group-hover/message:opacity-100 transition-opacity duration-200 -top-10 ${
            isSentByUser ? 'right-0' : 'left-0'
          } flex items-center space-x-0.5 bg-white dark:bg-gray-800 rounded-full shadow-md p-1 z-10`}>
            <button
              onClick={handleReply}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              title="Reply"
            >
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            
            {canEdit() && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                title="Edit"
              >
                <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            
            {canEdit() && (
              <button
                onClick={() => onDelete(message._id)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                title="Delete"
              >
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m4-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            
            {/* Reactions */}
            <div className="relative group/emoji">
              <button 
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" 
                title="React"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              {/* Emoji Picker */}
              <div className="absolute hidden group-hover/emoji:flex z-20 bg-white dark:bg-gray-800 shadow-lg rounded-full -right-2 -top-2 p-1.5">
                {["👍", "❤️", "😂", '😊', '😮', '😢', '😡', "🎉"].map((emoji) => (
                  <span
                    key={emoji}
                    className="p-1.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    onClick={() => onReact && onReact(message._id, emoji)}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Reply To */}
          {message.replyTo && (
            <div className={`mb-2 p-2 rounded-md text-xs ${
              isSentByUser ? 'bg-blue-400/50' : 'bg-gray-200 dark:bg-gray-600'
            }`}>
              <div className="font-semibold mb-0.5">
                {message.replyTo.sender?.name || 'Unknown'}
              </div>
              <div className="text-xs line-clamp-2">
                {message.replyTo.content}
              </div>
            </div>
          )}

          {/* Content or Edit Input */}
          {isEditing ? (
            <div className="flex flex-col space-y-2">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onEdit(message._id, editedContent);
                    setIsEditing(false);
                  }
                  if (e.key === 'Escape') {
                    setIsEditing(false);
                  }
                }}
                autoFocus
                className="text-black w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 
                bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600
                resize-none min-h-[60px]"
                placeholder="Edit your message..."
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 rounded-md text-sm font-medium text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700
                  transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onEdit(message._id, editedContent);
                    setIsEditing(false);
                  }}
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-white bg-blue-500 
                  hover:bg-blue-600 transition-colors duration-200"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="break-words whitespace-pre-wrap text-sm md:text-base">{message.content}</p>
          )}

          {/* Reactions Display */}
          {Object.keys(message.reactions || {}).length > 0 && (
            <div className={`flex -mb-2 -ml-2 mt-1.5 ${isSentByUser ? 'justify-end' : 'justify-start'}`}>
              <div className="flex flex-wrap gap-1 bg-white dark:bg-gray-800 rounded-full py-0.5 px-2 shadow-sm">
                {Object.entries(message.reactions).map(([userId, emoji]) => (
                  <span
                    key={`${userId}-${emoji}`}
                    className={`text-sm ${userId === currentUserId ? 'opacity-100' : 'opacity-80'}`}
                    title={userId === currentUserId ? "You reacted" : "User reaction"}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Time */}
          <div className={`absolute ${isSentByUser ? '-left-16' : '-right-16'} bottom-0 text-2xs text-gray-400 whitespace-nowrap`}>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {isSentByUser && (
              <span className="ml-1 inline-block">
                <FaCheckDouble className="text-green-400 inline-block" size={10} />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Avatar (on the right if sent by user) */}
      {isSentByUser && (
        <div className="flex-shrink-0 ml-2">
          <Image
            src={message.sender.avatar || fallbackAvatar}
            alt={message.sender.name}
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
          />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
