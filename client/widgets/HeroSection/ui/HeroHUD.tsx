import Link from "next/link";

const WAVEFORM_HEIGHTS = [65, 30, 85, 45, 70, 25, 55, 40];

interface HeroHUDProps {
  visible: boolean;
  titleText: string;
}

export function HeroHUD({ visible, titleText }: HeroHUDProps) {
  return (
    <div
      className={`absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-between transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-brand-charcoal rounded-full animate-pulse" />
            <span className="text-[10px] tracking-[0.4em] font-bold text-brand-charcoal/80">
              SYS.ONLINE
            </span>
          </div>
          <div className="text-[9px] text-brand-charcoal-light font-light tracking-widest pl-5">
            LOC: 35.6895° N, 139.6917° E
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-brand-charcoal-light tracking-[0.4em]">
            BUILD.2049.04
          </span>
        </div>
      </div>
      <div className="relative z-30 flex flex-col items-center justify-center text-center pointer-events-auto">
        <div className="absolute -inset-12 border-x border-brand-charcoal/5 hidden md:block" />

        <div className="relative mb-12">
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-brand-charcoal flex flex-col items-center leading-none">
            <span className="text-sm font-normal tracking-[1.5em] text-brand-charcoal mb-6 block w-full border-b border-brand-charcoal/20 pb-4">
              PROJECT
            </span>
            <span className="relative">
              {titleText}
              <span className="animate-blink font-light">_</span>
            </span>
            <span className="text-2xl md:text-3xl font-light tracking-[0.8em] text-brand-charcoal-light mt-6 block">
              ODYSSEY
            </span>
          </h1>

          <div className="absolute top-1/2 -left-24 w-16 h-px bg-brand-charcoal/20 hidden md:block" />
          <div className="absolute top-1/2 -right-24 w-16 h-px bg-brand-charcoal/20 hidden md:block" />
        </div>

        <Link
          href="/lobby"
          className="group relative px-16 py-5 bg-transparent border border-brand-charcoal/20 overflow-hidden hover:border-brand-charcoal transition-all duration-300"
        >
          <div className="absolute inset-0 bg-brand-charcoal translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <div className="relative z-10 flex items-center gap-3">
            <span className="text-xs font-bold tracking-[0.3em] group-hover:text-brand-beige transition-colors">
              Authorize
            </span>
          </div>
          <div className="absolute top-0 left-0 w-1 h-1 bg-brand-charcoal group-hover:bg-brand-beige transition-colors" />
          <div className="absolute bottom-0 right-0 w-1 h-1 bg-brand-charcoal group-hover:bg-brand-beige transition-colors" />
        </Link>
      </div>
      <div className="flex justify-between items-end">
        <div className="flex items-end gap-6">
          <div className="flex items-end gap-1 h-8">
            {WAVEFORM_HEIGHTS.map((height, index) => (
              <div
                key={index}
                className="w-px bg-brand-charcoal/60 animate-pulse"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="text-[9px] text-brand-charcoal-light tracking-widest uppercase mb-1">
            Audio
            <br />
            Input
          </div>
        </div>

        <div className="flex items-end gap-4 text-right">
          <div className="text-[9px] text-brand-charcoal-light tracking-widest uppercase mb-1">
            Terrain
            <br />
            Wireframe
          </div>
          <div className="w-16 h-16 border border-brand-charcoal/10 relative flex items-center justify-center">
            <div className="w-8 h-8 border border-brand-charcoal/50 rotate-45" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,var(--color-brand-charcoal)/.1_50%,transparent_55%)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
