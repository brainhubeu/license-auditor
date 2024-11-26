import { useCallback, useEffect, useState } from "react";
import { useStdout } from "ink";

export function useTerminalDimensions() {
  const { stdout } = useStdout();
  const [dimensions, setDimensions] = useState<[number, number]>([stdout.columns, stdout.rows]);

  const handleResize = useCallback(() => {
    setDimensions([stdout.columns, stdout.rows]);
  }, [stdout]);

  useEffect(() => {
    stdout.on("resize", handleResize);
    return () => {
      stdout.off("resize", handleResize);
    };
  }, [stdout, handleResize]);

  return dimensions;
}