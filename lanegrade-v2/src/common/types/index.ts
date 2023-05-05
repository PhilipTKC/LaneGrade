import { MongoFrame } from "common/interfaces";

export type AuthMode = "login" | "register";

export type Header = {
  old: string;
  new: string;
  selected: boolean;
  keep: boolean;
};

export type StagingList = {
  data: MongoFrame[],
  fileName: string;
  headers: Header[];
  isDeleting: boolean;
  fileId: string;
  frameQuantity: number;
};
