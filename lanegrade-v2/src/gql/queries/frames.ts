import { gql } from "@apollo/client/core";

const GET_FRAMES = gql`
query Query($framesQuery: FrameQueryInput) {
  frames(query: $framesQuery, sortBy: FRAMEID_ASC) {
    _id
    accepted
    ciDefectGroup
    ciDefectSeverity
    ciDefectType
    defectGroup
    defectSeverity
    defectType
    frameId
    frameTimeDetected
    geom
    h
    imageUrl
    lat
    long
    projectName
    reviewed
    roadName
    segmentNumber
    strValue
    subProjectName
    systemTag
    systemVersion
    unitTitle
    wkt
    laneId
    ownerId
    taskId
    defectTypeOld
  }
}
`;

export { GET_FRAMES };
