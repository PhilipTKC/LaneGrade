import { observable } from "@aurelia/runtime";
import { connectTo } from "@aurelia/store-v1";
import {
  IEventAggregator, IPlatform, customElement, Params,
} from "aurelia";
import { IRouteableComponent } from "aurelia-direct-router";

import {
  AtlasUser, MongoFrame, MongoLane, MongoTask, State,
} from "common/interfaces";
import { LaneStatPaginationCustomElement, TaskOverviewCustomElement } from "components";
import { IFrameService, ILaneService, ITaskService } from "services";

import { nanoid } from "nanoid";
import nProgress from "nprogress";
import { map } from "rxjs/operators";
import Papa from "papaparse";

import { TaskModal } from "common/enums";
import template from "./index.html";

@connectTo<State>({
  selector: {
    atlasUser: (store) => store.state.pipe(map((x: State) => x.atlasUser) as never),
    firebaseUser: (store) => store.state.pipe(map((x: State) => x.firebaseUser) as never),
  },
  setup: "created",
})
@observable({ name: "chunkPage" })
@observable({ name: "selectedFilter" })
@customElement({
  name: "task-dashboard",
  template,
  dependencies: [TaskOverviewCustomElement, LaneStatPaginationCustomElement],
})
export class TaskDashboardPage implements IRouteableComponent {
  private atlasUser: AtlasUser;

  private chunkPage = 0;

  private chunks: MongoLane[] | MongoLane[][];

  private completedPercentage: number;

  private filters = [
    { name: "All", value: "all" },
    { name: "Review", value: "review" },
    { name: "Complete", value: "complete" },
  ];

  private filterParameter: string;

  private filteredChunk: MongoLane[];

  private isLoading = true;

  private laneId: string;

  private lanes: MongoLane[];

  private selectedFilter: string;

  private task: MongoTask;

  private taskId: string;

  private totalAccepted: number;

  private totalFrames: number;

  private totalRejected: number;

  private totalReviewed: number;

  constructor(
    @IEventAggregator private readonly ea: IEventAggregator,
    @IPlatform private readonly platform: IPlatform,
    @IFrameService private readonly frameService: IFrameService,
    @ILaneService private readonly laneService: ILaneService,
    @ITaskService private readonly taskService: ITaskService,
  ) { }

  async load(params: Params): Promise<void> {
    const { id, page, filter } = params;

    this.taskId = id;

    this.platform.taskQueue.queueTask(async () => {
      const promises = Promise.all([
        this.taskService.retrieveOne(this.taskId, this.atlasUser.activeOrganizationId._id),
        this.laneService.retrieveMany(this.taskId),
      ]);

      const [task, lanes] = await promises;

      this.task = task;
      this.lanes = lanes;

      this.calculateTotals(lanes);

      if (page) {
        this.chunkPage = Number(page);
      }

      if (["all", "complete", "review"].includes(filter)) {
        this.selectedFilter = filter;
      }

      this.isLoading = false;
    });
  }

  chunk(arr: MongoLane[], size: number): MongoLane[] | MongoLane[][] {
    if (!arr) return [];

    const firstChunk = arr.slice(0, size);
    if (!firstChunk.length) {
      return arr;
    }

    return [firstChunk].concat(this.chunk(arr.slice(size, arr.length), size));
  }

  previousChunk(): void {
    if (this.chunkPage > 0) {
      this.chunkPage -= 1;
    }
  }

  nextChunk(): void {
    if (this.chunkPage < this.chunks.length - 1) {
      this.chunkPage += 1;
    }
  }

  selectedFilterChanged(newSort: string, oldSort: string): void {
    if (oldSort !== undefined) {
      this.chunkPage = 0;
    }

    if (newSort === "all") {
      this.chunks = this.chunk(this.lanes, 10);
    }

    if (newSort === "complete") {
      this.chunks = this.chunk(this.lanes.filter((x) => x.quantity === x.reviewed.length), 10);
    }

    if (newSort === "review") {
      this.chunks = this.chunk(this.lanes.filter((x) => x.quantity !== x.reviewed.length), 10);
    }

    this.updatePushState();
  }

  chunkPageChanged(newPage: number, oldPage: number): void {
    if (oldPage === undefined) {
      return;
    }

    this.updatePushState();
  }

  updatePushState(): void {
    window.history.pushState(
      {},
      null,
      `tasks/${this.taskId}/dashboard?page=${this.chunkPage}&filter=${this.selectedFilter}`,
    );
  }

  calculateTotals(lanes: MongoLane[]): void {
    this.totalFrames = lanes.reduce((sum, { quantity }) => sum + quantity, 0);
    this.totalReviewed = lanes.reduce((sum, { reviewed }) => sum + reviewed.length, 0);
    this.totalAccepted = lanes.reduce((sum, { accepted }) => sum + accepted.length, 0);
    this.totalRejected = lanes.reduce((sum, { rejected }) => sum + rejected.length, 0);

    this.completedPercentage = ((this.totalAccepted + this.totalRejected) / this.totalFrames)
          * 100;
  }

  exportFrames(): void {
    this.platform.taskQueue.queueTask(async () => {
      nProgress.start();

      const framesPromise: Promise<MongoFrame[]>[] = [];
      for (let x = 0; x < this.lanes.length; x += 1) {
        const numOfPages = Math.ceil(this.lanes[x].quantity / 30);
        for (let y = 1; y < numOfPages + 1; y += 1) {
          framesPromise.push(this.frameService.retrieveMany(this.taskId, this.lanes[x]._id, y));
        }
      }

      const response = await Promise.all(framesPromise);

      const csv = Papa.unparse(Array.prototype.concat(...response));

      const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const csvURL = window.URL.createObjectURL(csvData);

      const tempLink = document.createElement("a");
      tempLink.href = csvURL;
      tempLink.setAttribute("download", `exported_frames-${nanoid(4)}.csv`);
      tempLink.click();

      nProgress.done();
    });
  }

  deleteTask(): void {
    this.ea.publish(TaskModal.Open, {
      taskId: this.taskId,
      ownerId: this.atlasUser.activeOrganizationId._id,
    });
  }
}
