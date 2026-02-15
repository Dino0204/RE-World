import type { BootStage } from "@/widgets/hero/model/useBootSequence";

interface BootSequenceOverlayProps {
  bootStage: BootStage;
}

export function BootSequenceOverlay({ bootStage }: BootSequenceOverlayProps) {
  const isInitStage = bootStage === "init";
  const isLineStage = bootStage === "line";
  const isExpandStage = bootStage === "expand";
  const isUIStage = bootStage === "ui";

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
      <div
        className={`h-px bg-brand-charcoal/80 transition-all duration-700 ease-in-out
          ${isInitStage ? "w-0 opacity-0" : "w-full opacity-100"}
          ${isUIStage ? "opacity-0" : ""}
        `}
      />
      <div
        className={`absolute w-full bg-brand-beige transition-all duration-1000 ease-expo
          ${isInitStage || isLineStage ? "h-0" : ""}
          ${isExpandStage ? "h-full" : ""}
          ${isUIStage ? "h-full opacity-0" : ""}
        `}
      />
    </div>
  );
}
