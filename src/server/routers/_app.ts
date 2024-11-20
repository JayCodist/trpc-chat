import { router, publicProcedure } from "../trpc";
import { observable } from "@trpc/server/observable";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { ChatRoom, messageSchema, User, Message, userSchema } from "../../types";



// In-memory message storage (replace with database later)
const messages: Message [] = [];
const chatRooms: ChatRoom[] = [
  {
    id: uuidv4(),
    name: "The Rooks",
    userCount: 0,
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    name: "The Bishops",
    userCount: 0,
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    name: "The Knights",
    userCount: 0,
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    name: "The Queens",
    userCount: 0,
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    name: "The Pawns",
    userCount: 0,
    createdAt: new Date(),
  },
];
const users: User[] = [];

export const appRouter = router({
  getChatRooms: publicProcedure.query(() => {
    return chatRooms;
  }),

  getRecentMessages: publicProcedure.input(z.object({ chatRoomId: z.string() })).query(({ input }) => {
    return messages.filter((message) => message.chatRoomId === input.chatRoomId);
  }),

  signIn: publicProcedure
    .input(userSchema.omit({ id: true }))
    .mutation(({ input }) => {
      users.push({ id: uuidv4(), ...input });
    }),

  sendMessage: publicProcedure.input(messageSchema.omit({ id: true, timestamp: true, reactionDiff: true })).mutation(({ input }) => {
    const newMessage: Message = {
      id: uuidv4(),
      text: input.text,
      timestamp: Date.now(),
      chatRoomId: input.chatRoomId,
      userName: input.userName,
      reactionDiff: 0,
    };

    messages.push(newMessage);

    // Emit to all subscribers
    (messageSubscribers[input.chatRoomId] || []).forEach((callback) => callback(newMessage));

    return newMessage;
  }),

  reactToMessage: publicProcedure
    .input(
      z.object({
        messageId: z.string(),
        type: z.enum(["like", "dislike"]),
      })
    )
    .mutation(({ input }) => {
      const message = messages.find(({ id }) => id === input.messageId);
      if (!message) {
        return;
      }

      message.reactionDiff += input.type === "like" ? 1 : -1;
    }),

  // WebSocket subscription
  onMessage: publicProcedure.input(z.object({ chatRoomId: z.string() })).subscription(({ input }) => {
    return observable<Message>((emit) => {
      const onMessage = (data: Message) => {
        emit.next(data);
      };

      (messageSubscribers[input.chatRoomId] || new Set()).add(onMessage);

      // Cleanup when client disconnects
      return () => {
        (messageSubscribers[input.chatRoomId] || new Set()).delete(onMessage);
      };
    });
  }),
});

// Set to store subscription callbacks
const messageSubscribers: Record<string, Set<(message: Message) => void>> = {};

export type AppRouter = typeof appRouter;
