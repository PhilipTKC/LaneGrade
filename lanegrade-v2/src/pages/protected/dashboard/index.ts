import { IRouteableComponent } from "aurelia-direct-router";
import { customElement } from "@aurelia/runtime-html";
import { connectTo } from "@aurelia/store-v1";

import { State } from "common/interfaces";

import { map } from "rxjs/operators";

import template from "./index.html";

@connectTo<State>({
  selector: (store) => store.state.pipe(map((x: State) => x.firebaseUser) as never),
  setup: "created",
  target: "firebaseUser",
})
@customElement({ name: "dashboard", template })
export class DashboardPage implements IRouteableComponent {
  private isComponentLoaded = false;
}
