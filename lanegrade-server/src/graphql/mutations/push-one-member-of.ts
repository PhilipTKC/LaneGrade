import { Document } from "mongoose";
import mongoose from "mongoose";
import { UserModel } from "../user-schema";

interface QuerySet {
  query: {
    _id: mongoose.Types.ObjectId;
  },
  set: {
    organizationId: mongoose.Types.ObjectId;
  },
}


export async function pushOneMemberOf(parents: never, { query, set }: QuerySet) {
  const { _id } = query;
  const { organizationId } = set;

  return UserModel.findOneAndUpdate({ _id }, { $push: { memberOf: organizationId } });;
}
