import { ChatRoom, Message } from "@/types";
import { create } from "zustand";

interface ChatStore {
  chatRooms: ChatRoom[];
  messagesMap: Record<string, Message[]>;
  addMessage: (message: Message) => void;
  setChatRooms: (chatRooms: ChatRoom[]) => void;
  initializeMessages: (chatRoomId: string, messages: Message[]) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chatRooms: [],
  messagesMap: {},
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
        [message.chatRoomId]: [...(state.messagesMap[message.chatRoomId] || []), message],
        },
      };
    }),
  setChatRooms: (chatRooms) =>
    set(() => ({
      chatRooms,
    })),
}));
