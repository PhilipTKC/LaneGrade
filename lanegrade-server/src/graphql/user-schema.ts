import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    activeOrganizationId: mongoose.Types.ObjectId,
    email: { type: String, required: false },
    name: { type: String, required: false },
    memberOf: { type: [mongoose.Types.ObjectId], required: false },
    uid: { type: String, required: false },
    isOnboarded: { type: Boolean, required: false },
  },
  { collection: "users" }
);

const UserModel = mongoose.model("users", userSchema);

export { UserModel };
