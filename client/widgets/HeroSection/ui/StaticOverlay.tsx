import { Crosshair } from "lucide-react";

interface StaticOverlaysProps {
  visible: boolean;
}

export function StaticOverlays({ visible }: StaticOverlaysProps) {
  return (
    <div
      className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:40px_40px]" />

      <div className="absolute top-8 left-8 text-white/40">
        <Crosshair size={20} strokeWidth={1} />
      </div>
      <div className="absolute top-8 right-8 text-white/40">
        <Crosshair size={20} strokeWidth={1} />
      </div>
      <div className="absolute bottom-8 left-8 text-white/40">
        <Crosshair size={20} strokeWidth={1} />
      </div>
      <div className="absolute bottom-8 right-8 text-white/40">
        <Crosshair size={20} strokeWidth={1} />
      </div>

      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5" />
    </div>
  );
}
