import { gql } from "@apollo/client/core";

export const INSERT_ONE_TASK = gql`
mutation InsertOneTaskMutation($insertOneTaskData: TaskInsertInput!) {
  insertOneTask(data: $insertOneTaskData) {
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
