import { User } from "../../types";
import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "users";

const schema = new Schema<User>({
  username: { type: String, required: true, index: true },
});

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
