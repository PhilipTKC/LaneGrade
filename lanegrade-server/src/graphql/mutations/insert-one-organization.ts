import { Document } from "mongoose";
import { OrganizationModel } from "../organization-schema";
import { Organization } from "../../types";
import mongoose from "mongoose";
import { nanoid } from "nanoid";

interface Data {
  data: {
      name: string;
      createdBy: any;
      allowInvites: boolean;
      inviteCode: string;
  }
}

export async function insertOneOrganization(parents: never, { data }: Data) {
    const { name, createdBy, allowInvites, inviteCode } = data;

    const createdByObjectId = new mongoose.Types.ObjectId(createdBy.link);
    
    return OrganizationModel.create({ 
      name,
      createdBy: createdBy.link,
      members: [createdByObjectId],
      allowInvites: false,
      inviteCode: null,
    });
}
