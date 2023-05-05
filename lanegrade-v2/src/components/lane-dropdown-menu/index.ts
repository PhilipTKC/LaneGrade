import { Store } from "@aurelia/store-v1";
import {
  bindable, customElement, ICustomElementViewModel,
} from "aurelia";
import { IRouter } from "aurelia-direct-router";

import { MongoLane, State } from "common/interfaces";

import template from "./index.html";

@customElement({ name: "lane-dropdown-menu", template })
export class LaneDropdownMenuCustomElement implements ICustomElementViewModel {
  @bindable private lanes: MongoLane[];

  @bindable private selectedLaneId: string;

  @bindable private selectedFilter: string;
}
