import { gql } from "@apollo/client/core";

export const DELETE_ONE_TASK = gql`
mutation Mutation($deleteOneTaskQuery: TaskQueryInput!) {
  deleteOneTask(query: $deleteOneTaskQuery) {
    _id
  }
}
`;
