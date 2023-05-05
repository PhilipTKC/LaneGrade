import { Document } from "mongoose";
import { LaneModel } from "../lane-schema";
import mongoose from "mongoose";

interface QuerySet {
  query: {
    taskId: string;
    laneId: string;
    _id: string;
    ownerId: string;
  },
  set: any,
}


export async function updateOneLane(parents: never, { query, set }: QuerySet) {
  const { _id, taskId, ownerId } = query;

  return LaneModel.findOneAndUpdate({ _id, taskId, ownerId }, { $set: set }, { new: true });
}
