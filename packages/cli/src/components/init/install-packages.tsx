import { useState, useEffect } from "react";
import { installPackages } from "../../utils/install-packages.js";
import { SpinnerWithLabel } from "../spinner-with-label.js";
import { Text } from "ink";
import figures from "figures";

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
    void installPackages(dir);
    setPackagesInstalled(true);
    onPackagesInstalled();
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
