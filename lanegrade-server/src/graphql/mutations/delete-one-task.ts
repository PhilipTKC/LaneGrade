import { Task } from "../../types";
import { TaskModel } from "../task-schema";
import { Document } from "mongoose";
import mongoose from "mongoose";

interface Args {
    query: {
        _id: mongoose.Types.ObjectId;
        ownerId: mongoose.Types.ObjectId;
    };
}

export async function deleteOneTask(parents: never, { query }: Args): Promise<Document<Task> | null> {
    const { _id, ownerId } = query;

    return TaskModel.findByIdAndDelete({ _id, ownerId });
}
