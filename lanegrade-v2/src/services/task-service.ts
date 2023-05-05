import { DI } from "aurelia";

import { IMongoService, MongoTask } from "common/interfaces";

import { apolloClient } from "gql/client";
import * as queries from "gql/queries";
import * as mutations from "gql/mutations";
import { ApolloCache, InMemoryCache } from "@apollo/client";
import { QueryKey } from "common/enums";
import { DocumentNode } from "graphql";
import produce from "immer";

export const ITaskService = DI
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  .createInterface<ITaskService>("ITaskService", (x) => x.singleton(TaskService));

// eslint-disable-next-line @typescript-eslint/no-redeclare
export interface ITaskService extends TaskService {}

// eslint-disable-next-line max-len
export class TaskService implements IMongoService<MongoTask | MongoTask[] | void> {
  async retrieveOne(taskId: string, ownerId: string): Promise<MongoTask> {
    const variables = {
      taskQuery: {
        _id: taskId,
        ownerId: {
          _id: ownerId,
        },
      },
    };

    const response = await apolloClient.query({
      query: queries.GET_TASK,
      variables,
    });

    return response.data.task;
  }

  async retrieveMany(organizationId: string, searchQuery?: string): Promise<MongoTask[]> {
    const variables = {
      tasksQuery: {
        ownerId: {
          _id: organizationId,
        },
        searchQuery,
      },
    };

    const response = await apolloClient.query({
      query: queries.GET_TASKS,
      variables,
      fetchPolicy: "no-cache",
    });

    return response.data.tasks;
  }

  async insertOne(name: string, organizationId: string): Promise<MongoTask> {
    const variables = {
      insertOneTaskData: {
        name,
        ownerId: {
          link: organizationId,
        },
      },
    };

    const response = await apolloClient.mutate({
      mutation: mutations.INSERT_ONE_TASK,
      variables,
      update: (cache, { data: { insertOneTask } }) => {
        if (!insertOneTask) {
          return;
        }

        try {
          const { tasks } = this.readQuery(queries.GET_TASKS, cache, variables);

          const nextState = produce(tasks, (draft: MongoTask[]) => {
            draft.unshift(insertOneTask);
          });

          this.writeQuery(queries.GET_TASKS, QueryKey.getTasks, cache, variables, nextState);
        } catch (error) {
          //
        }
      },
    });

    return response.data.insertOneTask;
  }

  async insertMany(): Promise<MongoTask[]> {
    throw new Error("Method not implemented.");
  }

  async updateOne(): Promise<MongoTask> {
    throw new Error("Method not implemented.");
  }

  async updateMany(): Promise<MongoTask[]> {
    throw new Error("Method not implemented.");
  }

  async deleteOne(id: string, ownerId: string): Promise<void> {
    const variables = {
      deleteOneTaskQuery: {
        _id: id,
        ownerId: {
          _id: ownerId,
        },
      },
    };

    await apolloClient.mutate({
      mutation: mutations.DELETE_ONE_TASK,
      variables,
    });
  }

  async deleteMany(): Promise<void> {
    throw new Error("Method not implemented.");
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
    key: QueryKey,
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
