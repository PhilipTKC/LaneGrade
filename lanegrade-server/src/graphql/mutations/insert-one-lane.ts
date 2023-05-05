import { Document } from "mongoose";
import { LaneModel } from "../lane-schema";
import { Task } from "../../types";
import mongoose from "mongoose";

interface Data {
  data: {
    name: string;
    taskId: any;
    ownerId: any;
    quantity: number;
  }
}

export async function insertOneLane(parents: never, { data }: Data) {
  const { name, taskId, ownerId, quantity } = data;

  return LaneModel.create({ name, taskId: taskId.link, ownerId: ownerId.link, accepted: [], rejected: [], reviewed: [], quantity });
}
