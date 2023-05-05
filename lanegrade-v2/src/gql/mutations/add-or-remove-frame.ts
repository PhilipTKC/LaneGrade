import { gql } from "@apollo/client/core";

export const ADD_OR_REMOVE_FRAME = gql`
mutation Mutation($addOrRemoveFrameQuery: AddRemoveFrameQueryInput!, $addOrRemoveFrameSet: AddRemoveFrameUpdateInput!) {
  addOrRemoveFrame(query: $addOrRemoveFrameQuery, set: $addOrRemoveFrameSet) {
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
