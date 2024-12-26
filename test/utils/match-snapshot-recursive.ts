import * as fs from "node:fs";
import * as path from "node:path";
import createDiff, {
  diffJsView,
  diffSortedView,
  diffChangesViewConsole,
} from "differrer";
import { expect } from "vitest";
import { replaceTestDirectory } from "./path-serializer";

// biome-ignore lint: this actually is of "any" type
const getArrayElementId = (item: any) => {
  if (typeof item !== "object") {
    return item;
  }
  if (Object.prototype.hasOwnProperty.call(item, "packageName")) {
    return item.packageName;
  }
  if (
    Object.prototype.hasOwnProperty.call(item, "licenseId") &&
    Object.prototype.hasOwnProperty.call(item, "source")
  ) {
    return `${item.licenseId}-${item.source}`;
  }
};

const diff = createDiff({
  getArrayElementId,
  sortArrayItems: true,
  getValue: (value, path) => {
    if (typeof value === "string") {
      return replaceTestDirectory(value);
    }
    return value;
  },
});

// biome-ignore lint: this actually is of "any" type
export const findDiffRecursive = (source: any, compare: any) => {
  const diffResult = diff(source, compare);

  const jsView = diffJsView(diffResult);
  const sortedView = diffSortedView(diffResult);
  const diffChangesView = diffChangesViewConsole(diffResult);

  return {
    diffResult,
    jsView,
    sortedView,
    diffChangesView,
  };
};

export const matchSnapshotRecursive = (
  snapshotPath: string,
  // biome-ignore lint: this actually is of "any" type
  value: any,
  updateSnapshot?: boolean,
) => {
  const testState = expect.getState();
  const currentDirectory = path.dirname(testState.testPath);
  const snapshotFilePath = path.join(currentDirectory, snapshotPath);

  if (!fs.existsSync(snapshotFilePath) || updateSnapshot) {
    fs.writeFileSync(snapshotFilePath, JSON.stringify(value, null, 2));
    expect(value).toEqual(value); // nonsensical assertion to make sure that number of assertion calls is preserved
    return;
  }

  const snapshot = JSON.parse(fs.readFileSync(snapshotFilePath, "utf-8"));

  const { sortedView } = findDiffRecursive(snapshot, value);

  expect(sortedView.target).toEqual(sortedView.source);
};
