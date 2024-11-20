import { ChatRoom, chatRoomSchema } from "../../types";
import { model } from "mongoose";
import { toMongooseSchema } from "mongoose-zod";

const DOCUMENT_NAME = "ChatRoom";
const COLLECTION_NAME = "chatrooms";

const schema = toMongooseSchema(chatRoomSchema.mongoose());

export const ChatRoomModel = model<ChatRoom>(DOCUMENT_NAME, schema.omit(["id"]), COLLECTION_NAME);

schema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) { delete ret._id }
});

export const seedChatRooms: Omit<ChatRoom, "id">[] = [
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


