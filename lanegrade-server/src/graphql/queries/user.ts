import { User } from './../../types/index';
import { Document, Query } from "mongoose";
import { UserModel } from "../user-schema";
import mongoose from "mongoose";

interface Args {
  query: {
    _id?: string;
    uid?: string;
  };
}

export function user(parent: never, { query }: Args) {
  const { _id, uid } = query;

  if (_id) {
    return UserModel.findById({ _id }).populate("memberOf");
  }

  return UserModel.findOne({ uid }).populate("memberOf");
}
