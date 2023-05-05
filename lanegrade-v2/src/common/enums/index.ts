export enum StoreDispatchActions {
  "setIsChangingRoute" = "setIsChangingRoute",
  "setAtlasUser" = "setAtlasUser",
  "setFirebaseUser" = "setFirebaseUser",
  "setOrganization" = "setOrganization",
}

export const enum DrawerSubscription {
  "Open" = "OpenTaskDrawer",
}

export const enum TaskSubscription {
  "Creating" = "TaskCreating",
  "Created" = "TaskCreated",
  "Updated" = "TaskUpdated",
  "Deleting" = "TaskDeleting",
  "Deleted" = "TaskDeleted",
}

export const enum QueryKey {
  getTasks = "tasks",
  getFrames = "frames",
  getLanes = "lanes",
}

export const enum ModalType {
  "TaskDelete" = "TaskDelete",
}

export const enum TaskModal {
  "Open" = "OpenTaskDeleteConfirmation",
}
