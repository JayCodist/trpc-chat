"use client";

import { fetchChatRooms } from "@/services/chat";
import { useChatStore } from "@/store/chatStore";
import { useTRPCStore } from "@/store/trpcStore";
import { useEffect } from "react";

export default function Home() {
  const { initialize } = useTRPCStore();
  const { chatRooms, messagesMap, addMessage, setChatRooms } = useChatStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    fetchChatRooms();
  }, []);

  return (
    <div>
      <h1>Chatss</h1>
      <pre>{JSON.stringify(messagesMap, null, 8)}</pre>
    </div>
  );
}
