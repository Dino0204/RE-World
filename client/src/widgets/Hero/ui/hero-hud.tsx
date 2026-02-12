import Link from "next/link";

interface HeroHUDProps {
  visible: boolean;
  titleText: string;
}

export function HeroHUD({ visible, titleText }: HeroHUDProps) {
  return (
    <div
      className={`absolute inset-0 z-20 p-8 md:p-12 flex flex-col items-center justify-center transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {/* titleText */}
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
              BATTLE ROYALE
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
    </div>
  );
}
