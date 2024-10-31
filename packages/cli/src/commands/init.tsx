import { useState } from "react";
import { InstallPackages } from "../components/init/install-packages.js";
import SelectExtension from "../components/init/select-extension.js";
import SelectListType from "../components/init/select-list-type.js";
import type { EnvType } from "../env.js";
import type { ConfigListType } from "../utils/generate-config.js";
import { ValidateEnv } from "../components/init/validate-env.js";
import { GenerateConfig } from "../components/init/generate-config.js";
import type { ConfigExtension } from "../constants/config-constants.js";

enum Step {
  ValidateEnv = "validateEnv",
  InstallPackages = "installPackages",
  SelectExtension = "selectExtension",
  SelectListType = "selectListType",
  GenerateConfig = "generateConfig",
}

type WizardState =
  | { step: Step.ValidateEnv }
  | { step: Step.InstallPackages; env: EnvType }
  | { step: Step.SelectExtension; env: EnvType }
  | { step: Step.SelectListType; env: EnvType; extension: ConfigExtension }
  | {
      step: Step.GenerateConfig;
      env: EnvType;
      extension: ConfigExtension;
      configListType: ConfigListType;
    };

export default function Init() {
  const [wizardState, setWizardState] = useState<WizardState>({
    step: Step.ValidateEnv,
  });

  switch (wizardState.step) {
    case Step.ValidateEnv:
      return (
        <ValidateEnv
          onSuccess={(env) =>
            setWizardState({
              step: Step.InstallPackages,
              env,
            })
          }
        />
      );

    case Step.InstallPackages:
      return (
        <InstallPackages
          dir={wizardState.env.ROOT_DIR}
          onPackagesInstalled={() =>
            setWizardState({
              step: Step.SelectExtension,
              env: wizardState.env,
            })
          }
        />
      );

    case Step.SelectExtension:
      return (
        <SelectExtension
          onExtensionSelected={(extension) =>
            setWizardState({
              step: Step.SelectListType,
              env: wizardState.env,
              extension,
            })
          }
        />
      );

    case Step.SelectListType:
      return (
        <SelectListType
          onConfigTypeSelected={(configListType) =>
            setWizardState({
              step: Step.GenerateConfig,
              env: wizardState.env,
              extension: wizardState.extension,
              configListType,
            })
          }
        />
      );

    case Step.GenerateConfig:
      return (
        <GenerateConfig
          dir={wizardState.env.ROOT_DIR}
          extension={wizardState.extension}
          configListType={wizardState.configListType}
        />
      );

    default:
      return null;
  }
}
