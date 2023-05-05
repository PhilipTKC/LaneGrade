import  { Document, Query } from "mongoose";
import { Task } from "../../types";
import { TaskModel } from "../task-schema";
import mongoose from "mongoose";

interface Args {
  query: {
    _id: mongoose.Types.ObjectId;
    ownerId: {
      _id: mongoose.Types.ObjectId;
    };
  };
}

export function task(parent: never, { query }: Args) {
  const { _id, ownerId } = query;
  
  return TaskModel.findOne({ _id, ownerId });
}
