import { Store } from "@aurelia/store-v1";
import {
  bindable, customElement, ICustomElementViewModel,
} from "aurelia";
import { IRouter } from "aurelia-direct-router";
import { State } from "common/interfaces";

import template from "./index.html";

@customElement({ name: "filter-dropdown-menu", template })
export class FilterDropdownMenuCustomElement implements ICustomElementViewModel {
  @bindable isLoading: boolean;

  @bindable taskId: string;

  @bindable laneId: string;

  private readonly filters = [
    { id: 0, name: "All", value: "all" },
    { id: 1, name: "Accepted", value: "accepted" },
    { id: 2, name: "Rejected", value: "rejected" },
    { id: 3, name: "Review", value: "review" },
    { id: 4, name: "Not Reviewed", value: "not-reviewed" },
  ];

  @bindable private selectedFilterValue: string;

  constructor(
    @IRouter private readonly router: IRouter,
    private readonly store: Store<State>,
  ) {}
}
