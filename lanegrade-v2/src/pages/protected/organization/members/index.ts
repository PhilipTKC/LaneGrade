import { customElement } from "aurelia";
import { IRouteableComponent } from "aurelia-direct-router";
import { connectTo, Store } from "@aurelia/store-v1";

import { OrganizationMemberCardCustomElement } from "components";

import { State } from "common/interfaces";

import { map } from "rxjs/operators";

import template from "./index.html";

@connectTo<State>({
  selector: {
    organization: (store: Store<State>) => store.state.pipe(map((x: State) => x.organization) as never),
    firebaseUser: (store: Store<State>) => store.state.pipe(map((x: State) => x.firebaseUser) as never),
  },
  setup: "created",
})
@customElement({
  name: "members",
  template,
  dependencies: [OrganizationMemberCardCustomElement],
})
export class OrganizationMembersPage implements IRouteableComponent { }
