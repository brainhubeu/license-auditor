import { deleteLicenses, updateLicenses } from "@license-auditor/data";
import { Text, useApp } from "ink";
import { useEffect, useState } from "react";
import { z } from "zod";
import { SpinnerWithLabel } from "../components/spinner-with-label.js";

export const options = z.object({
  clearCache: z.boolean().describe("Compress output"),
});

type Props = {
  options: z.infer<typeof options>;
};

export default function UpdateLicenses({ options }: Props) {
  const { exit } = useApp();
  const [working, setWorking] = useState(false);
  useEffect(() => {
    setWorking(true);

    const runUpdate = async () => {
      if (options.clearCache) {
        deleteLicenses();
      } else {
        await updateLicenses({ fetchAllLicenseTexts: true });
      }
      setWorking(false);
      exit();
    };

    void runUpdate();
  }, [options, exit]);

  if (working) {
    return <SpinnerWithLabel label="Updating licenses..." />;
  }

  return <Text>Licenses updated!</Text>;
}
