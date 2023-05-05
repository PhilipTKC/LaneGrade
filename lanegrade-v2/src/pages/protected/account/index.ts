import { connectTo } from "@aurelia/store-v1";
import { customElement, ICustomElementViewModel } from "aurelia";

import { State } from "common/interfaces";

import { map } from "rxjs/operators";

import template from "./index.html";

@connectTo<State>({
  selector: (store) => store.state.pipe(map((x: State) => x.firebaseUser) as never),
  setup: "created",
  target: "firebaseUser",
})
@customElement({ name: "account", template })
export class AccountPage implements ICustomElementViewModel {}
