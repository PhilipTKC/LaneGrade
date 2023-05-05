import { gql } from "@apollo/client/core";

export const UPDATE_ONE_ORGANIZATION = gql`
mutation UpdateOneOrganizationMutation($updateOneOrganizationSet: OrganizationUpdateInput!, $updateOneOrganizationQuery: OrganizationQueryInput) {
  updateOneOrganization(set: $updateOneOrganizationSet, query: $updateOneOrganizationQuery) {
    _id
    allowInvites
    inviteCode
    name
    createdBy {
      _id
    }
    members {
      email
      name
    }
  }
}
`;
