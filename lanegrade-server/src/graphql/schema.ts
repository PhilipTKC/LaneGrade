import { gql } from "apollo-server-express";

import queries from "./resolvers/queries";
import mutations from "./resolvers/mutations";

/*
FrameQueryInput {
  defectTypeOld: String
  page: Int
  ...
}

input FrameInsertInput {
  defectTypeOld: String
  ...
}

input AddRemoveFrameQueryInput {
  _id: String
  accepted: Boolean
  laneId: String
  ownerId: String
  rejected: Boolean
  review: Boolean
  taskId: String
}

type Frame {
  defectTypeOld: String
}

input AddRemoveFrameUpdateInput {
  frameId: String
}

input FrameUpdateInput {
  defectTypeOld: String
}

addOrRemoveFrame(query: AddRemoveFrameQueryInput!, set: AddRemoveFrameUpdateInput!): Lane

input PushOneOrganizationMemberQuery {
  _id: ObjectId
}

input PushOneOrganizationMemberSet {
  userId: ObjectId
}

pushOneOrganizationMember(query: PushOneOrganizationMemberQuery, set: PushOneOrganizationMemberSet): Organization

--

input PushOneMemberOfQuery {
  _id: ObjectId
}

input PushOneMemberOfSet {
  organizationId: ObjectId
}

pushOneMemberOf(query: PushOneMemberOfQuery, set: PushOneMemberOfSet): User
*/

