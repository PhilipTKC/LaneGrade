import {
  IPlatform, observable, IObserverLocator,
} from "@aurelia/runtime";
import { connectTo, Store } from "@aurelia/store-v1";
import {
  bindable,
  customElement, IEventAggregator, Params,
} from "aurelia";
import {
  IRouter, IRouteableComponent,
} from "aurelia-direct-router";
import { IFrameService, ILaneService } from "services";

import {
  AtlasUser, MongoFrame, MongoLane, State,
} from "common/interfaces";

import {
  FilterDropdownMenuCustomElement,
  FramesPaginationCustomElement,
  GlideCustomElement,
  LaneDropdownMenuCustomElement,
  MapBoxCustomElement,
  TaskFramesCustomElement,
} from "components";
import { ToNumberValueConverter } from "value-converters";

import { produce } from "immer";
import { map } from "rxjs/operators";
import { cloneDeep } from "@apollo/client/utilities";

import template from "./index.html";

type Configuration = {
  activeLane: MongoLane,
  framesFound: boolean,
  isLoading: boolean,
  numberOfPages: number,
  pageLength: 30,
};

@connectTo<State>({
  selector: {
    atlasUser: (store) => store.state.pipe(map((x: State) => x.atlasUser) as never),
    firebaseUser: (store) => store.state.pipe(map((x: State) => x.firebaseUser) as never),
  },
  setup: "created",
})
@customElement({
  name: "review",
  template,
  dependencies: [
    TaskFramesCustomElement,
    LaneDropdownMenuCustomElement,
    FilterDropdownMenuCustomElement,
    FramesPaginationCustomElement,
    GlideCustomElement,
    ToNumberValueConverter,
    MapBoxCustomElement,
  ],
})
export class TaskReviewPage implements IRouteableComponent {
  @bindable private activeIndex: number;

  @bindable private pageNumber: number;

  @bindable private selectedLaneId: string;

  @bindable private selectedFilterValue: string;

  @observable private lanes: MongoLane[];

  private atlasUser: AtlasUser;

  private readonly configuration: Configuration = {
    activeLane: undefined,
    framesFound: undefined,
    isLoading: true,
    numberOfPages: undefined,
    pageLength: 30,
  };

  private frames: MongoFrame[];

  private laneId: string;

  private taskId: string;

  constructor(
    @IPlatform private readonly platform: IPlatform,
    @IEventAggregator private readonly ea: IEventAggregator,
    @IObserverLocator private readonly observerLocator: IObserverLocator,
    @IRouter private readonly router: IRouter,
    @ILaneService private readonly laneService: ILaneService,
    @IFrameService private readonly frameService: IFrameService,
    private readonly store: Store<State>,
  ) { }

  load(params: Params): void {
    const {
      id, laneId, page, index, filter,
    } = params;

    this.taskId = id;
    this.laneId = laneId;

    this.selectedLaneId = this.laneId;

    this.pageNumber = Number(page) || 1;

    this.selectedFilterValue = filter || "all";

    this.platform.taskQueue.queueTask(async () => {
      this.lanes = await this.retrieveLanes(this.taskId);

      if (index) {
        this.activeIndex = Number(index) || 0;
      }

      if (this.laneId) {
        this.configuration.activeLane = this.lanes.find((lane) => lane._id === this.laneId);
        this.configuration.numberOfPages = Math.ceil(this.configuration.activeLane.quantity / 30);
        await this.switchFilter(this.selectedFilterValue);
      }
    });
  }

  async retrieveLanes(taskId: string): Promise<MongoLane[]> {
    return this.laneService.retrieveMany(taskId);
  }

  async retrieveFrames(
    taskId: string,
    laneId: string,
    accepted?: boolean,
    reviewed?: boolean,
  ): Promise<void> {
    this.configuration.isLoading = true;

    this.updatePushState();

    const frames = await this.frameService.retrieveMany(
      taskId,
      laneId,
      this.pageNumber,
      accepted,
      reviewed,
    );

    if (frames.length > 0) {
      this.frames = frames;
      this.platform.setTimeout(() => {
        this.configuration.framesFound = true;
        this.configuration.isLoading = false;
      }, 1000);
    } else {
      this.frames = [];
      this.pageNumber = 0;
      this.configuration.numberOfPages = 0;
      this.platform.setTimeout(() => {
        this.configuration.framesFound = false;
        this.configuration.isLoading = false;
      }, 1000);
    }
  }

