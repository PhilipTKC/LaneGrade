import { connectTo } from "@aurelia/store-v1";
import {
  bindable,
  customElement, IDisposable, IEventAggregator, IPlatform,
} from "aurelia";
import { IRouteableComponent } from "aurelia-direct-router";
import { ITaskService } from "services";

import { TaskSearchBarCustomElement, TaskCardCustomElement, CreateTaskDrawerCustomElement } from "components";

import {
  MongoTask, AtlasUser, State,
} from "common/interfaces";
import { DrawerSubscription, TaskSubscription } from "common/enums";

import { map } from "rxjs";
import { cloneDeep } from "@apollo/client/utilities";

import produce from "immer";
import template from "./index.html";

@connectTo<State>({
  selector: {
    atlasUser: (store) => store.state.pipe(map((x: State) => x.atlasUser) as never),
    firebaseUser: (store) => store.state.pipe(map((x: State) => x.firebaseUser) as never),
  },
  setup: "created",
})
@customElement({
  name: "list",
  template,
  dependencies: [TaskSearchBarCustomElement, TaskCardCustomElement, CreateTaskDrawerCustomElement],
})
export class TaskListPage implements IRouteableComponent {
  @bindable private tasks: MongoTask[];

  private atlasUser: AtlasUser;

  private insertQueue = 0;

  private taskSubscriptions: IDisposable[];

  constructor(
    @IPlatform private readonly platform: IPlatform,
    @IEventAggregator private readonly ea: IEventAggregator,
    @ITaskService private readonly taskService: ITaskService,
  ) {}

  load(): void {
    this.platform.taskQueue.queueTask(async () => {
      const { activeOrganizationId } = this.atlasUser;
      this.tasks = await this.taskService.retrieveMany(activeOrganizationId._id);
    });
  }

  attached(): void {
    this.taskSubscriptions = [
      this.subscribeToTaskCreating(),
      this.subscribeToTaskCreated(),
    ];
  }

  detached(): void {
    this.taskSubscriptions.forEach((subscription: IDisposable) => subscription.dispose());
  }

  createTask(): void {
    this.ea.publish(DrawerSubscription.Open, {});
  }

  subscribeToTaskCreating(): IDisposable {
    return this.ea.subscribe(TaskSubscription.Creating, () => {
      const nextState = produce(this.tasks, (draft) => {
        const task = {
          _id: null,
          created: null,
          ownerId: null,
          name: null,
          quantity: null,
        } as MongoTask;
        draft.unshift(task);
        this.insertQueue += 1;
      });

      this.tasks = cloneDeep(nextState);
    });
  }

  subscribeToTaskCreated(): IDisposable {
    return this.ea.subscribe(TaskSubscription.Created, (task: MongoTask) => {
      if (task === null) {
        this.tasks.splice(0, 1);
        return;
      }

      const nextState = produce(this.tasks, (taskDraft) => {
        const draft = taskDraft;
        if (this.insertQueue > 1) {
          draft[this.insertQueue - 1] = task;
          this.insertQueue -= 1;
        } else {
          draft[0] = task;
          this.insertQueue -= 1;
        }
      });

      this.platform.setTimeout(() => {
        this.tasks = cloneDeep(nextState);
      }, 2000);
    });
  }
}
