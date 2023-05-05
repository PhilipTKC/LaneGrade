import { connectTo } from "@aurelia/store-v1";
import {
  customElement, ICustomElementViewModel, IDisposable, IEventAggregator,
} from "aurelia";
import { IFrameService, ILaneService, ITaskService } from "services";

import { toDatabaseSafe, isFrame, groupByKey } from "common";

import {
  AtlasUser, MongoFrame, MongoLane, State,
} from "common/interfaces";
import { Header, StagingList } from "common/types";
import { DrawerSubscription, TaskSubscription } from "common/enums";

import { map } from "rxjs/operators";
import Uppy, { UppyFile } from "@uppy/core";
import DragDrop from "@uppy/drag-drop";
import Papa from "papaparse";

import uppyCSS from "@uppy/core/dist/style.css";
import dragndropCSS from "@uppy/drag-drop/dist/style.css";

import template from "./index.html";

@connectTo<State>({
  selector: (store) => store.state.pipe(map((x: State) => x.atlasUser) as never),
  target: "atlasUser",
})
@customElement({
  name: "create-task-drawer",
  template,
  dependencies: [uppyCSS, dragndropCSS],
})
export class CreateTaskDrawerCustomElement implements ICustomElementViewModel {
  private atlasUser: AtlasUser;

  private handleBodyClick: (ev: MouseEvent) => void;

  private isOpen = false;

  private parseError = false;

  private readonly stagingList: StagingList[] = [];

  private subscription: IDisposable;

  private readonly uppy = new Uppy({
    id: "uppy",
    autoProceed: false,
    allowMultipleUploadBatches: false,
    restrictions: {
      allowedFileTypes: [".csv"],
      maxNumberOfFiles: 1,
    },
  });

  constructor(
    @IEventAggregator private readonly ea: IEventAggregator,
    @ITaskService private readonly taskService: ITaskService,
    @IFrameService private readonly frameService: IFrameService,
    @ILaneService private readonly laneService: ILaneService,
  ) {
    this.handleBodyClick = (ev: MouseEvent): void => {
      const containerElement = document.getElementById("create-task-drawer-container");

      if (containerElement) {
        const withinElement = containerElement.contains(ev.target as HTMLElement);

        if (!withinElement) {
          this.toggleDrawer(false);
        }
      }
    };

    this.subscribeToOpenEvent();
  }

  attached(): void {
    this.toggleDrawer(false);
    this.configureUppy();
    this.onFileAdded();
  }

  detached(): void {
    this.toggleDrawer(false);
    this.destroyUppy();
    this.subscription.dispose();
  }

  subscribeToOpenEvent(): void {
    this.subscription = this.ea.subscribe(DrawerSubscription.Open, () => {
      this.toggleDrawer(true);
    });
  }

  configureUppy(): void {
    this.uppy.use(DragDrop, {
      target: "#uploader",
    });
  }

  destroyUppy(): void {
    this.uppy.close();
  }

  onFileAdded(): void {
    this.uppy.on("file-added", (file: UppyFile<Record<string, unknown>>) => {
      this.parseCSV(file);
    });
  }

