import mongoose from "mongoose";

const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    name: { type: String, required: false },
    ownerId: { type: mongoose.Types.ObjectId, ref: "organizations", required: true },
    created: { type: String, required: false },
    status: { type: String, required: false }
  },
  { collection: "tasks" }
);

const TaskModel = mongoose.model("tasks", taskSchema);

export { TaskModel };
