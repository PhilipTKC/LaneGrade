import { Frame } from "../../types";
import { FrameModel } from "../frame-schema";
import { Document } from "mongoose";
import mongoose from "mongoose";

interface QuerySet {
  query: {
    taskId: mongoose.Types.ObjectId;
    laneId: mongoose.Types.ObjectId;
    _id: mongoose.Types.ObjectId;
  },
  set: Frame,
}

export async function updateOneFrame(parents: never, { query, set }: QuerySet) {
  const { taskId, laneId, _id } = query;

  if (!taskId || !laneId || !_id) {
    return;
  }


  return FrameModel.findOneAndUpdate({ taskId, laneId, _id }, { $set: set }, { new: true });

}
