import { gql } from "@apollo/client/core";

export const UPDATE_ONE_TASK = gql`
mutation UpdateOneTaskMutation($updateOneTaskSet: TaskUpdateInput!, $updateOneTaskQuery: TaskQueryInput) {
  updateOneTask(set: $updateOneTaskSet, query: $updateOneTaskQuery) {
    _id
    created
    name
    ownerId {
      _id
    }
    status
  }
}
`;
