import { Dictionary } from "common/interfaces";

export function groupByKey(array: any[], key: string): Dictionary<any[]> {
  return array
    .reduce((previous, current) => {
      if (current[key] === undefined) {
        return previous;
      }
      return { ...previous, [current[key]]: (previous[current[key]] || []).concat(current) };
    }, {});
}

export function groupByNestedKey(array: any[], key: string, key2: string): Dictionary<any[]> {
  return array
    .reduce((previous, current) => {
      if (current[key][key2] === undefined) {
        return previous;
      }
      return {
        ...previous,
        [current[key][key2]]: (previous[current[key][key2]]
        || []).concat(current),
      };
    }, {});
}
