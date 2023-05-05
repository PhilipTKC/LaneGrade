import { gql } from "@apollo/client/core";

export const UPDATE_ONE_USER = gql`
mutation UpdateOneUserMutation($updateOneUserSet: UserUpdateInput!, $updateOneUserQuery: UserQueryInput) {
  updateOneUser(set: $updateOneUserSet, query: $updateOneUserQuery) {
    _id
    activeOrganizationId {
      _id
    }
    email
    memberOf
    uid
  }
}
`;
