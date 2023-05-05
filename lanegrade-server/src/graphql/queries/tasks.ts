import { Aggregate, Document, Query } from "mongoose";
import { Task } from "../../types";
import { TaskModel } from "../task-schema";
import mongoose from "mongoose";

interface Args {
  query: {
    ownerId: string;
    searchQuery: string;
  };
}

export function tasks(parent: never, { query }: Args) {
  const { ownerId, searchQuery } = query;

  if (searchQuery) {
    return TaskModel.find({
      ownerId,
      name: { "$regex": searchQuery, "$options": "i" }
    })
    .sort({ created: -1 });
  }

  return TaskModel.find({ ownerId }).sort({ created: -1 });
}
