import { customElement, IPlatform } from "@aurelia/runtime-html";
import { routes, IRouteableComponent } from "aurelia-direct-router";
import { connectTo, Store } from "@aurelia/store-v1";
import { IOrganizationService } from "services";

import { OrganizationMenuCustomElement } from "components/organization-menu";

import {
  AtlasUser, MongoOrganization, State,
} from "common/interfaces";
import { StoreDispatchActions } from "common/enums";

import { map } from "rxjs";

import template from "./index.html";
import { OrganizationOverviewPage } from "./overview";
import { OrganizationMembersPage } from "./members";
import { OrganizationSettingsPage } from "./settings";

@connectTo<State>({
  selector: {
    firebaseUser: (store) => store.state.pipe(map((x: State) => x.firebaseUser) as never),
    atlasUser: (store) => store.state.pipe(map((x: State) => x.atlasUser) as never),
  },
  setup: "created",
})
@routes([
  {
    id: "overview",
    path: ["", "overview"],
    component: OrganizationOverviewPage,
    title: "Overview",
    viewport: "organization",
    data: { isProtected: true },
  },
  {
    path: "members",
    component: OrganizationMembersPage,
    title: "Members",
    viewport: "organization",
    data: { isProtected: true },
  },
  {
    path: "settings",
    component: OrganizationSettingsPage,
    title: "Settings",
    viewport: "organization",
    data: { isProtected: true },
  },
])
@customElement({
  name: "organization",
  template,
  dependencies: [
    OrganizationOverviewPage,
    OrganizationMembersPage,
    OrganizationSettingsPage,
    OrganizationMenuCustomElement,
  ],
})
export class OrganizationCustomElement implements IRouteableComponent {
  private organization: MongoOrganization;

  private state: State;

  private atlasUser: AtlasUser;

  constructor(
    @IPlatform readonly p: IPlatform,
    @IOrganizationService private readonly organizationService: IOrganizationService,
    private readonly store: Store<State>,
  ) {
    this.store.state.subscribe((state) => {
      this.state = state;
    });
  }

  attached(): void {
    this.p.taskQueue.queueTask(async () => {
      const { activeOrganizationId } = this.atlasUser;

      this.organization = await this.organizationService.retrieveOne(activeOrganizationId._id);

      await this.store.dispatch(StoreDispatchActions.setOrganization, this.organization);
    });
  }
}
