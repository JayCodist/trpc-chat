import { router, publicProcedure } from "../trpc";
import { observable } from "@trpc/server/observable";
import { z } from "zod";
import { messageSchema, Message, userSchema } from "../../types";
import { ChatRoomModel } from "../models/ChatRoom";
import { UserModel } from "../models/User";
import { MessageModel } from "../models/Message";

export const appRouter = router({
  getChatRooms: publicProcedure.query(() => {
    return ChatRoomModel.find().lean().exec();
  }),

  getRecentMessages: publicProcedure.input(z.object({ chatRoomId: z.string() })).query(({ input }) => {
    return MessageModel.find({ chatRoomId: input.chatRoomId }).sort({ timestamp: -1 }).limit(100).lean().exec();
  }),

  signIn: publicProcedure
    .input(userSchema.omit({ id: true }))
    .mutation(({ input }) => {
      return UserModel.create({ ...input });
    }),

  sendMessage: publicProcedure.input(messageSchema.omit({ id: true, timestamp: true, reactionDiff: true })).mutation(async ({ input }) => {
    const newMessage: Omit<Message, "id"> = {
      text: input.text,
      timestamp: Date.now(),
      chatRoomId: input.chatRoomId,
      userName: input.userName,
      reactionDiff: 0,
    };

    const { id } = await MessageModel.create(newMessage);

    // Emit to all subscribers
    (messageSubscribers[input.chatRoomId] || []).forEach((callback) => callback({ ...newMessage, id }));

    return { ...newMessage, id };
  }),

  reactToMessage: publicProcedure
    .input(
      z.object({
        messageId: z.string(),
        type: z.enum(["like", "dislike"]),
      })
    )
    .mutation(async ({ input }) => {
      const message = await MessageModel.findById(input.messageId);
      if (!message) {
        return;
      }

      message.reactionDiff += input.type === "like" ? 1 : -1;
      await message.save();
    }),

  // WebSocket subscription
  onMessage: publicProcedure.input(z.object({ chatRoomId: z.string() })).subscription(async ({ input }) => {
    const chatRoom = await ChatRoomModel.findById(input.chatRoomId);
    if (!chatRoom) {
      throw new Error("Chat room not found");
    }
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
