import { Message } from "../../types";
import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Message";
const COLLECTION_NAME = "messages";

const schema = new Schema<Message>({
  text: { type: String, required: true },
  timestamp: { type: Number, required: true, index: true },
  chatRoomId: { type: String, required: true, index: true },
  userName: { type: String, required: true, index: true },
  reactionDiff: { type: Number, required: true },
});

export const MessageModel = model<Message>(DOCUMENT_NAME, schema, COLLECTION_NAME);
