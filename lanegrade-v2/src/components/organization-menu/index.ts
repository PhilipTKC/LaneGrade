import {
  bindable, customElement, ICustomElementViewModel,
} from "aurelia";

import template from "./index.html";

@customElement({ name: "organization-menu", template })
export class OrganizationMenuCustomElement implements ICustomElementViewModel {
  @bindable activeMenu: string;

  @bindable createdBy: string;

  @bindable userId: string;
}
