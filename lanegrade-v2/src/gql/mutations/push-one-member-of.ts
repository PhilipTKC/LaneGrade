import { gql } from "@apollo/client/core";

export const PUSH_ONE_MEMBER_OF = gql`
mutation Mutation($pushOneMemberOfQuery: PushOneMemberOfQuery, $pushOneMemberOfSet: PushOneMemberOfSet) {
  pushOneMemberOf(query: $pushOneMemberOfQuery, set: $pushOneMemberOfSet) {
    _id
  }
}
`;
