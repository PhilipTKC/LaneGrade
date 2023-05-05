import { Document } from "mongoose";
import { OrganizationModel } from "../organization-schema";
import mongoose from "mongoose";

interface QuerySet {
  query: {
    _id: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
  },
  set: any,
}


export async function updateOneOrganization(parents: never, { query, set }: QuerySet) {
  const { _id, createdBy } = query;

  return OrganizationModel.findOneAndUpdate({ _id, createdBy }, { $set: set }, { new: true }).populate("members");
}
