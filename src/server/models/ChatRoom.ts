import { ChatRoom } from "../../types";
import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "ChatRoom";
const COLLECTION_NAME = "chatrooms";

const schema = new Schema<ChatRoom>({
  name: { type: String, required: true },
  userCount: { type: Number, required: true },
  createdAt: { type: Number, required: true },
});

export const ChatRoomModel = model<ChatRoom>(DOCUMENT_NAME, schema, COLLECTION_NAME);

export const seedChatRooms: Omit<ChatRoom, "_id">[] = [
  {
    name: "The Rooks",
    userCount: 0,
    createdAt: Date.now(),
  },
  {
    name: "The Bishops",
    userCount: 0,
    createdAt: Date.now(),
  },
  {
    name: "The Knights",
    userCount: 0,
    createdAt: Date.now(),
  },
  {
    name: "The Queens",
    userCount: 0,
    createdAt: Date.now(),
  },
  {
    name: "The Pawns",
    userCount: 0,
    createdAt: Date.now(),
  },
];