const typeDefs = gql`
type Query {
  frame(query: FrameQueryInput): Frame
  frames(query: FrameQueryInput, limit: Int = 100, sortBy: FrameSortByInput): [Frame]!
  lane(query: LaneQueryInput): Lane
  lanes(query: LaneQueryInput, limit: Int = 100, sortBy: LaneSortByInput): [Lane]!
  organization(query: OrganizationQueryInput): Organization
  organizations(query: OrganizationQueryInput, limit: Int = 100, sortBy: OrganizationSortByInput): [Organization]!
  task(query: TaskQueryInput): Task
  tasks(limit: Int = 100, sortBy: TaskSortByInput, query: TaskQueryInput): [Task]!
  user(query: UserQueryInput): User
  users(query: UserQueryInput, limit: Int = 100, sortBy: UserSortByInput): [User]!
}
type Mutation {
  addOrRemoveFrame(query: AddRemoveFrameQueryInput!, set: AddRemoveFrameUpdateInput!): Lane
  pushOneOrganizationMember(query: PushOneOrganizationMemberQuery, set: PushOneOrganizationMemberSet): Organization
  pushOneMemberOf(query: PushOneMemberOfQuery, set: PushOneMemberOfSet): User
  deleteManyFrames(query: FrameQueryInput): DeleteManyPayload
  deleteManyLanes(query: LaneQueryInput): DeleteManyPayload
  deleteManyOrganizations(query: OrganizationQueryInput): DeleteManyPayload
  deleteManyTasks(query: TaskQueryInput): DeleteManyPayload
  deleteManyUsers(query: UserQueryInput): DeleteManyPayload
  deleteOneFrame(query: FrameQueryInput!): Frame
  deleteOneLane(query: LaneQueryInput!): Lane
  deleteOneOrganization(query: OrganizationQueryInput!): Organization
  deleteOneTask(query: TaskQueryInput!): Task
  deleteOneUser(query: UserQueryInput!): User
  insertManyFrames(data: [FrameInsertInput!]!): Frame
  insertManyLanes(data: [LaneInsertInput!]!): InsertManyPayload
  insertManyOrganizations(data: [OrganizationInsertInput!]!): InsertManyPayload
  insertManyTasks(data: [TaskInsertInput!]!): InsertManyPayload
  insertManyUsers(data: [UserInsertInput!]!): InsertManyPayload
  insertOneFrame(data: FrameInsertInput!): Frame
  insertOneLane(data: LaneInsertInput!): Lane
  insertOneOrganization(data: OrganizationInsertInput!): Organization
  insertOneTask(data: TaskInsertInput!): Task
  insertOneUser(data: UserInsertInput!): User
  replaceOneFrame(query: FrameQueryInput, data: FrameInsertInput!): Frame
  replaceOneLane(query: LaneQueryInput, data: LaneInsertInput!): Lane
  replaceOneOrganization(query: OrganizationQueryInput, data: OrganizationInsertInput!): Organization
  replaceOneTask(data: TaskInsertInput!, query: TaskQueryInput): Task
  replaceOneUser(query: UserQueryInput, data: UserInsertInput!): User
  updateManyFrames(query: FrameQueryInput, set: FrameUpdateInput!): UpdateManyPayload
  updateManyLanes(query: LaneQueryInput, set: LaneUpdateInput!): UpdateManyPayload
  updateManyOrganizations(query: OrganizationQueryInput, set: OrganizationUpdateInput!): UpdateManyPayload
  updateManyTasks(query: TaskQueryInput, set: TaskUpdateInput!): UpdateManyPayload
  updateManyUsers(query: UserQueryInput, set: UserUpdateInput!): UpdateManyPayload
  updateOneFrame(query: FrameQueryInput, set: FrameUpdateInput!): Frame
  updateOneLane(query: LaneQueryInput, set: LaneUpdateInput!): Lane
  updateOneOrganization(query: OrganizationQueryInput, set: OrganizationUpdateInput!): Organization
  updateOneTask(query: TaskQueryInput, set: TaskUpdateInput!): Task
  updateOneUser(query: UserQueryInput, set: UserUpdateInput!): User
  upsertOneFrame(query: FrameQueryInput, data: FrameInsertInput!): Frame
  upsertOneLane(query: LaneQueryInput, data: LaneInsertInput!): Lane
  upsertOneOrganization(query: OrganizationQueryInput, data: OrganizationInsertInput!): Organization
  upsertOneTask(query: TaskQueryInput, data: TaskInsertInput!): Task
  upsertOneUser(query: UserQueryInput, data: UserInsertInput!): User
}
input PushOneOrganizationMemberQuery {
  _id: ObjectId
}

input PushOneOrganizationMemberSet {
  userId: ObjectId
}
input PushOneMemberOfQuery {
  _id: ObjectId
}
input PushOneMemberOfSet {
  organizationId: ObjectId
}
input AddRemoveFrameUpdateInput {
  frameId: String
}
input AddRemoveFrameQueryInput {
  _id: String
  accepted: Boolean
  laneId: String
  ownerId: String
  rejected: Boolean
  review: Boolean
  taskId: String
}
input UserInsertInput {
  isOnboarded: Boolean
  memberOf: [ObjectId]
  name: String
  uid: String
  _id: ObjectId
  activeOrganizationId: UserActiveOrganizationIdRelationInput
  email: String
}
input UserActiveOrganizationIdRelationInput {
  create: OrganizationInsertInput
  link: ObjectId
}
input LaneUpdateInput {
  reviewed_unset: Boolean
  quantity_inc: Int
  review: [String]
  name_unset: Boolean
  quantity: Int
  rejected: [String]
  rejected_unset: Boolean
  accepted_unset: Boolean
  ownerId_unset: Boolean
  taskId_unset: Boolean
  _id: ObjectId
  ownerId: LaneOwnerIdRelationInput
  reviewed: [String]
  name: String
  taskId: LaneTaskIdRelationInput
  _id_unset: Boolean
  accepted: [String]
  quantity_unset: Boolean
  review_unset: Boolean
}
type UpdateManyPayload {
  matchedCount: Int!
  modifiedCount: Int!
}
input TaskUpdateInput {
  name: String
  ownerId: TaskOwnerIdRelationInput
  _id: ObjectId
  _id_unset: Boolean
  created_unset: Boolean
  created: String
  name_unset: Boolean
  ownerId_unset: Boolean
  status: String
  status_unset: Boolean
}
input LaneQueryInput {
  quantity_lte: Int
  reviewed_nin: [String]
  reviewed_in: [String]
  quantity_lt: Int
  _id_ne: ObjectId
  accepted_nin: [String]
  rejected_exists: Boolean
  name_lt: String
  _id_gte: ObjectId
  taskId_exists: Boolean
  quantity_ne: Int
  review_in: [String]
  ownerId: OrganizationQueryInput
  quantity_gte: Int
  _id_exists: Boolean
  OR: [LaneQueryInput!]
  rejected: [String]
  reviewed_exists: Boolean
  quantity_nin: [Int]
  reviewed: [String]
  accepted: [String]
  quantity_in: [Int]
  accepted_exists: Boolean
  name_gte: String
  _id: ObjectId
  rejected_nin: [String]
  review: [String]
  name_ne: String
  _id_lt: ObjectId
  _id_lte: ObjectId
  name: String
  name_exists: Boolean
  _id_nin: [ObjectId]
  quantity_exists: Boolean
  ownerId_exists: Boolean
  rejected_in: [String]
  AND: [LaneQueryInput!]
  quantity: Int
  name_in: [String]
  review_exists: Boolean
  quantity_gt: Int
  review_nin: [String]
  name_nin: [String]
  name_gt: String
  _id_in: [ObjectId]
  _id_gt: ObjectId
  name_lte: String
  taskId: TaskQueryInput
  accepted_in: [String]
}
input OrganizationCreatedByRelationInput {
  create: UserInsertInput
  link: ObjectId
}
input FrameOwnerIdRelationInput {
  create: OrganizationInsertInput
  link: ObjectId
}
type DeleteManyPayload {
  deletedCount: Int!
}
input FrameUpdateInput {
  defectTypeOld: String
  long_unset: Boolean
  imageUrl: String
  _id: ObjectId
  segmentNumber_unset: Boolean
  systemVersion: Int
  strValue_unset: Boolean
  geom: String
  defectSeverity: String
  geom_unset: Boolean
  unitTitle_unset: Boolean
  defectGroup: String
  defectType_unset: Boolean
  systemVersion_inc: Int
  reviewed_unset: Boolean
  frameId_unset: Boolean
  h: String
  ciDefectSeverity_inc: Int
  reviewed: Boolean
  segmentNumber: Int
  imageUrl_unset: Boolean
  laneId_unset: Boolean
  frameId: Int
  ciDefectGroup_unset: Boolean
  ciDefectType: Int
  long: Float
  systemTag: String
  defectType: String
  projectName_unset: Boolean
  segmentNumber_inc: Int
  frameTimeDetected: String
  ciDefectSeverity_unset: Boolean
  subProjectName_unset: Boolean
  _id_unset: Boolean
  systemTag_unset: Boolean
  h_unset: Boolean
  ciDefectType_unset: Boolean
  laneId: ObjectId
  systemVersion_unset: Boolean
  frameTimeDetected_unset: Boolean
  long_inc: Float
  roadName_unset: Boolean
  wkt: String
  taskId: ObjectId
  frameId_inc: Int
  defectGroup_unset: Boolean
  ciDefectGroup: Int
  ciDefectType_inc: Int
  accepted_unset: Boolean
  lat: Float
  ciDefectSeverity: Int
  unitTitle: String
  ownerId_unset: Boolean
  wkt_unset: Boolean
  roadName: String
  subProjectName: String
  taskId_unset: Boolean
  ciDefectGroup_inc: Int
  ownerId: ObjectId
  defectSeverity_unset: Boolean
  lat_inc: Float
  strValue: String
  projectName: String
  accepted: Boolean
  lat_unset: Boolean
}
input OrganizationUpdateInput {
  allowInvites: Boolean
  _id_unset: Boolean
  createdBy: OrganizationCreatedByRelationInput
  createdBy_unset: Boolean
  inviteCode_unset: Boolean
  members_unset: Boolean
  name: String
  _id: ObjectId
  name_unset: Boolean
  inviteCode: String
  members: OrganizationMembersRelationInput
  allowInvites_unset: Boolean
}
input FrameQueryInput {
  defectTypeOld: String
  page: Int
  laneId_exists: Boolean
  roadName_lt: String
  defectGroup_ne: String
  defectSeverity_lte: String
  geom_nin: [String]
  segmentNumber_ne: Int
  defectGroup_lt: String
  frameId_lte: Int
  segmentNumber_nin: [Int]
  long_lte: Float
  defectType_nin: [String]
  ciDefectType_ne: Int
  geom_gt: String
  systemVersion_gte: Int
  ciDefectType_gte: Int
  systemTag_lte: String
  ciDefectGroup_gte: Int
  h_in: [String]
  ciDefectSeverity: Int
  geom_exists: Boolean
  wkt: String
  frameId_gt: Int
  lat_ne: Float
  strValue_gt: String
  unitTitle: String
  roadName_gte: String
  _id_gte: ObjectId
  frameId: Int
  imageUrl_in: [String]
  roadName: String
  segmentNumber: Int
  frameTimeDetected_nin: [String]
  projectName_nin: [String]
  accepted_exists: Boolean
  defectSeverity_exists: Boolean
  strValue_lte: String
  ciDefectSeverity_exists: Boolean
  defectGroup_in: [String]
  systemVersion_nin: [Int]
  imageUrl_gt: String
  systemTag: String
  defectSeverity_lt: String
  ownerId_exists: Boolean
  unitTitle_in: [String]
  frameId_gte: Int
  frameTimeDetected: String
  defectType_lt: String
  ciDefectSeverity_nin: [Int]
  frameId_nin: [Int]
  strValue_lt: String
  lat: Float
  long_ne: Float
  defectType_gte: String
  strValue_ne: String
  defectSeverity_gt: String
  ciDefectSeverity_lte: Int
  wkt_exists: Boolean
  _id_nin: [ObjectId]
  systemTag_gt: String
  strValue_exists: Boolean
  ciDefectGroup_exists: Boolean
  ciDefectType_in: [Int]
  frameId_ne: Int
  reviewed_ne: Boolean
  ciDefectSeverity_gt: Int
  ciDefectSeverity_lt: Int
  defectType_in: [String]
  lat_exists: Boolean
  wkt_nin: [String]
  unitTitle_gte: String
  ciDefectType_exists: Boolean
  strValue: String
  defectGroup_gte: String
  imageUrl_gte: String
  frameId_in: [Int]
  defectType_exists: Boolean
  subProjectName_ne: String
  ciDefectGroup_gt: Int
  systemVersion_in: [Int]
  h_nin: [String]
  wkt_in: [String]
  wkt_gte: String
  systemTag_lt: String
  frameId_exists: Boolean
  accepted: Boolean
  frameTimeDetected_in: [String]
  segmentNumber_lte: Int
  roadName_nin: [String]
  ciDefectGroup: Int
  unitTitle_exists: Boolean
  lat_lte: Float
  lat_gte: Float
  frameId_lt: Int
  projectName_gt: String
  wkt_lt: String
  unitTitle_gt: String
  defectType_lte: String
  ciDefectSeverity_in: [Int]
  long_exists: Boolean
  defectType: String
  systemVersion_gt: Int
  lat_nin: [Float]
  segmentNumber_lt: Int
  subProjectName_gt: String
  frameTimeDetected_ne: String
  h_gte: String
  reviewed_exists: Boolean
  segmentNumber_gt: Int
  taskId_exists: Boolean
  _id_gt: ObjectId
  defectGroup_lte: String
  systemTag_nin: [String]
  projectName_in: [String]
  frameTimeDetected_exists: Boolean
  imageUrl_lte: String
  frameTimeDetected_lte: String
  geom_lt: String
  h: String
  unitTitle_lte: String
  subProjectName_nin: [String]
  accepted_ne: Boolean
  segmentNumber_in: [Int]
  h_lte: String
  imageUrl_exists: Boolean
  ciDefectType_lte: Int
  segmentNumber_exists: Boolean
  subProjectName_gte: String
  defectGroup_gt: String
  lat_gt: Float
  _id: ObjectId
  systemTag_gte: String
  ownerId: ObjectId
  defectSeverity_ne: String
  ciDefectGroup_lte: Int
  AND: [FrameQueryInput!]
  wkt_ne: String
  defectSeverity_in: [String]
  geom_lte: String
  projectName_exists: Boolean
  long_nin: [Float]
  systemVersion_ne: Int
  lat_lt: Float
  subProjectName_exists: Boolean
  ciDefectGroup_lt: Int
  h_ne: String
  projectName_gte: String
  h_exists: Boolean
  subProjectName: String
  subProjectName_lte: String
  defectGroup_nin: [String]
  ciDefectType_lt: Int
  geom_ne: String
  defectType_gt: String
  unitTitle_lt: String
  _id_lt: ObjectId
  long_gte: Float
  frameTimeDetected_gte: String
  roadName_in: [String]
  strValue_in: [String]
  defectGroup: String
  h_gt: String
  ciDefectSeverity_ne: Int
  ciDefectSeverity_gte: Int
  roadName_lte: String
  ciDefectGroup_ne: Int
  projectName_lt: String
  subProjectName_in: [String]
  imageUrl_ne: String
  segmentNumber_gte: Int
  unitTitle_nin: [String]
  projectName_lte: String
  imageUrl: String
  frameTimeDetected_gt: String
  ciDefectGroup_nin: [Int]
  roadName_ne: String
  lat_in: [Float]
  geom_in: [String]
  imageUrl_nin: [String]
  geom: String
  ciDefectType_gt: Int
  defectSeverity_gte: String
  long: Float
  laneId: ObjectId
  systemTag_in: [String]
  systemVersion_exists: Boolean
  subProjectName_lt: String
  projectName_ne: String
  defectType_ne: String
  roadName_exists: Boolean
  defectGroup_exists: Boolean
  ciDefectType: Int
  h_lt: String
  systemTag_ne: String
  frameTimeDetected_lt: String
  ciDefectType_nin: [Int]
  reviewed: Boolean
  defectSeverity_nin: [String]
  geom_gte: String
  OR: [FrameQueryInput!]
  strValue_gte: String
  _id_ne: ObjectId
  imageUrl_lt: String
  systemVersion_lt: Int
  wkt_lte: String
  systemVersion: Int
  _id_exists: Boolean
  long_in: [Float]
  wkt_gt: String
  _id_in: [ObjectId]
  projectName: String
  ciDefectGroup_in: [Int]
  systemTag_exists: Boolean
  strValue_nin: [String]
  long_gt: Float
  taskId: ObjectId
  defectSeverity: String
  long_lt: Float
  unitTitle_ne: String
  systemVersion_lte: Int
  roadName_gt: String
  _id_lte: ObjectId
}
enum OrganizationSortByInput {
  NAME_ASC
  NAME_DESC
  _ID_ASC
  _ID_DESC
  CREATEDBY_ASC
  CREATEDBY_DESC
  INVITECODE_ASC
  INVITECODE_DESC
}
input OrganizationInsertInput {
  members: OrganizationMembersRelationInput
  name: String
  _id: ObjectId
  createdBy: OrganizationCreatedByRelationInput
  allowInvites: Boolean
  inviteCode: String
}
enum UserSortByInput {
  ACTIVEORGANIZATIONID_ASC
  EMAIL_ASC
  UID_ASC
  _ID_DESC
  ACTIVEORGANIZATIONID_DESC
  EMAIL_DESC
  NAME_ASC
  NAME_DESC
  UID_DESC
  _ID_ASC
}
type InsertManyPayload {
  insertedIds: [ObjectId]!
}
type Frame {
  defectTypeOld: String
  _id: ObjectId
  accepted: Boolean
  ciDefectGroup: Int
  ciDefectSeverity: Int
  ciDefectType: Int
  defectGroup: String
  defectSeverity: String
  defectType: String
  frameId: Int
  frameTimeDetected: String
  geom: String
  h: String
  imageUrl: String
  laneId: ObjectId
  lat: Float
  long: Float
  ownerId: ObjectId
  projectName: String
  reviewed: Boolean
  roadName: String
  segmentNumber: Int
  strValue: String
  subProjectName: String
  systemTag: String
  systemVersion: Int
  taskId: ObjectId
  unitTitle: String
  wkt: String
}
input OrganizationMembersRelationInput {
  link: [ObjectId]
  create: [UserInsertInput]
}
input LaneInsertInput {
  ownerId: LaneOwnerIdRelationInput
  review: [String]
  rejected: [String]
  accepted: [String]
  name: String
  taskId: LaneTaskIdRelationInput
  quantity: Int
  reviewed: [String]
  _id: ObjectId
}
input FrameTaskIdRelationInput {
  create: TaskInsertInput
  link: ObjectId
}
input LaneOwnerIdRelationInput {
  create: OrganizationInsertInput
  link: ObjectId
}
input UserQueryInput {
  email_exists: Boolean
  email_lt: String
  uid_gt: String
  email_gte: String
  isOnboarded_exists: Boolean
  name_gte: String
  email_gt: String
  email_lte: String
  uid_nin: [String]
  _id_lte: ObjectId
  _id_gt: ObjectId
  activeOrganizationId: ObjectId
  email: String
  uid: String
  OR: [UserQueryInput!]
  memberOf_in: [ObjectId]
  _id: ObjectId
  name_exists: Boolean
  email_in: [String]
  name_in: [String]
  uid_lte: String
  uid_in: [String]
  email_ne: String
  name_gt: String
  memberOf_exists: Boolean
  name_ne: String
  uid_ne: String
  _id_gte: ObjectId
  uid_gte: String
  AND: [UserQueryInput!]
  isOnboarded_ne: Boolean
  name_lte: String
  isOnboarded: Boolean
  _id_exists: Boolean
  uid_exists: Boolean
  uid_lt: String
  activeOrganizationId_exists: Boolean
  _id_lt: ObjectId
  name_nin: [String]
  name_lt: String
  memberOf_nin: [ObjectId]
  _id_nin: [ObjectId]
  name: String
  email_nin: [String]
  memberOf: [ObjectId]
  _id_ne: ObjectId
  _id_in: [ObjectId]
}
type Task {
  _id: ObjectId
  created: String
  name: String
  ownerId: Organization
  status: String
}
type Organization {
  _id: ObjectId
  allowInvites: Boolean
  createdBy: User
  inviteCode: String
  members: [User]
  name: String
}
enum TaskSortByInput {
  OWNERID_ASC
  STATUS_ASC
  STATUS_DESC
  _ID_ASC
  CREATED_ASC
  CREATED_DESC
  NAME_ASC
  NAME_DESC
  OWNERID_DESC
  _ID_DESC
}
input TaskInsertInput {
  name: String
  ownerId: TaskOwnerIdRelationInput
  status: String
  _id: ObjectId
  created: String
}
input TaskOwnerIdRelationInput {
  link: ObjectId
  create: OrganizationInsertInput
}
input LaneTaskIdRelationInput {
  create: TaskInsertInput
  link: ObjectId
}
input TaskQueryInput {
  searchQuery: String
  name_in: [String]
  status: String
  _id_in: [ObjectId]
  status_exists: Boolean
  name: String
  created_exists: Boolean
  _id_lte: ObjectId
  name_lte: String
  status_lt: String
  created: String
  created_ne: String
  ownerId_exists: Boolean
  created_nin: [String]
  created_lt: String
  name_lt: String
  _id_gte: ObjectId
  created_lte: String
  name_exists: Boolean
  _id_exists: Boolean
  created_gt: String
  status_nin: [String]
  name_gt: String
  status_lte: String
  status_gte: String
  name_gte: String
  created_gte: String
  name_ne: String
  status_ne: String
  _id: ObjectId
  status_in: [String]
  ownerId: OrganizationQueryInput
  created_in: [String]
  name_nin: [String]
  _id_ne: ObjectId
  status_gt: String
  _id_lt: ObjectId
  OR: [TaskQueryInput!]
  _id_nin: [ObjectId]
  _id_gt: ObjectId
  AND: [TaskQueryInput!]
}
type User {
  _id: ObjectId
  activeOrganizationId: Organization
  email: String
  isOnboarded: Boolean
  memberOf: [ObjectId]
  name: String
  uid: String
}
type Lane {
  _id: ObjectId
  accepted: [String]
  name: String
  ownerId: Organization
  quantity: Int
  rejected: [String]
  review: [String]
  reviewed: [String]
  taskId: Task
}
enum LaneSortByInput {
  OWNERID_DESC
  QUANTITY_ASC
  QUANTITY_DESC
  TASKID_ASC
  _ID_ASC
  _ID_DESC
  NAME_DESC
  OWNERID_ASC
  TASKID_DESC
  NAME_ASC
}
input FrameLaneIdRelationInput {
  create: LaneInsertInput
  link: ObjectId
}
input UserUpdateInput {
  _id: ObjectId
  _id_unset: Boolean
  email: String
  isOnboarded_unset: Boolean
  memberOf_unset: Boolean
  activeOrganizationId_unset: Boolean
  name: String
  email_unset: Boolean
  activeOrganizationId: ObjectId
  isOnboarded: Boolean
  uid_unset: Boolean
  name_unset: Boolean
  memberOf: [ObjectId]
  uid: String
}

scalar ObjectId

input OrganizationQueryInput {
  name: String
  name_gte: String
  inviteCode_lte: String
  allowInvites_ne: Boolean
  name_exists: Boolean
  allowInvites: Boolean
  name_lt: String
  _id_ne: ObjectId
  inviteCode_gte: String
  inviteCode_lt: String
  name_in: [String]
  inviteCode_exists: Boolean
  OR: [OrganizationQueryInput!]
  _id_exists: Boolean
  name_gt: String
  name_lte: String
  AND: [OrganizationQueryInput!]
  name_ne: String
  _id_gt: ObjectId
  allowInvites_exists: Boolean
  members_nin: [UserQueryInput]
  _id_lt: ObjectId
  createdBy: UserQueryInput
  inviteCode: String
  inviteCode_nin: [String]
  members_exists: Boolean
  _id: ObjectId
  _id_in: [ObjectId]
  createdBy_exists: Boolean
  _id_lte: ObjectId
  members: [UserQueryInput]
  inviteCode_ne: String
  members_in: [UserQueryInput]
  inviteCode_gt: String
  inviteCode_in: [String]
  _id_nin: [ObjectId]
  _id_gte: ObjectId
  name_nin: [String]
}

enum FrameSortByInput {
  DEFECTTYPE_ASC
  SEGMENTNUMBER_ASC
  SUBPROJECTNAME_ASC
  _ID_ASC
  CIDEFECTGROUP_ASC
  CIDEFECTTYPE_DESC
  DEFECTSEVERITY_ASC
  LONG_DESC
  PROJECTNAME_ASC
  WKT_DESC
  CIDEFECTSEVERITY_DESC
  GEOM_ASC
  LANEID_ASC
  LANEID_DESC
  SYSTEMVERSION_DESC
  TASKID_ASC
  DEFECTGROUP_ASC
  H_ASC
  IMAGEURL_ASC
  SYSTEMTAG_DESC
  OWNERID_ASC
  PROJECTNAME_DESC
  TASKID_DESC
  WKT_ASC
  DEFECTGROUP_DESC
  FRAMETIMEDETECTED_DESC
  LAT_ASC
  LAT_DESC
  LONG_ASC
  STRVALUE_DESC
  SYSTEMVERSION_ASC
  UNITTITLE_ASC
  DEFECTSEVERITY_DESC
  DEFECTTYPE_DESC
  FRAMEID_DESC
  GEOM_DESC
  SYSTEMTAG_ASC
  CIDEFECTGROUP_DESC
  CIDEFECTTYPE_ASC
  ROADNAME_ASC
  SUBPROJECTNAME_DESC
  UNITTITLE_DESC
  _ID_DESC
  FRAMETIMEDETECTED_ASC
  OWNERID_DESC
  SEGMENTNUMBER_DESC
  ROADNAME_DESC
  STRVALUE_ASC
  CIDEFECTSEVERITY_ASC
  FRAMEID_ASC
  H_DESC
  IMAGEURL_DESC
}

input FrameInsertInput {
  defectTypeOld: String
  ciDefectSeverity: Int
  lat: Float
  frameTimeDetected: String
  projectName: String
  strValue: String
  subProjectName: String
  frameId: Int
  reviewed: Boolean
  ciDefectGroup: Int
  defectType: String
  accepted: Boolean
  h: String
  defectGroup: String
  roadName: String
  segmentNumber: Int
  defectSeverity: String
  geom: String
  long: Float
  ciDefectType: Int
  systemVersion: Int
  systemTag: String
  taskId: ObjectId
  imageUrl: String
  laneId: ObjectId
  ownerId: ObjectId
  _id: ObjectId
  unitTitle: String
  wkt: String
}
`;


const resolvers = {
  Query: queries,
  Mutation: mutations,
};

export { typeDefs, resolvers };
