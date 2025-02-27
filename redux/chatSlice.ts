"use client";

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, store } from './store';
import { createAsyncThunk } from '@reduxjs/toolkit';

// ==================== Interfaces ====================
export interface ChatMessageType {
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

interface ConnectingAstrologer {
  id: string;
  name: string;
}

interface OnlineUser {
  userId: string;
  status: 'online' | 'offline';
}

export interface ChatUIState {
  connectingAstrologer: ConnectingAstrologer | null;
  onlineUsers: OnlineUser[];
  typingStatus: { [chatId: string]: boolean };
  summaries: { [chatId: string]: string };
  unreadCounts: { [chatId: string]: number };
}

// ==================== Initial State ====================

const initialState: ChatUIState = {
  connectingAstrologer: null,
  onlineUsers: [],
  typingStatus: {},
  summaries: {},
  unreadCounts: {},
};

export const deleteConversation = createAsyncThunk<void, string, { state: RootState }>(
  'chatUI/deleteConversation',
  async (chatId, { getState }) => {
    const state = getState();
    const token = state.user.token;
    await fetch(`/api/v1/chat/${chatId}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    });
  }
);


// ==================== Slice ====================

export const chatSlice = createSlice({
  name: 'chatUI',
  initialState,
  reducers: {
    setConnectingAstrologer: (
      state,
      action: PayloadAction<ConnectingAstrologer>
    ) => {
      state.connectingAstrologer = action.payload;
    },
    clearConnectingAstrologer: (state) => {
      state.connectingAstrologer = null;
    },
    setOnlineUser: (state, action: PayloadAction<OnlineUser>) => {
      const index = state.onlineUsers.findIndex(u => u.userId === action.payload.userId);
      if (index !== -1) {
        state.onlineUsers[index].status = action.payload.status;
      } else {
        state.onlineUsers.push(action.payload);
      }
    },
    setOfflineUser: (state, action: PayloadAction<string>) => {
      const user = state.onlineUsers.find(u => u.userId === action.payload);
      if (user) {
        user.status = 'offline';
      }
    },
    setTypingStatus: (state, action: PayloadAction<{ chatId: string; isTyping: boolean }>) => {
      state.typingStatus[action.payload.chatId] = action.payload.isTyping;
    },
    setSummary: (state, action: PayloadAction<{ chatId: string; summary: string }>) => {
      state.summaries[action.payload.chatId] = action.payload.summary;
    },

    // ==================== Reducers for Reactions ====================

    /**
     * Adds or updates a reaction for a specific message.
     * @param action.payload - { chatId, messageId, userId, reaction }
     */
    addReaction: (
      state,
      action: PayloadAction<{
        chatId: string;
        messageId: string;
        userId: string;
        reaction: string;
      }>
    ) => {
      // If you decide to store messages in Redux, implement logic here
      // Example:
      /*
      const { chatId, messageId, userId, reaction } = action.payload;
      const chat = state.messages[chatId];
      if (chat) {
        const message = chat.find(msg => msg._id === messageId);
        if (message) {
          message.reactions = message.reactions || {};
          message.reactions[userId] = reaction;
        }
      }
      */
      // Currently, messages are managed in component state
      // This reducer is a placeholder for future implementation
    },

    /**
     * Removes a reaction from a specific message.
     * @param action.payload - { chatId, messageId, userId }
     */
    removeReaction: (
      state,
      action: PayloadAction<{
        chatId: string;
        messageId: string;
        userId: string;
      }>
    ) => {
      // Placeholder for future implementation
      /*
      const { chatId, messageId, userId } = action.payload;
      const chat = state.messages[chatId];
      if (chat) {
        const message = chat.find(msg => msg._id === messageId);
        if (message && message.reactions) {
          delete message.reactions[userId];
        }
      }
      */
    },

    /**
     * Clears all reactions from a specific message.
     * @param action.payload - { chatId, messageId }
     */
    clearReactions: (
      state,
      action: PayloadAction<{
        chatId: string;
        messageId: string;
      }>
    ) => {
      // Placeholder for future implementation
      /*
      const { chatId, messageId } = action.payload;
      const chat = state.messages[chatId];
      if (chat) {
        const message = chat.find(msg => msg._id === messageId);
        if (message) {
          message.reactions = {};
        }
      }
      */
    },

    /**
     * Sets the reactions for a specific message.
     * Useful when receiving updated reactions from the server.
     * @param action.payload - { chatId, messageId, reactions }
     */
    setMessageReactions: (
      state,
      action: PayloadAction<{
        chatId: string;
        messageId: string;
        reactions: { [userId: string]: string };
      }>
    ) => {
      // Placeholder for future implementation
      /*
      const { chatId, messageId, reactions } = action.payload;
      const chat = state.messages[chatId];
      if (chat) {
        const message = chat.find(msg => msg._id === messageId);
        if (message) {
          message.reactions = reactions;
        }
      }
      */
    },

    incrementUnreadCount: (state, action: PayloadAction<string>) => {
      const chatId = action.payload;
      state.unreadCounts[chatId] = (state.unreadCounts[chatId] || 0) + 1;
    },
    markChatAsRead: (state, action: PayloadAction<string>) => {
      const chatId = action.payload;
      state.unreadCounts[chatId] = 0;
    },
    setUnreadCounts: (state, action: PayloadAction<{ [chatId: string]: number }>) => {
      state.unreadCounts = action.payload;
    },
  },
  // Keep only this extraReducers
  extraReducers: (builder) => {
    builder.addCase(deleteConversation.fulfilled, (state, action) => {
      const chatId = action.meta.arg;
      // Remove references to the deleted chat from all relevant state properties
      delete state.typingStatus[chatId];
      delete state.summaries[chatId];
      delete state.unreadCounts[chatId];
    });
  },
});

// ==================== Exported Actions ====================

export const {
  setConnectingAstrologer,
  clearConnectingAstrologer,
  setOnlineUser,
  setOfflineUser,
  setTypingStatus,
  setSummary,
  addReaction,
  removeReaction,
  clearReactions,
  setMessageReactions,
  incrementUnreadCount, markChatAsRead, setUnreadCounts 
} = chatSlice.actions;

// ==================== Selectors ====================

export const selectConnectingAstrologer = (state: RootState) =>
  state.chatUI.connectingAstrologer;

export const selectOnlineUsers = (state: RootState) =>
  state.chatUI.onlineUsers;

export const selectTypingStatus = (state: RootState, chatId: string) =>
  state.chatUI.typingStatus[chatId] || false;

export const selectSummary = (state: RootState, chatId: string) =>
  state.chatUI.summaries[chatId] || '';

// Optional Selectors for Reactions (if messages are stored in Redux)
/*
export const selectMessageReactions = (state: RootState, chatId: string, messageId: string) => {
  const chat = state.chatUI.messages[chatId];
  if (chat) {
    const message = chat.find(msg => msg._id === messageId);
    return message?.reactions || {};
  }
  return {};
};
*/

export const selectUnreadCounts = (state: RootState) => state.chatUI.unreadCounts;
export const selectUnreadCount = (state: RootState, chatId: string) => 
  state.chatUI.unreadCounts[chatId] || 0;

// ==================== Reducer Export ====================

export default chatSlice.reducer;
