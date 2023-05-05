import { Document, Query } from "mongoose";
import { Frame } from "../../types";
import { FrameModel } from "../frame-schema";
import mongoose from "mongoose";

interface Args {
  query: {
    accepted?: boolean;
    reviewed?: boolean;
    taskId: string;
    laneId: string;
    page: number;
  };
}

export function frames(parent: never, { query }: Args) {
  const { taskId, laneId, page, accepted, reviewed } = query;

  const nPerPage = 30;
  const skip = page > 0 ? ((page - 1) * nPerPage) : 0;

  const taskObjectId = new mongoose.Types.ObjectId(taskId)
  const laneObjectId = new mongoose.Types.ObjectId(laneId);

  if (accepted === undefined || reviewed === undefined) {
    return FrameModel.find({ taskId: taskObjectId, laneId: laneObjectId }).sort({ frameId: 1, _id: 1 }).skip(skip).limit(nPerPage);
  }
  
  return FrameModel.find({ taskId: taskObjectId, laneId: laneObjectId, accepted, reviewed }).sort({ frameId: 1, _id: 1 }).skip(skip).limit(nPerPage);
}
