import { Store } from "@aurelia/store-v1";
import {
  DI, inject, IHttpClient,
} from "aurelia";

import { IMongoService, MongoFrame, State } from "common/interfaces";
import { apolloClient } from "gql/client";
import {
  ApolloCache, InMemoryCache,
} from "@apollo/client";
import { DocumentNode } from "graphql";

import * as queries from "gql/queries";
import * as mutations from "gql/mutations";
import { produce } from "immer";

export const IFrameService = DI
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  .createInterface<IFrameService>("IFrameService", (x) => x.singleton(FrameService));

// eslint-disable-next-line @typescript-eslint/no-redeclare
export interface IFrameService extends FrameService {}

@inject(Store, IHttpClient)
// eslint-disable-next-line max-len
export class FrameService implements IMongoService<MongoFrame | MongoFrame[] | void> {
  async retrieveOne(): Promise<MongoFrame> {
    throw new Error("Method not implemented.");
  }

  private state: State;

  async retrieveMany(
    taskId: string,
    laneId: string,
    page: number,
    accepted?: boolean,
    reviewed?: boolean,
  ): Promise<MongoFrame[]> {
    const variables = {
      framesQuery: {
        taskId,
        laneId,
        page,
        accepted,
        reviewed,
      },
    };

    const response = await apolloClient.query({
      query: queries.GET_FRAMES,
      variables,
      fetchPolicy: "no-cache",
    });

    return response.data.frames;
  }

  async insertOne(): Promise<MongoFrame> {
    throw new Error("Method not implemented.");
  }

  async insertMany(frames: MongoFrame[]): Promise<MongoFrame[]> {
    const variables = {
      insertManyFramesData: frames,
    };

    let response;
    let hasError: boolean;

    try {
      response = await apolloClient.mutate({
        mutation: mutations.INSERT_MANY_FRAMES,
        variables,
      });
    } catch (error) {
      hasError = true;
    }

    if (hasError) {
      return null;
    }

    return response.data.insertManyFrames;
  }

  async updateOne(oldFrame: MongoFrame, page: number): Promise<MongoFrame> {
    const { taskId, laneId, _id: id } = oldFrame;

    delete oldFrame.__typename;

    const variables = {
      updateOneFrameSet: {
        ...oldFrame,
        ciDefectSeverity:
        Number(oldFrame.ciDefectSeverity),
      },
      updateOneFrameQuery: {
        taskId,
        laneId,
        _id: id,
      },
    };

    const response = await apolloClient.mutate({
      mutation: mutations.UPDATE_ONE_FRAME,
      variables,
      update: (cache, { data: { updateOneFrame } }) => {
        try {
          const readQueryVars = { taskId: taskId.id, laneId: laneId.id, page };

          const { frames } = this.readQuery(
            queries.GET_FRAMES,
            cache,
            readQueryVars,
          );

          const newState = produce(frames, (draft: MongoFrame[]) => draft.map((frame) => {
            if (updateOneFrame._id === frame._id) {
              return { ...updateOneFrame, oldFrame };
            }
            return frame;
          }));

          this.writeQuery(
            queries.GET_FRAMES,
            "frames",
            cache,
            {
              taskId: taskId.id, laneId: laneId.id, page, frame: oldFrame,
            },
            newState,
          );
        } catch (error) {
          //
        }
      },
    });

    return response.data.updateOneFrame;
  }

  async updateMany(): Promise<MongoFrame[]> {
    throw new Error("Method not implemented.");
  }

  async deleteOne(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async deleteMany(taskId: string, ownerId: string): Promise<void> {
    const variables = {
      deleteManyFramesQuery: {
        taskId: {
          _id: taskId,
        },
        ownerId: {
          _id: ownerId,
        },
      },
    };

    await apolloClient.mutate({
      mutation: mutations.DELETE_MANY_FRAMES,
      variables,
    });
  }

  private readQuery(
    query: DocumentNode,
    cache: ApolloCache<InMemoryCache>,
    variables,
  ): any {
    return cache.readQuery({
      query,
      variables,
    });
  }

  private writeQuery(
    query: DocumentNode,
    key: any,
    cache: ApolloCache<InMemoryCache>,
    queryVars: any,
    nextState: any,
  ): void {
    cache.writeQuery({
      query,
      variables: queryVars,
      data: { [key]: nextState },
    });
  }
}
