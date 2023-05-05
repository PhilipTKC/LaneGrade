import { LaneModel } from "../lane-schema";
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

export async function deleteManyLanes(parents: never, { query }: Args): Promise<DeleteManyPayload> {
    const { taskId, ownerId } = query;

    return LaneModel.deleteMany({ taskId, ownerId });
}
