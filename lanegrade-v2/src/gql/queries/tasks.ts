import { gql } from "@apollo/client/core";

const GET_TASKS = gql`
query Query($tasksQuery: TaskQueryInput) {
  tasks(query: $tasksQuery) {
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

export { GET_TASKS };
