import { gql } from "@apollo/client/core";

export const DELETE_MANY_LANES = gql`
mutation Mutation($deleteManyLanesQuery: LaneQueryInput) {
  deleteManyLanes(query: $deleteManyLanesQuery) {
    deletedCount
  }
}
`;
