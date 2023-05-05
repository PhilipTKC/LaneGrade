import Aurelia from "aurelia";
import { RouterConfiguration } from "aurelia-direct-router";

import { ValidationHtmlConfiguration } from "@aurelia/validation-html";
import { Store, StoreConfiguration } from "@aurelia/store-v1";
import { Root } from "root";

import { defaultState } from "store/state";
import { auth } from "configurations/firebase";
import {
  setFirebaseUser, setAtlasUser, setOrganization, setIsChangingRoute,
} from "store/action";
import { StoreDispatchActions } from "common/enums";
import { AuthGuard, IUserService } from "services";

import { enableMapSet, setAutoFreeze } from "immer";

enableMapSet();
setAutoFreeze(true);

const app = Aurelia
  .register(
    RouterConfiguration.customize({
      useUrlFragmentHash: false,
      title: "LaneGrade",
      indicators: {
        loadActive: "active",
      },
    }),
    StoreConfiguration.withInitialState(defaultState),
    ValidationHtmlConfiguration,
    AuthGuard,
  )
  .app(Root);

const store = app.container.get(Store);

store.registerAction(StoreDispatchActions.setIsChangingRoute, setIsChangingRoute);
store.registerAction(StoreDispatchActions.setFirebaseUser, setFirebaseUser);
store.registerAction(StoreDispatchActions.setAtlasUser, setAtlasUser);
store.registerAction(StoreDispatchActions.setOrganization, setOrganization);

auth.onAuthStateChanged(async (user) => {
  if (user) {
    const {
      displayName, email, uid, metadata,
    } = user;

    const userService = app.container.get(IUserService);
    const atlasUser = await userService.retrieveUserByUid();

    await store
      .pipe(StoreDispatchActions.setFirebaseUser, {
        displayName, email, uid, metadata,
      })
      .pipe(StoreDispatchActions.setAtlasUser, atlasUser)
      .dispatch();
  }

  if (!app.isRunning) {
    await app.waitForIdle();
    await app.start();
  }
});
