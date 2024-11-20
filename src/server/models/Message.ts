import { Message, messageSchema } from "../../types";
import { model } from "mongoose";
import { toMongooseSchema } from "mongoose-zod";

const DOCUMENT_NAME = "Message";
const COLLECTION_NAME = "messages";

const schema = toMongooseSchema(messageSchema.mongoose());

export const MessageModel = model<Message>(DOCUMENT_NAME, schema.omit(["id"]), COLLECTION_NAME);

schema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) { delete ret._id }
});
