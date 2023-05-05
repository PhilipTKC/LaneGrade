import { FrameModel } from "../frame-schema";
import mongoose from "mongoose";

interface Args {
    query: {
        taskId: mongoose.Types.ObjectId;
        ownerId: mongoose.Types.ObjectId;
    };
}

type DeleteManyPayload = {
    deletedCount: number
  }

export async function deleteManyFrames(parents: never, { query }: Args): Promise<DeleteManyPayload> {
    const { taskId, ownerId } = query;

    return FrameModel.deleteMany({ taskId, ownerId });
}
