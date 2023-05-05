import { connectTo } from "@aurelia/store-v1";
import { IRouteableComponent } from "aurelia-direct-router";
import { customElement } from "aurelia";

import { State } from "common/interfaces";

import { map } from "rxjs/operators";

import template from "./index.html";

@connectTo<State>({
  selector: {
    firebaseUser: (store) => store.state.pipe(map((x: State) => x.firebaseUser) as never),
    organization: (store) => store.state.pipe(map((x: State) => x.organization) as never),
  },
  setup: "created",
})
@customElement({ name: "overview", template })
export class OrganizationOverviewPage implements IRouteableComponent {

}
