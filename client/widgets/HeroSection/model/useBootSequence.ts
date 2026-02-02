import { useEffect, useState } from "react";

type BootStage = "init" | "line" | "expand" | "ui";

export function useBootSequence() {
  const [bootStage, setBootStage] = useState<BootStage>("init");

  useEffect(() => {
    const timers = [
      setTimeout(() => setBootStage("line"), 500),
      setTimeout(() => setBootStage("expand"), 1200),
      setTimeout(() => setBootStage("ui"), 2000),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return bootStage;
}

export type { BootStage };
