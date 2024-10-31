import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import type { SelectItem } from "../../constants/select-constants.js";
import { ConfigType } from "../../utils/generate-config.js";

const configTypeItems: SelectItem<ConfigType>[] = [
  {
    label: "Use default lists",
    value: ConfigType.Default,
  },
  {
    label: "Use blank lists",
    value: ConfigType.Blank,
  },
] as const;

interface SelectListTypeProps {
  onConfigTypeSelected: (configType: ConfigType) => void;
}

export default function SelectListType({
  onConfigTypeSelected,
}: SelectListTypeProps) {
  return (
    <Box flexDirection="column">
      <Text>
        Would you like to use the default license whitelist and blacklist or
        configure your own?
      </Text>
      <SelectInput
        items={configTypeItems}
        onSelect={(item) => onConfigTypeSelected(item.value)}
      />
    </Box>
  );
}
