import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

export interface Dictionary<T> {
  [index: string]: T;
}

interface FirebaseUserMetaData {
  createdAt: string;
  creationTime: string;
  lastLoginAt: string;
  lastSignInTime: string;
}

export interface FirebaseUser {
  displayName: string;
  email: string;
  uid: string;
  metadata: FirebaseUserMetaData;
}

export interface AtlasUser {
  __typename: string;
  _id: string;
  uid: string;
  email: string;
  isOnboarded: boolean;
  activeOrganizationId: {
    _id?: string;
    name?: string;
  };
  memberOf: string[];
}

export interface State {
  isChangingRoute: boolean;
  atlasUser: AtlasUser;
  firebaseUser: FirebaseUser;
  organization: MongoOrganization;
}

export interface FrameInput {
  CI_DefectGroup: number;
  CI_DefectType: number;
  DefectGroup: string;
  DefectSeverity: string;
  DefectType: string;
  FrameId: number;
  FrameTimeDetected: string;
  Geom: null;
  H: string;
  ImageUrl: string;
  Long: string;
  ProjectName: string;
  Reviewed: boolean;
  RoadName: string;
  SegmentNumber: number;
  StrValue: number;
  SubProjectName: string;
  UnitTitle: string;
  WKT: string;
  lat: string;
  sys_tag: string;
  sys_version: string;
}

export interface FrameOutput {
  ciDefectGroup: number;
  ciDefectSeverity: number;
  ciDefectType: number;
  defectGroup: string;
  defectSeverity: string;
  defectType: string;
  frameId: number;
  frameTimeDetected: string;
  geom: null;
  h: string;
  imageUrl: string;
  lat: string;
  long: string;
  projectName: string;
  roadName: string;
  segmentNumber: number;
  strValue: string | number;
  subProjectName: string;
  systemTag: string;
  systemVersion: string;
  unitTitle: string;
  wkt: string;
}

export interface MongoFrame extends FrameOutput {
  __typename?: string;
  _id?: string;
  id?: string;
  accepted?: boolean;
  laneId?: any;
  ownerId?: any;
  reviewed?: boolean;
  taskId?: any;
  defectTypeOld?: string;
}

export interface MongoLane {
  _id: string;
  accepted: string[];
  name: string;
  ownerId: string;
  quantity: number;
  rejected: string[];
  review: string[];
  reviewed: string[];
  taskId: {
    _id: string;
  }
}

export interface MongoOrganization {
  _id: string;
  members: string[];
  name: string;
  createdBy: {
    _id: string;
  };
  allowInvites: boolean;
  inviteCode: string;
}

export interface MongoTask {
  __typename: string;
  _id: string;
  created: string;
  name: string;
  ownerId: string;
  quantity: number;
}

export interface IMongoService<T> {
  retrieveOne(...args: any[]): Promise<T>;
  retrieveMany(...args: any[]): Promise<T>;
  insertOne(...args: any[]): Promise<T>;
  insertMany(...args: any[]): Promise<T>;
  updateOne(...args: any[]): Promise<T>;
  updateMany(...args: any[]): Promise<T>;
  deleteOne(...args: any[]): Promise<T>;
  deleteMany(...args: any[]): Promise<T>;
}

export interface IUserMongoService<T> {
  retrieveUserById(id: string): Promise<T>;
  retrieveUserByUid(): Promise<T>;
  pushMemberOf(): Promise<T>;
  updateUser(): Promise<T>;
  deleteUser(): Promise<void>;
}
