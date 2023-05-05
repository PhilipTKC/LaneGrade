import { gql } from "@apollo/client/core";

export const INSERT_MANY_FRAMES = gql`
mutation Mutation($insertManyFramesData: [FrameInsertInput!]!) {
  insertManyFrames(data: $insertManyFramesData) {
    _id
  }
}
`;
