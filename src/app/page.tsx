"use client";

import {
  enterChatRoom,
  leaveChatRoom,
  sendMessage,
  signIn,
} from "@/services/chat";
import { useChatStore } from "@/store/chatStore";
import { useTRPCStore } from "@/store/trpcStore";
import { Message } from "@/types";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const { initialize } = useTRPCStore();
  const { chatRooms, messagesMap, currentUser, isLoggingIn } = useChatStore();
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn(username);
  };

  const handleSendMessage = (
    e: React.FormEvent<HTMLFormElement>,
    chatRoomId: string
  ) => {
    e.preventDefault();
    sendMessage({
      text: message,
      chatRoomId,
      userName: currentUser?.username || "",
    });
    setMessage("");
  };

  if (!currentUser) {
    return (
      <div>
        <form
          className="flex flex-col items-center justify-center h-screen mt-[-5rem]"
          onSubmit={handleSignIn}
        >
          <h1 className="text-5xl font-bold mb-20">TRPC Chat</h1>
          {errorMessage && (
            <span className="text-red-500 mb-4 p-10 bg-red-100 rounded-md">
              {errorMessage}
            </span>
          )}
          <h1 className="text-2xl font-bold mb-4">What's your username?</h1>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="border border-gray-300 rounded-md p-2 w-[25rem]"
            required
          />
          <button
            type="submit"
            className={`bg-blue-500 mt-3 w-[25rem] text-white p-2 rounded-md ${
              isLoggingIn ? "opacity-50 cursor-default" : ""
            }`}
            disabled={isLoggingIn}
          >
            Let's go
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-5xl font-bold my-5 text-center">TRPC Chat</h1>
      <div className="flex justify-between items-start mx-6">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold">Chat Rooms</h2>
          {chatRooms.map((chatRoom) => (
            <div
              key={chatRoom._id}
              className="flex items-center gap-2 m-2 relative p-2 bg-gray-100 rounded-md text-sm w-[20vw] h-[5rem]"
            >
              <span>{chatRoom.name}</span>
              <span className="text-xs text-gray-400">
                ({chatRoom.userCount} members)
              </span>
              <button
                className={`absolute bottom-2 right-5 font-bold ${
                  messagesMap[chatRoom._id] ? "text-red-500" : "text-green-500"
                }`}
                onClick={() =>
                  messagesMap[chatRoom._id]
                    ? leaveChatRoom(chatRoom._id)
                    : enterChatRoom(chatRoom._id)
                }
              >
                {messagesMap[chatRoom._id] ? "Leave" : "Join"}
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 w-[60vw]">
          {Object.entries(messagesMap)
            .filter(([, messages]) => messages)
            .map(([chatRoomId, messages]) => (
              <div
                key={chatRoomId}
              className="w-full relative h-[60vh] mb-6 flex flex-col justify-between border border-gray-300 rounded-md px-4 pb-20"
            >
              <h1 className="text-xl font-bold mt-2 mb-6 text-center">
                {
                  chatRooms.find((chatRoom) => chatRoom._id === chatRoomId)
                    ?.name
                }{" "}
                Chat
              </h1>
              <Messages messages={messages} />
              <form
                className="flex gap-2 absolute bottom-0 left-0 w-full"
                onSubmit={(e) => handleSendMessage(e, chatRoomId)}
              >
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Enter Message for the ${
                    chatRooms.find((chatRoom) => chatRoom._id === chatRoomId)
                      ?.name
                  } Chat`}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
                <button className="bg-blue-500 text-white p-2 rounded-md">
                  Send
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Messages = ({ messages }: { messages: Message[] | undefined }) => {
  const chatRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div className="flex flex-col gap-2 min-h-[10rem] overflow-y-auto" ref={chatRef}>
      {messages?.map((message) => (
        <div
          key={message._id}
          className="bg-gray-100 px-4 py-2 rounded-md flex flex-col gap-2 relative"
        >
          <span className="text-xs text-gray-400">@{message.userName}</span>
          <span className="text-xs text-gray-400 absolute top-2 right-2">
            {new Date(message.timestamp).toLocaleTimeString("en", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              day: "numeric",
              month: "long",
            })}
          </span>
          <span>{message.text}</span>
          <span className="flex items-center gap-2">
            <button className="text-xs text-gray-400">
              <img src="/thumbs-up.svg" alt="thumbs up" className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-400">
              {message.reactionDiff}
            </span>
            <button className="text-xs text-gray-400">
              <img src="/thumbs-down.svg" alt="thumbs down" className="w-4 h-4" />
            </button>
          </span>
        </div>
      ))}
    </div>
  );
};
