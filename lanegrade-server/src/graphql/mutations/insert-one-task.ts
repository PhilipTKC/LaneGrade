import { Document } from "mongoose";
import { TaskModel } from "../task-schema";
import { Task } from "../../types";
import mongoose from "mongoose";
import dayjs from 'dayjs';

interface Data {
  data: {
    name: string;
    ownerId: any;
  }
}

export async function insertOneTask(parents: never, { data }: Data) {
  const { name, ownerId } = data;
  
  return TaskModel.create({ name, ownerId: ownerId.link, created: dayjs().unix(), status: "Reviewing" });
}
