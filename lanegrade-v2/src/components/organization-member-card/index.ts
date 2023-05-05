import { bindable, customElement, ICustomElementViewModel } from "aurelia";

import { AtlasUser } from "common/interfaces";

import template from "./index.html";

@customElement({ name: "organization-member-card", template })
export class OrganizationMemberCardCustomElement implements ICustomElementViewModel {
  @bindable members: AtlasUser[];

  @bindable createdBy: string;
}
