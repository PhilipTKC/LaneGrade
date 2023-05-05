import { gql } from "@apollo/client/core";

export const INSERT_ONE_ORGANIZATION = gql`
mutation Mutation($insertOneOrganizationData: OrganizationInsertInput!) {
  insertOneOrganization(data: $insertOneOrganizationData) {
    _id
    members {
      name
      email
    }
    createdBy {
      _id
    }
    name
  }
}
`;
