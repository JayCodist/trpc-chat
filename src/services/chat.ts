"use client";

import { getClient } from "@/store/trpcStore";
import { useChatStore } from "@/store/chatStore";
import { Message, User } from "@/types";

export const fetchChatRooms = async () => {
  const client = getClient();
  if (!client) throw new Error("TRPC client not initialized");

  const rooms = await client.getChatRooms.query();
  useChatStore.getState().setChatRooms(rooms);
};

export const sendMessage = async ({
  text,
  chatRoomId,
  userName,
}: {
  text: string;
  chatRoomId: string;
  userName: string;
}) => {
  const client = getClient();
  if (!client) {
    return;
  }

  await client.sendMessage.mutate({
    text,
    chatRoomId,
    userName,
    _id: Date.now().toString(),
    timestamp: Date.now(),
    reactionDiff: 0,
  } as Message);
};

export const fetchMessages = async (chatRoomId: string) => {
  const client = getClient();
  if (!client) {
    return;
  }
  const messages = await client.getMessages.query({ chatRoomId });
  useChatStore.getState().initializeMessages(chatRoomId, messages);
};

export const fetchChatRoomMessages = async (chatRoomId: string) => {
  const client = getClient();
  if (!client) {
    return;
  }
  const messages = await client.getMessages.query({ chatRoomId });
  useChatStore.getState().initializeMessages(chatRoomId, messages);
};

export const signIn = async (username: string) => {
  const client = getClient();
  if (!client) {
    return;
  }
  useChatStore.getState().setIsLoggingIn(true);
  const user = await client.login.mutate({ username, _id: Date.now().toString() } as User);
  useChatStore.getState().setCurrentUser(user);
  await fetchChatRooms();
  useChatStore.getState().setIsLoggingIn(false);
};

export const enterChatRoom = async (chatRoomId: string) => {
  const client = getClient();
  if (!client) {
    return;
  }

  await fetchMessages(chatRoomId);
  const unsubscribe = client.onMessage.subscribe(
    { chatRoomId },
    {
      onData: (message: Message) => {
        useChatStore.getState().addMessage(message);
      },
    }
  );
  useChatStore
    .getState()
    .setUnsubscribeMap({
      ...(useChatStore.getState().unsubscribeMap || {}),
      [chatRoomId]: unsubscribe,
    });
  await fetchChatRooms();
};

export const leaveChatRoom = async (chatRoomId: string) => {
  const client = getClient();
  if (!client) {
    return;
  }
  const unsubscriber = useChatStore.getState().unsubscribeMap[chatRoomId];
  unsubscriber?.unsubscribe?.();
  useChatStore.getState().setUnsubscribeMap({
    ...(useChatStore.getState().unsubscribeMap || {}),
    [chatRoomId]: undefined,
  });
  await client.leaveChatRoom.mutate({ chatRoomId });
  useChatStore.getState().clearMessages(chatRoomId);
  await fetchChatRooms();
};
