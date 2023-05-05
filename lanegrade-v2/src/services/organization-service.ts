/* eslint-disable max-classes-per-file */
import { DI } from "aurelia";

import { apolloClient } from "gql/client";

import * as queries from "gql/queries";
import * as mutations from "gql/mutations";

import { IMongoService, MongoOrganization } from "common/interfaces";

export class OrganizationService implements IMongoService<MongoOrganization | MongoOrganization[] | void> {
  async retrieveOne(id: string): Promise<MongoOrganization> {
    const variables = {
      organizationQuery: {
        _id: id,
      },
    };

    const response = await apolloClient.query({
      query: queries.GET_ORGANIZATION,
      variables,
      fetchPolicy: "no-cache",
    });

    return response.data.organization;
  }

  async retrieveMany(): Promise<MongoOrganization> {
    throw new Error("Method not implemented.");
  }

  async insertOne(): Promise<MongoOrganization> {
    throw new Error("Method not implemented.");
  }

  async insertMany(): Promise<MongoOrganization[]> {
    throw new Error("Method not implemented.");
  }

  async updateOne(
    _id: string,
    createdById: string,
    name: string,
    allowInvites: boolean,
    inviteCode: string,
  ): Promise<MongoOrganization> {
    const variables = {
      updateOneOrganizationQuery: {
        _id,
        createdBy: {
          _id: createdById,
        },
      },
      updateOneOrganizationSet: {
        name,
        allowInvites,
        inviteCode,
      },
    };

    const response = await apolloClient.mutate({
      mutation: mutations.UPDATE_ONE_ORGANIZATION,
      variables,
    });

    return response.data.updateOneOrganization;
  }

  async updateMany(): Promise<MongoOrganization[]> {
    throw new Error("Method not implemented.");
  }

  async deleteOne(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async deleteMany(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export const IOrganizationService = DI
  .createInterface<IOrganizationService>("IOrganizationService", (x) => x.singleton(OrganizationService));

// eslint-disable-next-line @typescript-eslint/no-redeclare
export interface IOrganizationService extends OrganizationService {}
