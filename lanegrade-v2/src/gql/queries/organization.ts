import { gql } from "@apollo/client/core";

const GET_ORGANIZATION = gql`
query Query($organizationQuery: OrganizationQueryInput) {
  organization(query: $organizationQuery) {
    _id
    name
    members {
      _id
      name
      email
    }
    createdBy {
      _id
    }
    allowInvites
    inviteCode
  }
}
`;

const GET_ORGANIZATION_BY_INVITE_CODE = gql`
query Query($organizationQuery: OrganizationQueryInput) {
  organization(query: $organizationQuery) {
    _id
    name
  }
}
`;

export { GET_ORGANIZATION, GET_ORGANIZATION_BY_INVITE_CODE };
