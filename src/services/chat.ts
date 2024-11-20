"use client";

import { getClient } from '@/store/trpcStore';
import { useChatStore } from '@/store/chatStore';
import { Message } from '@/types';

export const fetchChatRooms = async () => {
  const client = getClient();
  if (!client) throw new Error('TRPC client not initialized');

  const rooms = await client.getChatRooms.query();
  useChatStore.getState().setChatRooms(rooms);
};

export const sendMessage = async ({ text, chatRoomId, userName }: { text: string, chatRoomId: string, userName: string }) => {
  const client = getClient();
  if (!client) {
    return;
  }

  const message = await client.sendMessage.mutate({
    text,
    chatRoomId,
    userName,
    id: "35674832",
    timestamp: Date.now(),
  } as Message);
  useChatStore.getState().addMessage(message);
}; 

export const fetchRecentMessages = async (chatRoomId: string) => {
  const client = getClient();
  if (!client) {
    return;
  }
  const messages = await client.getRecentMessages.query({ chatRoomId });
  useChatStore.getState().initializeMessages(chatRoomId, messages);
}

export const fetchChatRoomMessages = async (chatRoomId: string) => {
  const client = getClient();
  if (!client) {
    return;
  }
  const messages = await client.getRecentMessages.query({ chatRoomId });
  useChatStore.getState().initializeMessages(chatRoomId, messages);
}

export const signIn = async (username: string) => {
  const client = getClient();
  if (!client) {
    return;
  }
  await client.signIn.mutate({ username });
  fetchChatRooms();
}

export const enterChatRoom = async (chatRoomId: string) => {
  const client = getClient();
  if (!client) {
    return;
  }
  await fetchRecentMessages(chatRoomId);
  const unsubscribe = client.onMessage.subscribe({ chatRoomId }, {
    onData: (message: Message) => {
      useChatStore.getState().addMessage(message);
    }
  });
  return unsubscribe;
}