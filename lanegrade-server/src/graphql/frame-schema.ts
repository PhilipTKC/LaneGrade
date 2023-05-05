import mongoose from "mongoose";

const { Schema } = mongoose;

const frameSchema = new Schema(
  {
    accepted: { type: Boolean, required: false },
    ciDefectGroup: { type: Number, required: false },
    ciDefectSeverity: { type: Number, required: false },
    ciDefectType: { type: Number, required: false },
    defectGroup: { type: String, required: false },
    defectSeverity: { type: String, required: false },
    defectType: { type: String, required: false },
    defectTypeOld: { type: String, required: false },
    frameId: { type: Number, required: false },
    frameTimeDetected: { type: String, required: false },
    geom: { type: String, required: false },
    h: { type: String, required: false },
    imageUrl: { type: String, required: false },
    laneId: { type: mongoose.Types.ObjectId, required: true },
    lat: { type: Number, required: false },
    long: { type: Number, required: false },
    ownerId: { type: mongoose.Types.ObjectId, required: false },
    projectName: { type: String, required: false },
    reviewed: { type: Boolean, required: false },
    roadName: { type: String, required: false },
    segmentNumber: { type: Number, required: false },
    strValue: { type: Schema.Types.Mixed, required: false },
    subProjectName: { type: String, required: false },
    systemTag: { type: String, required: false },
    systemVersion: { type: Number, required: false },
    taskId: { type: mongoose.Types.ObjectId, required: true },
    unitTitle: { type: String, required: false },
    wkt: { type: String, required: false },
  },
  { collection: "frames" }
);

const FrameModel = mongoose.model("frames", frameSchema);

export { FrameModel };
