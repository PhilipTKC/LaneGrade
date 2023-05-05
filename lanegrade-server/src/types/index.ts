export interface Task {
  _id: string;
  created: string;
  name: string;
  ownerId: string;
  quantity: number;
}

export interface Frame {
  accepted?: boolean;
  ciDefectGroup: number;
  ciDefectType: number;
  defectGroup: string;
  defectSeverity: string;
  defectType: string;
  frameId: number;
  frameTimeDetected: string;
  geom: null;
  h: string;
  imageUrl: string;
  laneId: string;
  lat: string;
  long: string;
  projectName: string;
  roadName: string;
  segmentNumber: number;
  strValue: number;
  subProjectName: string;
  systemTag: string;
  systemVersion: string;
  taskId: string;
  unitTitle: string;
  wkt: string;
}

export interface User {
  _id: string;
  email: string;
  uid: string;
  memberOf: String[];
  activeOrganizationId: string;
}

export interface Organization {
  _id: string;
  name: string;
  members: string[];
  createdBy: string;
}

export type Args = {
  query: {
    [key: string]: string;
  }
};
