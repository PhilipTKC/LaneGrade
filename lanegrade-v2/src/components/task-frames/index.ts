import {
  bindable, customElement, ICustomElementViewModel,
} from "aurelia";
import { MongoFrame } from "common/interfaces";

import template from "./index.html";

@customElement({ name: "task-frames", template })
export class TaskFramesCustomElement implements ICustomElementViewModel {
  @bindable activeIndex: number;

  @bindable frames: MongoFrame[];

  @bindable framesFound: boolean;

  @bindable isLoading: boolean;

  private framesElement: HTMLDivElement;

  setActive(index: number): void {
    this.activeIndex = index;
  }
}
