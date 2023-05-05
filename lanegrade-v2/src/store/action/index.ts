import {
  AtlasUser, FirebaseUser, MongoOrganization, State,
} from "common/interfaces";

import produce from "immer";

export function setIsChangingRoute(state: State, isChangingRoute: boolean): State {
  const nextState = produce(state, (draftState) => {
    draftState.isChangingRoute = isChangingRoute;
  });

  return nextState;
}

export function setFirebaseUser(state: State, firebaseUser: FirebaseUser): State {
  const nextState = produce(state, (draftState) => {
    draftState.firebaseUser = firebaseUser;
  });

  return nextState;
}

export function setAtlasUser(state: State, atlasUser: AtlasUser): State {
  const nextState = produce(state, (draftState) => {
    draftState.atlasUser = atlasUser;
  });

  return nextState;
}

export function setOrganization(state: State, organization: MongoOrganization): State {
  const nextState = produce(state, (draftState) => {
    draftState.organization = organization;
  });

  return nextState;
}
