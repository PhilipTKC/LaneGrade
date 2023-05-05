import mongoose from "mongoose";
const { Schema } = mongoose;

const organizationSchema = new Schema(
  {
    name: { type: String, required: false },
    members: { type: [mongoose.Types.ObjectId], ref: "users", required: false },
    createdBy: { type: mongoose.Types.ObjectId, ref: "users", required: false },
    allowInvites: { type: Boolean, required: false },
    inviteCode: { type: String, required: false },
  },
  { collection: "organizations" }
);

const OrganizationModel = mongoose.model("organizations", organizationSchema);

export { OrganizationModel };
