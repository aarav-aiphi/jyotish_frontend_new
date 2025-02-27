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
    <div className={`flex items-start my-2 ${isSentByUser ? "justify-end" : "justify-start"}`}>
      {/* Avatar (on the left if not user) */}
      {!isSentByUser && (
        <Image
          src={message.sender.avatar || fallbackAvatar}
          alt="Avatar"
          width={32}
          height={32}
          className="w-8 h-8 rounded-full object-cover mx-2"
        />
      )}

      {/* Message Bubble */}
      <div
        className={`relative group max-w-[70%] p-3 rounded-xl shadow-sm ${isSentByUser
          ? "bg-blue-500 text-white rounded-bl-none"
          : "bg-gray-200 text-black rounded-br-none"
          }`}
      >
        {/* Enhanced Hover Actions - WhatsApp style */}
        <div className={`absolute hidden group-hover:flex items-center space-x-1 p-1 rounded-lg bg-white shadow-md ${isSentByUser ? 'right-2 -top-8' : 'left-2 -top-8'
          }`}>
          <button
            onClick={handleReply}
            className="p-1 hover:bg-gray-100 rounded"
            title="Reply"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
          {isSentByUser && canEdit() && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-gray-100 rounded"
                title="Edit"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(message._id)}
                className="p-1 hover:bg-gray-100 rounded"
                title="Delete"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m4-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
          <div className="relative group/emoji">
            <button className="p-1 hover:bg-gray-100 rounded" title="React">
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div className="absolute hidden group-hover/emoji:flex bg-white shadow-md rounded-lg -right-2 -top-8 p-1">
              {["👍", "❤️", "😂", '😊', '😮', '😢', '😡', "🎉"].map((emoji) => (
                <span
                  key={emoji}
                  className="p-1 cursor-pointer hover:bg-gray-100 rounded"
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
          <div className="mb-1 p-2 bg-gray-300 rounded">
            <strong>
              {message.replyTo.sender?.name || 'Unknown'}:
            </strong>{' '}
            {message.replyTo.content}
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
              className={`text-black w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 
                ${isSentByUser ? 'bg-blue-50' : 'bg-white'} 
                resize-none min-h-[60px]`}
              placeholder="Edit your message..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 rounded-md text-sm font-medium text-red-400 hover:bg-gray-100 
                  transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onEdit(message._id, editedContent);
                  setIsEditing(false);
                }}
                className="px-3 py-1 rounded-md text-sm font-medium text-white bg-blue-500 
                  hover:bg-blue-600 transition-colors duration-200"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="break-words whitespace-pre-wrap">{message.content}</p>
        )}

        {renderReactions()}

        {/* Footer (Time + Double Tick) */}
        <div className="relative flex justify-between items-center mt-1 text-xs ">
          <span>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isSentByUser && <FaCheckDouble className="ml-1 text-green-300" />}
        </div>

        {/* If you want to show inline "edit/delete" only for user within 10 mins:
            (You can remove or keep them if you're shifting everything to context menu)
        */}
        {false && isSentByUser && canEdit() && !isEditing && (
          <div className="flex space-x-2 ">
            <button onClick={() => onReply(message)} className="text-sm text-blue-500">
              Reply
            </button>
            <button onClick={() => setIsEditing(true)} className="text-sm text-yellow-500">
              Edit
            </button>
            <button onClick={() => onDelete(message._id)} className="text-sm text-red-500">
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Avatar for Sent Messages */}
      {isSentByUser && (
        <Image
          src={message.sender.avatar || fallbackAvatar}
          alt="Avatar"
          width={32}
          height={32}
          className="w-8 h-8 rounded-full object-cover mx-2"
        />
      )}
    </div>
  );
};

export default ChatMessage;
