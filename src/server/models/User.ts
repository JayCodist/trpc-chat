import { User, userSchema } from "../../types";
import { model } from "mongoose";
import { toMongooseSchema } from "mongoose-zod";

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "users";

const schema = toMongooseSchema(userSchema.mongoose()).index(
  { username: 1 },
);  

export const UserModel = model<User>(DOCUMENT_NAME, schema.omit(["id"]), COLLECTION_NAME);

schema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) { delete ret._id }
});
