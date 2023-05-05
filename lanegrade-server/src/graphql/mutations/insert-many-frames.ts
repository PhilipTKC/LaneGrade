import { Document } from "mongoose";
import { FrameModel } from "../frame-schema";
import { Frame } from "../../types";

interface Data {
  data: Document<Frame[]>
}

export async function insertManyFrames(parents: never, { data }: Data) {

  return FrameModel.insertMany(data, { ordered: true });
}
