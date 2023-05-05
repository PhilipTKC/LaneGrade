import { Document } from "mongoose";
import { UserModel } from "../user-schema";
import { User } from "../../types";
import mongoose from "mongoose";

interface Data {
  data: {
    name: string;
    email: string;
    uid: string;
    memberOf: string;
    activeOrganizationId: any;
    isOnboarded: boolean;
  }
}

export async function insertOneUser(parents: never, { data }: Data) {
  const { name, email, uid, memberOf, activeOrganizationId, isOnboarded } = data;

  return UserModel.create({ name, email, uid, memberOf: [], activeOrganizationId, isOnboarded });
}
