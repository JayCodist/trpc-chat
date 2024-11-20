import { z } from "zod";

export const messageSchema = z.object({
  id: z.string(),
  text: z.string(),
  timestamp: z.number(),
  chatRoomId: z.string(),
  userName: z.string(),
  reactionDiff: z.number().optional().default(0),
});

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
});

export const chatRoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  userCount: z.number(),
  createdAt: z.date(),
});

export type Message = z.infer<typeof messageSchema>;
export type ChatRoom = z.infer<typeof chatRoomSchema>;
export type User = z.infer<typeof userSchema>;