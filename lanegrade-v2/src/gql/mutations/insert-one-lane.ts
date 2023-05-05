import { gql } from "@apollo/client/core";

export const INSERT_ONE_LANE = gql`
mutation InsertOneLaneMutation($insertOneLaneData: LaneInsertInput!) {
  insertOneLane(data: $insertOneLaneData) {
    _id
    accepted
    name
    ownerId {
      _id
    }
    quantity
    rejected
    review
    reviewed
    taskId {
      _id
    }
  }
}
`;
