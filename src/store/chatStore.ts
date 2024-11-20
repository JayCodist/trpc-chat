import { ChatRoom, Message, User } from "@/types";
import { Unsubscribable } from "@trpc/server/observable";
import { create } from "zustand";

interface ChatStore {
  chatRooms: ChatRoom[];
  messagesMap: Record<string, Message[] | undefined>;
  unsubscribeMap: Record<string, Unsubscribable | undefined>;
  currentUser: User | null;
  isLoggingIn: boolean;
  addMessage: (message: Message) => void;
  setChatRooms: (chatRooms: ChatRoom[]) => void;
  setCurrentUser: (user: User) => void;
  initializeMessages: (chatRoomId: string, messages: Message[]) => void;
  setUnsubscribeMap: (
    unsubscribeMap: Record<string, Unsubscribable | undefined>
  ) => void;
  setIsLoggingIn: (isLoggingIn: boolean) => void;
  clearMessages: (chatRoomId: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chatRooms: [],
  messagesMap: {},
  unsubscribeMap: {},
  currentUser: null,
  isLoggingIn: false,
  setCurrentUser: (user: User) => set({ currentUser: user }),
  setIsLoggingIn: (isLoggingIn: boolean) => set({ isLoggingIn }),
  setUnsubscribeMap: (
    unsubscribeMap: Record<string, Unsubscribable | undefined>
  ) => set({ unsubscribeMap: unsubscribeMap }),
  clearMessages: (chatRoomId: string) =>
    set((state) => ({
      messagesMap: {
        ...state.messagesMap,
        [chatRoomId]: undefined,
      },
    })),
  initializeMessages: (chatRoomId: string, messages: Message[]) =>
    set((state) => ({
      messagesMap: {
        ...state.messagesMap,
        [chatRoomId]: messages,
      },
    })),
  addMessage: (message) =>
    set((state) => {
      return {
        messagesMap: {
          ...state.messagesMap,
          [message.chatRoomId]: [
            ...(state.messagesMap[message.chatRoomId] || []),
            message,
          ],
        },
      };
    }),
  setChatRooms: (chatRooms) =>
    set(() => ({
      chatRooms,
    })),
}));