  parseCSV(file: UppyFile<Record<string, unknown>>): void {
    const { name, data, id } = file;

    const headers: Header[] = [];

    Papa.parse(data as File, {
      dynamicTyping: true,
      header: true,
      skipEmptyLines: true,
      transform: (value: string, field) => {
        if (typeof field === "string") {
          // Remove any text consistencies (Double white spaces between text and before and after)
          return value.replace(/\s{2,}/g, " ").trim();
        }

        return Number(value);
      },
      transformHeader: (header: string) => {
        // Transform header names to be more consistant with naming conventions.
        const newHeaderName = toDatabaseSafe(header);
        headers.push({
          old: header, new: newHeaderName, selected: false, keep: true,
        });
        return toDatabaseSafe(newHeaderName);
      },
      complete: async (papaResult: Papa.ParseResult<unknown>) => {
        const frameData = papaResult.data as unknown as MongoFrame[];

        // Determine if object partially/fully matches Frame Schema.
        const isValidFrame = isFrame(frameData[0]);

        if (isValidFrame) {
          this.parseError = false;

          // TODO: Check if object contains the following headers
          // ['accept', 'reviewed', 'taskId', 'ownerId', 'laneId']
          // Determine if object has already been reviewed.

          // TODO: Typeof Guards.

          // Import as new unreviewed task.
          const unreviewedData = frameData.map((frame) => ({
            ciDefectGroup: frame.ciDefectGroup,
            ciDefectSeverity: frame.ciDefectSeverity,
            ciDefectType: frame.ciDefectType,
            defectGroup: frame.defectGroup,
            defectSeverity: frame.defectSeverity,
            defectType: frame.defectType,
            frameId: frame.frameId,
            frameTimeDetected: frame.frameTimeDetected,
            geom: frame.geom,
            h: frame.h,
            imageUrl: frame.imageUrl,
            lat: frame.lat,
            long: frame.long,
            projectName: frame.projectName,
            roadName: frame.roadName,
            segmentNumber: frame.segmentNumber,
            strValue: frame.strValue,
            subProjectName: frame.subProjectName,
            systemTag: frame.systemTag,
            systemVersion: frame.systemVersion,
            unitTitle: frame.unitTitle,
            wkt: frame.wkt,
          }));

          this.stagingList.push({
            data: unreviewedData,
            fileName: name,
            headers: headers.sort((a, b) => {
              if (a.new < b.new) { return -1; }
              if (a.new > b.new) { return 1; }
              return 0;
            }),
            fileId: id,
            frameQuantity: papaResult.data.length,
            isDeleting: false,
          });
        } else {
          // TODO: More specific user error.
          this.parseError = true;
          this.uppy.removeFile(id);
        }
      },
    });
  }

  dropOrKeepHeaders(toDrop: string[], list: MongoFrame[]): MongoFrame[] {
    return list.map((frame) => {
      toDrop.forEach((key) => {
        delete frame[key];
      });
      return frame;
    });
  }

  mapFrames(value: MongoFrame[], taskId: string, laneId: string): MongoFrame[] {
    return value.map((frame) => {
      let accepted: boolean;

      if (frame.accepted) {
        accepted = true;
      } else if (frame.accepted === undefined || frame.accepted === null) {
        accepted = null;
      } else {
        accepted = false;
      }

      return {
        ...frame,
        strValue: frame.strValue.toString(),
        accepted,
        reviewed: frame.reviewed || false,
        taskId,
        laneId,
        ownerId: this.atlasUser.activeOrganizationId._id,
        defectTypeOld: frame.defectType,
      };
    });
  }

  determineLaneUpdatePromises(frames: MongoFrame[]): Promise<MongoLane>[] {
    const updateManyLanesPromises: Promise<MongoLane>[] = [];

    for (let i = 0; i < frames.length; i += 1) {
      const {
        ownerId,
        taskId: frameTaskId,
        laneId: frameLaneId,
        accepted,
        _id: id,
      } = frames[i];

      if (ownerId
      && frameTaskId
      && frameLaneId) {
        const updatePromise = this.laneService.addOrRemoveFrame(
          frameLaneId,
          ownerId,
          frameTaskId,
          accepted,
          id,
        );

        updateManyLanesPromises.push(updatePromise);
      }
    }

    return updateManyLanesPromises;
  }

