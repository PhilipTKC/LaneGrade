import { DI } from "aurelia";

import { cloneDeep } from "@apollo/client/utilities";
import { apolloClient } from "gql/client";
import * as queries from "gql/queries";

import { getAuth } from "firebase/auth";

import { AtlasUser, IUserMongoService } from "common/interfaces";

export const IUserService = DI
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  .createInterface<IUserService>("IUserService", (x) => x.singleton(UserService));

// eslint-disable-next-line @typescript-eslint/no-redeclare
export interface IUserService extends UserService {}

export class UserService implements IUserMongoService<AtlasUser | void> {
  async retrieveUserById(id: string): Promise<void | AtlasUser> {
    const variables = {
      userQuery: {
        _id: id,
      },
    };

    if (!variables.userQuery._id) {
      return null;
    }

    const data = await apolloClient.query({
      query: queries.GET_USER,
      variables,
    });

    return cloneDeep(data.data.user);
  }

  async retrieveUserByUid(): Promise<void | AtlasUser> {
    const variables = {
      userQuery: {
        uid: getAuth().currentUser?.uid,
      },
    };

    if (!variables.userQuery.uid) {
      return null;
    }

    const response = await apolloClient.query({
      query: queries.GET_USER,
      variables,
    });

    return cloneDeep(response.data.user);
  }

  async pushMemberOf(): Promise<void | AtlasUser> {
    throw new Error("Method not implemented.");
  }

  async updateUser(): Promise<void | AtlasUser> {
    throw new Error("Method not implemented.");
  }

  async deleteUser(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
