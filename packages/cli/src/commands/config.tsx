import { useApp } from "ink";
import SelectInput from "ink-select-input";
import React from "react";
import { executeConfig } from "../utils/execute-config.js";

type ItemType = { label: string; value: "default" | "blank" };

const items: ItemType[] = [
  {
    label: "Use default config overrides",
    value: "default",
  },
  {
    label: "Use blank config overrides",
    value: "blank",
  },
];

export default function Config() {
  const { exit } = useApp();

  const handleSelect = (item: ItemType) => {
    executeConfig(item.value === "default");
    exit();
  };

  return <SelectInput items={items} onSelect={handleSelect} />;
}
