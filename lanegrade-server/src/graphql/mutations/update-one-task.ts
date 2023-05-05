import { Document } from "mongoose";
import { TaskModel } from "../task-schema";
import mongoose from "mongoose";

interface QuerySet {
  query: {
    _id: mongoose.Types.ObjectId;
    ownerId: {
    	_id: mongoose.Types.ObjectId;
    }
  },
  set: any,
}

export async function updateOneTask(parents: never, { query, set }: QuerySet) {
  const { _id, ownerId } = query;

  return TaskModel.findOneAndUpdate({ _id, ownerId }, { $set: set }, { new: true });
}
