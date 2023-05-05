import { IPlatform } from "@aurelia/kernel";
import { bindable, customElement, ICustomElementViewModel } from "aurelia";
import { MongoTask } from "common/interfaces";
import { ITaskService } from "services";

import template from "./index.html";

@customElement({ name: "task-search-bar", template })
export class TaskSearchBarCustomElement implements ICustomElementViewModel {
  @bindable private query = "";

  @bindable private organizationId: string;

  @bindable private tasks: MongoTask[];

  private isSearching = false;

  constructor(
    @IPlatform private readonly platform: IPlatform,
    @ITaskService private readonly taskService: ITaskService,
  ) {}

  queryChanged(query: string): void {
    this.isSearching = true;

    this.platform.setTimeout(async () => {
      this.tasks = await this.taskService.retrieveMany(this.organizationId, query);
      this.isSearching = false;
    }, 150);
  }
}