  async updateFrame(
    option: "accept" | "reject" | "review" | "update",
  ): Promise<void> {
    if (option === "accept") {
      this.frames[this.activeIndex].accepted = true;
    }

    if (option === "reject") {
      this.frames[this.activeIndex].accepted = false;
    }

    if (option === "review") {
      this.frames[this.activeIndex].accepted = null;
    }

    const { _id: id, accepted } = this.frames[this.activeIndex];

    if (option !== "update") {
      this.frames[this.activeIndex].reviewed = true;

      await this.laneService.addOrRemoveFrame(
        this.laneId,
        this.atlasUser.activeOrganizationId._id,
        this.taskId,
        accepted,
        id,
      );
    }

    const updatedFrame = await this.frameService.updateOne(
      this.frames[this.activeIndex],
      this.pageNumber,
    );

    const nextState = produce(this.frames, (draft) => {
      const idx = draft.findIndex((f) => f._id === updatedFrame._id);
      draft[idx] = updatedFrame;
    });

    this.frames = cloneDeep(nextState);

    this.nextFrame();

    this.scrollFrameIntoView();
  }

  updatePushState(): void {
    window.history.pushState(
      {},
      null,
      // eslint-disable-next-line max-len
      `/tasks/${this.taskId}/review/${this.laneId}/${this.selectedFilterValue}/${this.pageNumber}/${this.activeIndex}`,
    );
  }

  async previousFrame(): Promise<void> {
    if (!this.configuration.activeLane) {
      return;
    }

    const { quantity } = this.configuration.activeLane;

    this.configuration.numberOfPages = Math.ceil(quantity / 30);

    if (this.pageNumber > 1) {
      this.activeIndex -= 1;
    }

    if (this.pageNumber === 1 && this.activeIndex > 0) {
      this.activeIndex -= 1;
    }

    if (this.activeIndex < 0) {
      await this.previousPage();
    }

    this.scrollFrameIntoView();
  }

  async nextFrame(): Promise<void> {
    if (!this.configuration.activeLane) {
      return;
    }

    if (this.activeIndex === this.frames.length - 1 && this.pageNumber === this.configuration.numberOfPages) {
      return;
    }

    if (this.activeIndex <= this.frames.length - 1) {
      this.activeIndex += 1;
    }

    if (this.activeIndex > this.frames.length - 1) {
      await this.nextPage();
    }

    this.scrollFrameIntoView();
  }

  scrollFrameIntoView(): void {
    const frameElement = document.getElementById(`frame-${this.activeIndex}`);

    if (frameElement) {
      frameElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  async previousPage(): Promise<void> {
    if (this.pageNumber > 1) {
      this.pageNumber -= 1;
      this.activeIndex = 0;

      const { quantity } = this.configuration.activeLane;
      this.configuration.numberOfPages = Math.ceil(quantity / 30);

      if (this.pageNumber > this.configuration.numberOfPages) {
        this.pageNumber = this.configuration.numberOfPages;
      }

      await this.switchFilter(this.selectedFilterValue);
    }
  }

  async nextPage(): Promise<void> {
    if (this.pageNumber < this.configuration.numberOfPages) {
      this.pageNumber += 1;
      this.activeIndex = 0;

      const { quantity } = this.configuration.activeLane;
      this.configuration.numberOfPages = Math.ceil(quantity / 30);

      if (this.pageNumber <= 0) {
        this.pageNumber = 1;
      }

      await this.switchFilter(this.selectedFilterValue);
    }
  }

  async switchFilter(filter: string): Promise<void> {
    if (!filter) {
      return;
    }

    const {
      accepted, rejected, review, quantity, reviewed,
    } = this.configuration.activeLane;

    switch (filter) {
      case "accepted":
        if (accepted) {
          this.configuration.numberOfPages = Math.ceil(accepted.length / 30);
        }
        await this.retrieveFrames(this.taskId, this.laneId, true, true);
        break;
      case "rejected":
        if (rejected) {
          this.configuration.numberOfPages = Math.ceil(rejected.length / 30);
        }
        await this.retrieveFrames(this.taskId, this.laneId, false, true);
        break;
      case "review":
        if (review) {
          this.configuration.numberOfPages = Math.ceil(review.length / 30);
        }
        await this.retrieveFrames(this.taskId, this.laneId, null, true);
        break;
      case "not-reviewed":
        if (reviewed) {
          this.configuration.numberOfPages = Math.ceil(quantity - reviewed.length / 30);
        }
        await this.retrieveFrames(this.taskId, this.laneId, null, false);
        break;
      case "all":
        this.configuration.numberOfPages = Math.ceil(quantity / 30);
        await this.retrieveFrames(this.taskId, this.laneId);
        break;
      default:
        this.configuration.numberOfPages = Math.ceil(quantity / 30);
        await this.retrieveFrames(this.taskId, this.laneId);
    }
  }

  async selectedLaneIdChanged(id: string): Promise<void> {
    if (!id) {
      return;
    }

    this.configuration.activeLane = this.lanes.find((lane) => lane._id === id);

    this.laneId = id;
    this.activeIndex = 0;
    this.pageNumber = 1;

    await this.switchFilter(this.selectedFilterValue);
  }

  async selectedFilterValueChanged(newFilter: string, oldFilter: string): Promise<void> {
    if (oldFilter === undefined) {
      return;
    }

    this.activeIndex = 0;
    this.pageNumber = 1;

    await this.switchFilter(newFilter);
  }

  activeIndexChanged(): void {
    this.updatePushState();
  }
}
