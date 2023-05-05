import { gql } from "@apollo/client/core";

export const PUSH_ONE_ORGANIZATION_MEMBER = gql`
mutation Mutation($pushOneOrganizationMemberQuery: PushOneOrganizationMemberQuery, $pushOneOrganizationMemberSet: PushOneOrganizationMemberSet) {
  pushOneOrganizationMember(query: $pushOneOrganizationMemberQuery, set: $pushOneOrganizationMemberSet) {
    _id
  }
}
`;
