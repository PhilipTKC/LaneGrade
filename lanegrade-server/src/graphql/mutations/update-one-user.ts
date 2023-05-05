import { Document } from "mongoose";
import { UserModel } from "../user-schema";
import mongoose from "mongoose";

interface QuerySet {
  query: {
    _id: string;
  },
  set: {
    name: string;
    email: string;
    memberOf: string;
    activeOrganizationId: {
      link: mongoose.Types.ObjectId;
    };
    isOnboarded: boolean;
  },
}

type SetObject = { [key: string]: string | boolean | any };

export async function updateOneUser(parents: never, { query, set }: QuerySet) {
  const { _id } = query;
  const { name, email, memberOf, activeOrganizationId, isOnboarded } = set;

  const setObject: SetObject = { name, email, activeOrganizationId, isOnboarded };

  Object.keys(setObject).forEach((key: string) => { 
    if (setObject[key] === null || setObject[key] === undefined) {
      delete setObject[key];
    }
  });
  
  return UserModel.findOneAndUpdate({ _id },
    { 
      $set: setObject,
      $push: { memberOf }
    },
    { new: true });
}
