import { bindable, customElement, ICustomElementViewModel } from "aurelia";

import { ImageUrlParserValueConverter } from "value-converters";

import template from "./index.html";

@customElement({ name: "glide", template, dependencies: [ImageUrlParserValueConverter] })
export class GlideCustomElement implements ICustomElementViewModel {
  @bindable imageUrl: string;

  private activeIndex = 0;

  private fullImage: HTMLImageElement;

  private defectImage: HTMLImageElement;

  previous(): void {
    if (this.activeIndex > 0) {
      this.activeIndex -= 1;
    }
  }

  next(): void {
    if (this.activeIndex < 1) {
      this.activeIndex += 1;
    }
  }
}
