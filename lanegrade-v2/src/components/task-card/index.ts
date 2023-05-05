import { Store } from "@aurelia/store-v1";
import {
  bindable, customElement, ICustomElementViewModel,
} from "aurelia";
import { IRouter } from "aurelia-direct-router";

import { MongoTask, State } from "common/interfaces";

import template from "./index.html";

@customElement({ name: "task-card", template })
export class TaskCardCustomElement implements ICustomElementViewModel {
  @bindable tasks: MongoTask[];

  constructor(@IRouter private readonly router: IRouter,
    private readonly store: Store<State>) {}
}
