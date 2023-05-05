import { MongoFrame } from "./interfaces";

export function isFrame(object: unknown): object is MongoFrame {
  const frameSchema = [
    "ciDefectGroup",
    "ciDefectSeverity",
    "ciDefectType",
    "defectGroup",
    "defectSeverity",
    "defectType",
    "frameId",
    "frameTimeDetected",
    "geom",
    "h",
    "imageUrl",
    "lat",
    "long",
    "projectName",
    "roadName",
    "segmentNumber",
    "strValue",
    "subProjectName",
    "systemTag",
    "systemVersion",
    "unitTitle",
    "wkt",
  ];

  const unknownKey = [];

  Object.keys(object).forEach((key) => {
    const hasKey = frameSchema.includes(key);

    if (!hasKey) {
      unknownKey.push(key);
    }
  });

  if (unknownKey.length > 0) {
    return false;
  }

  return true;
}
