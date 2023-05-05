import { Aggregate, Document, Query } from "mongoose";
import { Task } from "../../types";
import { LaneModel } from "../lane-schema";
import mongoose from "mongoose";

interface Args {
  query: {
    taskId: mongoose.Types.ObjectId;
  };
}

export function lanes(parent: never, { query }: Args) {
  const { taskId } = query;

  return LaneModel.find({ taskId }).sort({ name: 1 });
}
