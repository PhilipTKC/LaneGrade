import { customElement } from "@aurelia/runtime-html";
import { connectTo } from "@aurelia/store-v1";
import { routes, IRouteableComponent } from "aurelia-direct-router";

import { State } from "common/interfaces";
import {
  FilterDropdownMenuCustomElement,
  FramesPaginationCustomElement,
  LaneDropdownMenuCustomElement,
} from "components";

import { map } from "rxjs";

import { TaskDashboardPage } from "./dashboard";
import { TaskListPage } from "./list";
import { TaskReviewPage } from "./review";

import template from "./index.html";

@connectTo<State>({
  selector: (store) => store.state.pipe(map((x: State) => x.firebaseUser) as never),
  setup: "created",
  target: "firebaseUser",
})
@routes([
  {
    id: "list",
    path: ["", "list"],
    component: TaskListPage,
    title: "List",
    viewport: "tasks",
    data: { isProtected: true },
  },
  {
    path: ":id/review/:laneId?/:filter?/:page?/:index?",
    component: TaskReviewPage,
    title: "Review",
    viewport: "tasks",
    data: { isProtected: true },
  },
  {
    path: ":id/dashboard",
    component: TaskDashboardPage,
    title: "Dashboard",
    viewport: "tasks",
    data: { isProtected: true },
  },
])
@customElement({
  name: "tasks",
  template,
  dependencies: [
    TaskListPage,
    TaskReviewPage,
    LaneDropdownMenuCustomElement,
    FilterDropdownMenuCustomElement,
    FramesPaginationCustomElement,
  ],
})
export class TasksPage implements IRouteableComponent {}
