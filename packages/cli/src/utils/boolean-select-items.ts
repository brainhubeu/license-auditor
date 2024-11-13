import type { SelectItem } from "../constants/select-constants.js";

export const booleanSelectItems: SelectItem<boolean>[] = [
  {
    label: "Yes",
    value: true,
  },
  {
    label: "No",
    value: false,
  },
] as const;
