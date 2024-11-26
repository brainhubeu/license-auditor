import figures from "figures";
import { Text } from "ink";
import { useEffect, useState } from "react";
import { installPackages } from "../../utils/install-packages.js";
import { SpinnerWithLabel } from "../spinner-with-label.js";

interface InstallPackagesProps {
  dir: string;
  onPackagesInstalled: () => void;
}

export function InstallPackages({
  dir,
  onPackagesInstalled,
}: InstallPackagesProps) {
  const [packagesInstalled, setPackagesInstalled] = useState(false);

  useEffect(() => {
    const callInstallPackages = async () => {
      await installPackages(dir);
      setPackagesInstalled(true);
      onPackagesInstalled();
    };

    void callInstallPackages();
  }, [dir, onPackagesInstalled]);

  if (!packagesInstalled) {
    return <SpinnerWithLabel label="Installing dependencies..." />;
  }

  return (
    <Text color="grey">
      {figures.info} Dependencies installed successfully.
    </Text>
  );
}
