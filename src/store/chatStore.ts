import { ChatRoom, Message } from "@/types";
import { create } from "zustand";

interface ChatStore {
  chatRooms: ChatRoom[];
  messages: Message[];
  addMessage: (message: Message) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chatRooms: [],
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
}));