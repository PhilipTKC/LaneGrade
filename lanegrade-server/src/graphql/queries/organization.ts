import { OrganizationModel } from "../organization-schema";
import { Aggregate, Document, Query } from "mongoose";
import mongoose from "mongoose";

interface Args {
  query: {
    _id: mongoose.Types.ObjectId;
    inviteCode: string;
  };
}

export function organization(parent: never, { query }: Args) {
  const { _id, inviteCode } = query;

  if (_id) {
    return OrganizationModel.findById({ _id }).populate("members");
  }

  return OrganizationModel.findOne({ inviteCode }); 
}
