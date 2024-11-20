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

  getMessages: publicProcedure.input(z.object({ chatRoomId: z.string() })).query(({ input }) => {
    return MessageModel.find({ chatRoomId: input.chatRoomId }).sort({ timestamp: -1 }).lean().exec();
  }),

  login: publicProcedure
    .input(userSchema.omit({ _id: true }))
    .mutation(async ({ input }) => {
      const user = await UserModel.create({ username: input.username });
      return user;
    }),

  sendMessage: publicProcedure.input(messageSchema.omit({ _id: true, timestamp: true, reactionDiff: true })).mutation(async ({ input }) => {
    const newMessage: Omit<Message, "_id"> = {
      text: input.text,
      timestamp: Date.now(),
      chatRoomId: input.chatRoomId,
      userName: input.userName,
      reactionDiff: 0,
    };

    const { _id } = await MessageModel.create(newMessage);

    // Emit to all subscribers
    (messageSubscribers[input.chatRoomId] || []).forEach((callback) => callback({ ...newMessage, _id }));

    return { ...newMessage, _id };
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
    chatRoom.userCount += 1;
    await chatRoom.save();
    return observable<Message>((emit) => {
      const onMessage = (data: Message) => {
        emit.next(data);
      };

      if (!messageSubscribers[input.chatRoomId]) {
        messageSubscribers[input.chatRoomId] = new Set();
      }
      (messageSubscribers[input.chatRoomId]).add(onMessage);

      // Cleanup when client disconnects
      return () => {
        (messageSubscribers[input.chatRoomId])?.delete(onMessage);
      };
    });
  }),

  leaveChatRoom: publicProcedure.input(z.object({ chatRoomId: z.string() })).mutation(async ({ input }) => {
    const chatRoom = await ChatRoomModel.findById(input.chatRoomId);
    if (!chatRoom) {
      return;
    }
    if (chatRoom.userCount > 0) {
      chatRoom.userCount -= 1;
      await chatRoom.save();
    }
  }),
});

// Set to store subscription callbacks
const messageSubscribers: Record<string, Set<(message: Message) => void>> = {};

export type AppRouter = typeof appRouter;
