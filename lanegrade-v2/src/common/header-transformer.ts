export function toDatabaseSafe(header: string): string {
  switch (header) {
    case "CI_DefectGroup":
      return "ciDefectGroup";
    case "CI_DefectType":
      return "ciDefectType";
    case "CI_DefectSeverity":
      return "ciDefectSeverity";
    case "DefectGroup":
      return "defectGroup";
    case "DefectSeverity":
      return "defectSeverity";
    case "DefectType":
      return "defectType";
    case "FrameId":
      return "frameId";
    case "FrameTimeDetected":
      return "frameTimeDetected";
    case "Geom":
      return "geom";
    case "H":
      return "h";
    case "ImagUrl":
      return "imageURL";
    case "Long":
      return "long";
    case "ProjectName":
      return "projectName";
    case "RoadName":
      return "roadName";
    case "SegmentNumber":
      return "segmentNumber";
    case "StrValue":
      return "strValue";
    case "SubProjectName":
      return "subProjectName";
    case "UnitTitle":
      return "unitTitle";
    case "WKT":
      return "wkt";
    case "lat":
      return "lat";
    case "sys_tag":
      return "systemTag";
    case "sys_ver":
      return "systemVersion";
    default: {
      // Strip all empty white space and underscores
      const toSafeHeader = header.replace(/\s/g, "").replace(/_/g, "");

      const headerArr = Array.from(toSafeHeader);
      const capitalPositions = [];

      headerArr.forEach((letter, i) => {
        if (letter.match(/[A-Z]/) !== null) {
          capitalPositions.push(i);
        }
      });

      let lastPosition = 0;
      capitalPositions.forEach((position, index) => {
        if (index === 0) {
          headerArr[0] = headerArr[0].toLowerCase();
        }

        // Ensure consecutive capital letters are transformed to lowercase.
        // Example: WHOareYOU is transformed to whoAreYou.
        if (position - lastPosition === 1) {
          headerArr[position] = headerArr[position].toLowerCase();
        }

        lastPosition = position;
      });
      return headerArr.join("");
    }
  }

  // Switch case and return values around.
  function toDatabaseUnsafe(header: string): string {
    switch (header) {
      case "CI_DefectGroup":
        return "ciDefectGroup";
      case "CI_DefectType":
        return "ciDefectType";
      case "DefectGroup":
        return "defectGroup";
      case "DefectSeverity":
        return "defectSeverity";
      case "DefectType":
        return "defectType";
      case "FrameId":
        return "frameId";
      case "FrameTimeDetected":
        return "frameTimeDetected";
      case "Geom":
        return "geom";
      case "H":
        return "h";
      case "imagUrl":
        return "imageURL";
      case "Long":
        return "long";
      case "ProjectName":
        return "projectName";
      case "RoadName":
        return "roadName";
      case "SegmentNumber":
        return "segmentNumber";
      case "StrValue":
        return "strValue";
      case "SubProjectName":
        return "subProjectName";
      case "UnitTitle":
        return "unitTitle";
      case "WKT":
        return "wkt";
      case "lat":
        return "lat";
      case "sys_tag":
        return "systemTag";
      case "sys_version":
        return "systemVersion";
      default:
        return "";
    }
  }
}