  async prepareList(
    list: StagingList,
    activeOrganizationId: string,
    taskId: string,
  ): Promise<boolean> {
    // Keep or drop headers determined by user input. (Currently disabled.)
    const toDrop = list.headers.filter((x) => !x.keep).map((x) => x.new);
    const filteredList = this.dropOrKeepHeaders(toDrop, list.data);

    const groupedBySystemTag = groupByKey(filteredList, "systemTag");

    let isFrameInsertSuccess: boolean;

    let canInsertContinue = true;

    await Promise.all(
      Object.entries(groupedBySystemTag).map(
        async ([key, value]) => {
          // Create lane document and retrieve id for frame document insert.
          const { _id: laneId } = await this.laneService.insertOne(
            key,
            activeOrganizationId,
            taskId,
            value.length,
          );

          // Determine boolean values for ['Accept', 'Reviewed']. Always null or false for now.
          const mappedFrames = this.mapFrames(value, taskId, laneId);

          // Inserts all frames and returns all inserted frames.
          const insertedFrames = await this.frameService.insertMany(mappedFrames);

          // If insertedFrames is null an error has occured.
          // mappedFrames does not match frame schema.
          if (insertedFrames === null && canInsertContinue) {
            canInsertContinue = false;

            isFrameInsertSuccess = false;

            // Delete all associated lanes that were created before the failed frame inserts.
            await this.laneService.deleteMany(
              taskId,
              activeOrganizationId,
            );

            await this.taskService.deleteOne(taskId, activeOrganizationId);
          }

          if (insertedFrames !== null && canInsertContinue) {
            isFrameInsertSuccess = true;

            // Determine if CSV insert has reviewed rows. Update lane document if they exist.
            // Frames can either be in either accepted, rejected or review and reviewed state.
            const updateManyLanesPromises = this.determineLaneUpdatePromises(insertedFrames);
            await Promise.all(updateManyLanesPromises);
          }

          return insertedFrames;
        },
      ),
    );

    return isFrameInsertSuccess;
  }

  toggleDrawer(isOpen: boolean): void {
    document.getElementById("outer-viewport").addEventListener("click", this.handleBodyClick);
    document.getElementById("nav-view").style.pointerEvents = isOpen ? "none" : "auto";

    // Determine whether or not if TaskView is present in page.
    const taskView = document.getElementById("task-view");
    if (taskView) {
      // Determine whether body should be clickable.
      taskView.style.pointerEvents = isOpen ? "none" : "auto";
    }

    // Hide scrollbar on body.
    document.body.style.overflowY = isOpen ? "hidden" : "auto";
    this.isOpen = isOpen;
  }

  async acceptList(list: StagingList): Promise<void> {
    // Publish Task Creating Event & close drawer.
    this.ea.publish(TaskSubscription.Creating);

    this.toggleDrawer(false);

    const { activeOrganizationId } = this.atlasUser;

    // Create task and retrieve id of document for inserts of Lane & Frames documents.
    const task = await this.taskService.insertOne(list.fileName, activeOrganizationId._id);

    // Inserts lane then frame documents and returns a true boolean if successful.
    const isSuccessful = await this.prepareList(list, activeOrganizationId._id, task._id);

    if (isSuccessful) {
      this.ea.publish(TaskSubscription.Created, task);
    } else {
      this.ea.publish(TaskSubscription.Created, null);
      await this.taskService.deleteOne(task._id, activeOrganizationId._id);
      // toast({ text: "An error occured trying to create this task." });
    }

    this.uppy.removeFile(list.fileId);
    this.stagingList.splice(0, 1);
  }

  /*
  ** User interaction for this function has been removed for now.
  */
  setImageHeader(listIndex: number, headerIndex: number): void {
    if (this.stagingList[listIndex].headers.filter((x) => x.selected).length >= 1) {
      this.stagingList[listIndex].headers[headerIndex].selected = false;
    } else {
      this.stagingList[listIndex].headers[headerIndex].selected = !this.stagingList[listIndex]
        .headers[headerIndex].selected;
    }
  }

  /*
  ** User interaction for this function has been removed for now.
  */
  toggleHeader(listIndex: number, headerIndex: number): void {
    this.stagingList[listIndex].headers[headerIndex].keep = !this.stagingList[listIndex]
      .headers[headerIndex].keep;
  }

  rejectList(fileId: string): void {
    const fileIndex = this.stagingList.findIndex((x) => x.fileId === fileId);
    this.stagingList[fileIndex].isDeleting = true;

    setTimeout(() => {
      this.uppy.removeFile(fileId);
      this.stagingList.splice(fileIndex, 1);
    }, 1000);
  }
}
