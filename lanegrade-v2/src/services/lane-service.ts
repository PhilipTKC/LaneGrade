import { DI } from "aurelia";

import { IMongoService, MongoLane, MongoTask } from "common/interfaces";

import { apolloClient } from "gql/client";
import * as queries from "gql/queries";
import * as mutations from "gql/mutations";
import { ApolloCache, InMemoryCache } from "@apollo/client";
import { Task } from "@aurelia/kernel";
import { DocumentNode } from "graphql";
import produce from "immer";
import { QueryKey } from "common/enums";

export const ILaneService = DI
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  .createInterface<ILaneService>("ILaneService", (x) => x.singleton(LaneService));

// eslint-disable-next-line @typescript-eslint/no-redeclare
export interface ILaneService extends LaneService {}

// eslint-disable-next-line max-len
export class LaneService implements IMongoService<MongoLane | MongoLane[] | void> {
  async retrieveOne(): Promise<MongoLane> {
    throw new Error("Method not implemented.");
  }

  async retrieveMany(taskId: string): Promise<MongoLane[]> {
    const variables = {
      lanesQuery: {
        taskId: {
          _id: taskId,
        },
      },
    };

    const response = await apolloClient.query({
      query: queries.GET_LANES,
      variables,
      fetchPolicy: "no-cache",
    });

    return response.data.lanes;
  }

  async insertOne(
    name: string,
    organizationId: string,
    taskId: string,
    quantity: number,
  ): Promise<MongoLane> {
    const variables = {
      insertOneLaneData: {
        name,
        ownerId: { link: organizationId },
        taskId: { link: taskId },
        quantity,
      },
    };

    const response = await apolloClient.mutate({
      mutation: mutations.INSERT_ONE_LANE,
      variables,
    });

    return response.data.insertOneLane;
  }

  async insertMany(): Promise<MongoLane[]> {
    throw new Error("Method not implemented.");
  }

  async updateOne(): Promise<MongoLane> {
    throw new Error("Method not implemented.");
  }

  async updateMany(): Promise<MongoLane[]> {
    throw new Error("Method not implemented.");
  }

  async deleteOne(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async deleteMany(taskId: string, ownerId: string): Promise<void> {
    const variables = {
      deleteManyLanesQuery: {
        taskId: {
          _id: taskId,
        },
        ownerId: {
          _id: ownerId,
        },
      },
    };

    await apolloClient.mutate({
      mutation: mutations.DELETE_MANY_LANES,
      variables,
    });
  }

  async addOrRemoveFrame(
    id: string,
    ownerId: string,
    taskId: string,
    accepted: boolean,
    frameId: string,
  ): Promise<MongoLane> {
    let keyValue: string;

    if (accepted) {
      keyValue = "accepted";
    } else if (keyValue === null) {
      keyValue = "review";
    } else {
      keyValue = "rejected";
    }

    const variables = {
      addOrRemoveFrameQuery: {
        _id: id,
        ownerId,
        taskId,
        [keyValue]: true,
      },
      addOrRemoveFrameSet: {
        frameId,
      },
    };

    const response = await apolloClient.mutate({
      mutation: mutations.ADD_OR_REMOVE_FRAME,
      variables,
    });

    return response.data.addOrRemoveFrame;
  }

  private readQuery(
    query: DocumentNode,
    cache: ApolloCache<InMemoryCache>,
    variables: any,
  ): { tasks: MongoTask[] } {
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
    nextState: unknown,
  ): void {
    cache.writeQuery({
      query,
      variables: queryVars,
      data: { [key]: nextState },
    });
  }
}
