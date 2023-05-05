import {
  bindable,
  customElement, ICustomElementViewModel,
} from "aurelia";

import template from "./index.html";

@customElement({ name: "frames-pagination", template })
export class FramesPaginationCustomElement implements ICustomElementViewModel {
  @bindable previousPage: () => void;

  @bindable nextPage: () => void;

  @bindable private numberOfPages = 0;

  @bindable private pageNumber = 0;

  private shouldShowPageCount = false;

  @bindable private isLoading = true;
}
