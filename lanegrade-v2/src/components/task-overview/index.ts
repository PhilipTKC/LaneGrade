import { bindable, customElement, ICustomElementViewModel } from "aurelia";

import template from "./index.html";

@customElement({ name: "task-overview", template })
export class TaskOverviewCustomElement implements ICustomElementViewModel {
  @bindable isLoading: boolean;

  @bindable totalFrames: number;

  @bindable totalReviewed: number;

  @bindable totalAccepted: number;

  @bindable totalRejected: number;
}
