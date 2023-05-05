import { gql } from "@apollo/client/core";

export const DELETE_MANY_FRAMES = gql`
mutation DeleteManyFramesMutation($deleteManyFramesQuery: FrameQueryInput) {
  deleteManyFrames(query: $deleteManyFramesQuery) {
    deletedCount
  }
}
`;
