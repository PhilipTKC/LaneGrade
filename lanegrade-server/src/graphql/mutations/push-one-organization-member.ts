import { Document } from "mongoose";
import { OrganizationModel } from "../organization-schema";
import mongoose from "mongoose";

interface QuerySet {
  query: {
    _id: mongoose.Types.ObjectId;
  },
  set: {
    userId: mongoose.Types.ObjectId;
  },
}


export async function pushOneOrganizationMember(parents: never, { query, set }: QuerySet) {
  const { _id } = query;
  const { userId } = set;

  return OrganizationModel.findOneAndUpdate({ _id }, { $push: { members: userId } });;
}
