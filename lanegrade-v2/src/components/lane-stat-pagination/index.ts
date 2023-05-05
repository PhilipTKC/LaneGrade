import { bindable, customElement, ICustomElementViewModel } from "aurelia";

import template from "./index.html";

@customElement({ name: "lane-stat-pagination", template })
export class LaneStatPaginationCustomElement implements ICustomElementViewModel {
  @bindable previousChunk: () => void;

  @bindable nextChunk: () => void;

  @bindable currentPage: number;

  @bindable chunkLength: number;
}
