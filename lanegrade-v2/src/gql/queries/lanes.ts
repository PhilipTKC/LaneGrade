import { gql } from "@apollo/client/core";

const GET_LANES = gql`
query Query($lanesQuery: LaneQueryInput) {
  lanes(query: $lanesQuery) {
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

export { GET_LANES };
