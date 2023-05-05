import mongoose from "mongoose";
const { Schema } = mongoose;

const laneSchema = new Schema(
  {
    accepted: { type: [mongoose.Types.ObjectId], required: false },
    name: { type: String, required: false },
    ownerId: { type: mongoose.Types.ObjectId, ref: "users", required: false },
    quantity: { type: Number, required: false },
    rejected: { type: [mongoose.Types.ObjectId], required: false },
    review: { type: [mongoose.Types.ObjectId], required: false },
    reviewed: { type: [mongoose.Types.ObjectId], required: false },
    taskId: { type: mongoose.Types.ObjectId, ref: "tasks", required: false },
  },
  { collection: "lanes" }
);

const LaneModel = mongoose.model("lanes", laneSchema);

export { LaneModel };
