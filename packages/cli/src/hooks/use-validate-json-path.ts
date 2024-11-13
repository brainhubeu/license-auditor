import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { useEffect, useState } from "react";
import { JSON_RESULT_FILE_NAME } from "../constants/options-constants.js";

export const useValidateJsonPath = (json: string | boolean | undefined) => {
  const [validated, setValidated] = useState(false);
  const [jsonPath, setJsonPath] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function validatePath() {
      if (!json) {
        setValidated(true);
        return;
      }
      const jsonPath =
        typeof json === "string"
          ? json
          : path.resolve(process.cwd(), JSON_RESULT_FILE_NAME);
      const parentDirPath = path.dirname(jsonPath);

      const statParentInfo = await statPath(parentDirPath);
      if (!statParentInfo) {
        throw new Error(`Path ${parentDirPath} does not exist`);
      }

      const statPathInfo = await statPath(jsonPath);

      if (statPathInfo?.isDirectory()) {
        console.warn(
          `The provided path is a directory, a file with the name ${JSON_RESULT_FILE_NAME} will be created in the directory.`,
        );
        setJsonPath(path.join(jsonPath, JSON_RESULT_FILE_NAME));
      } else {
        setJsonPath(jsonPath);
      }
      setValidated(true);
    }
    void validatePath();
  }, [json]);

  return {
    validated,
    path: jsonPath,
  };
};

export async function statPath(path: string) {
  try {
    return await fs.stat(path);
  } catch (error) {
    return null;
  }
}
