import { customElement, IPlatform } from "aurelia";
import { IRouteableComponent } from "aurelia-direct-router";
import { IOrganizationService } from "services";
import { connectTo, Store } from "@aurelia/store-v1";

import { MongoOrganization, State } from "common/interfaces";
import { StoreDispatchActions } from "common/enums";

import { nanoid } from "nanoid";
import nProgress from "nprogress";
import { map } from "rxjs/operators";

import template from "./index.html";

@connectTo<State>({
  selector: {
    atlasUser: (store) => store.state.pipe(map((x: State) => x.atlasUser) as never),
    firebaseUser: (store) => store.state.pipe(map((x: State) => x.firebaseUser) as never),
    organization: (store) => store.state.pipe(map((x: State) => x.organization) as never),
  },
  setup: "created",
})
@customElement({ name: "settings", template })
export class OrganizationSettingsPage implements IRouteableComponent {
  private organization: MongoOrganization;

  private isRefreshingCode = false;

  constructor(
    @IPlatform private readonly platform: IPlatform,
    @IOrganizationService private readonly organizationService: IOrganizationService,
    private readonly store: Store<State>,
  ) { }

  refreshInviteCode(): void {
    nProgress.start();

    this.platform.taskQueue.queueTask(async () => {
      this.isRefreshingCode = true;

      const {
        _id: id,
        createdBy,
        name,
        allowInvites,
      } = this.organization;

      const updatedOrganization = await this.organizationService.updateOne(
        id,
        createdBy._id,
        name,
        allowInvites,
        nanoid(),
      );

      this.platform.setTimeout(async () => {
        await this.store.dispatch(StoreDispatchActions.setOrganization, updatedOrganization);
        this.isRefreshingCode = false;
        nProgress.done();
      }, 500);
    });
  }
}
