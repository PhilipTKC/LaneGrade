import {
  customElement,
} from "aurelia";
import { IRouteableComponent } from "aurelia-direct-router";
import { connectTo } from "@aurelia/store-v1";

import { DashboardPage } from "pages/protected/dashboard";

import { State } from "common/interfaces";

import { map } from "rxjs/operators";

import template from "./index.html";

@connectTo<State>({
  selector: (store) => store.state.pipe(map((x: State) => x.firebaseUser) as never),
  setup: "created",
  target: "firebaseUser",
})
@customElement({ name: "register", template, dependencies: [DashboardPage] })
export class RegisterPage implements IRouteableComponent {

}
