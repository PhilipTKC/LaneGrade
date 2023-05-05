import { gql } from "@apollo/client/core";

const GET_TASK = gql`
query Query($taskQuery: TaskQueryInput) {
  task(query: $taskQuery) {
    _id
    created
    name
    status
    ownerId {
      _id
    }
  }
}
`;

export { GET_TASK };
