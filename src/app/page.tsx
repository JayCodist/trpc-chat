"use client";

import { useChatStore } from "@/store/chatStore";
import { useTRPCStore } from "@/store/trpcStore";
import { useEffect } from "react";

export default function Home() {
  const { client, initialize } = useTRPCStore();
  const { chatRooms, messages, addMessage } = useChatStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div>
      <h1>Chat Rooms</h1>
      <pre>{JSON.stringify(chatRooms, null, 2)}</pre>
    </div>
  );
}
