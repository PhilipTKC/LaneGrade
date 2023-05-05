import { gql } from "@apollo/client/core";

export const UPDATE_ONE_LANE = gql`
mutation UpdateOneLane($taskId: ObjectId!, $ownerId: ObjectId!, $laneId: ObjectId!, $lane: LaneUpdateInput!) {
  updateOneLane(query: {taskId: $taskId, ownerId: $ownerId, _id: $laneId}, set: $lane) {
    _id
    accepted
    name
    ownerId {
      _id
    }
    rejected
    taskId {
      _id
    }
  }
}
`;
