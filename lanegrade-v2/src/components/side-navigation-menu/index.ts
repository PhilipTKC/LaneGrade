import {
  customElement, ICustomElementViewModel,
} from "aurelia";

import { IRouter } from "aurelia-direct-router";

import { IAuthenticationService } from "services";
import { connectTo, Store } from "@aurelia/store-v1";

import { FirebaseUser, State } from "common/interfaces";
import { StoreDispatchActions } from "common/enums";

import { map } from "rxjs/operators";

import template from "./index.html";

@connectTo<State>({
  selector: (store) => store.state.pipe(map((x: State) => x.firebaseUser) as never),
  setup: "attached",
  target: "firebaseUser",
})
@customElement({ name: "side-navigation-menu", template })
export class SideNavigationMenuCustomElement implements ICustomElementViewModel {
  private firebaseUser: FirebaseUser;

  constructor(
    @IAuthenticationService private readonly authenticationService: IAuthenticationService,
    @IRouter private readonly router: IRouter,
    private readonly store: Store<State>,
  ) { }

  async logOut(): Promise<void> {
    await this.authenticationService.logout();

    await this.store
      .pipe(StoreDispatchActions.setFirebaseUser, null)
      .pipe(StoreDispatchActions.setAtlasUser, null)
      .dispatch();

    await this.router.load("login");
  }
}
