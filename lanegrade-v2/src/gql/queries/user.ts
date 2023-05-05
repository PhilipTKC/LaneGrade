import { gql } from "@apollo/client/core";

const GET_USER = gql`
query Query($userQuery: UserQueryInput) {
  user(query: $userQuery) {
    _id
    activeOrganizationId {
      _id
      name
    }
    email
    isOnboarded
    memberOf
    name
    uid
  }
}
`;

export { GET_USER };
