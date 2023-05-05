import { Document } from "mongoose";
import { LaneModel } from "../lane-schema";

interface QuerySet {
  query: {
    _id: string;
    accepted: boolean | null;
    frameId: string;
    ownerId: string;
    rejected: boolean | null,
    review: boolean,
    taskId: string;
  };
  set: any;
}

export async function addOrRemoveFrame(
  parents: never,
  { query, set }: QuerySet
): Promise<any> {

  const { _id: id, taskId, ownerId, accepted, rejected, review } = query;
  const { frameId } = set;

  let lane;

  if (accepted) {
    lane = await LaneModel.findOneAndUpdate(
      { _id: id, taskId, ownerId },
      {
        $addToSet: { accepted: frameId, reviewed: frameId },
        $pull: { rejected: frameId, review: frameId },
      },
      { new: true }
    );
  }

  if (rejected) {
    lane = await LaneModel.findOneAndUpdate(
      { _id: id, taskId, ownerId },
      {
        $addToSet: { rejected: frameId, reviewed: frameId },
        $pull: { accepted: frameId, review: frameId },
      },
      { new: true }
    );
  }

  if (review) {
    lane = await LaneModel.findOneAndUpdate(
      { _id: id, taskId, ownerId },
      {
        $addToSet: { reviewed: frameId, review: frameId },
        $pull: { rejected: frameId, accepted: frameId },
      },
      { new: true }
    );
  }

  return lane;
}
