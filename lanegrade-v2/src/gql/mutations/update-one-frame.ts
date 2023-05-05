import { gql } from "@apollo/client/core";

export const UPDATE_ONE_FRAME = gql`
mutation UpdateOneFrameMutation($updateOneFrameSet: FrameUpdateInput!, $updateOneFrameQuery: FrameQueryInput) {
  updateOneFrame(set: $updateOneFrameSet, query: $updateOneFrameQuery) {
    _id
    accepted
    ciDefectGroup
    ciDefectSeverity
    ciDefectType
    defectGroup
    defectSeverity
    defectType
    defectTypeOld
    frameId
    frameTimeDetected
    geom
    h
    imageUrl
    laneId
    lat
    long
    ownerId
    projectName
    reviewed
    roadName
    segmentNumber
    strValue
    subProjectName
    systemTag
    systemVersion
    taskId
    unitTitle
    wkt
  }
}
`;
