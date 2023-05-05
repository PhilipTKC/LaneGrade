import { gql } from "@apollo/client/core";

const GET_LANE = gql`
query Query($laneQuery: LaneQueryInput) {
  lanes(query: $laneQuery) {
    _id
    accepted
    name
    ownerId {
      _id
    }
    quantity
    rejected
    reviewed
    taskId {
      _id
    }
  }
}
`;

export { GET_LANE };
