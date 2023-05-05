import { customElement, IEventAggregator } from "aurelia";

import { IRouter } from "aurelia-direct-router";

import {
  IFrameService, ILaneService, ITaskService,
} from "services";

import { ModalType, TaskModal } from "common/enums";

import MicroModal from "micromodal";

import CSS from "css/modal.css";
import nProgress from "nprogress";
import template from "./index.html";

@customElement({ name: "delete-confirmation-modal", template, dependencies: [CSS] })
export class DeleteConfirmationModalCustomElement {
  private isOpen = false;

  private modalId = ModalType.TaskDelete;

  private taskId: string;

  private ownerId: string;

  private isDeleting: boolean;

  constructor(
    @IEventAggregator private readonly ea: IEventAggregator,
    @IRouter private readonly router: IRouter,
    @IFrameService private readonly frameService: IFrameService,
    @ILaneService private readonly laneService: ILaneService,
    @ITaskService private readonly taskService: ITaskService,
  ) {
    this.ea.subscribe(TaskModal.Open, ({ taskId, ownerId }) => {
      this.isOpen = !this.isOpen;

      if (this.isOpen) {
        this.taskId = taskId;
        this.ownerId = ownerId;

        MicroModal.show(this.modalId, {
          disableScroll: true,
          onShow: (): void => {
            document.body.className += " modal-open";
          },
          onClose: (): void => {
            document.body.className = document.body.className.replace("modal-open", "");
            this.isOpen = false;
          },
        });
      } else {
        this.taskId = null;
        this.ownerId = null;
        MicroModal.close(this.modalId);
      }
    });
  }

  async deleteTask(): Promise<void> {
    if (this.isDeleting) {
      return;
    }

    nProgress.start();
    this.isDeleting = true;

    await this.frameService.deleteMany(this.taskId, this.ownerId);
    await this.laneService.deleteMany(this.taskId, this.ownerId);
    await this.taskService.deleteOne(this.taskId, this.ownerId);

    MicroModal.close(this.modalId);

    this.isDeleting = false;
    nProgress.done();

    this.router.load("/tasks");
  }
}
