export const Footer = () => {
  return (
    <div className="relative z-20 w-full h-12 border-t-2 border-brand-beige-dark bg-brand-beige-mid/50 flex items-center justify-center backdrop-blur-sm">
      {/* Decorative Pattern Line on Top */}
      <div className="absolute -top-1.5 left-0 w-full h-1.5 flex overflow-hidden opacity-40">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 border-l border-b border-brand-charcoal transform rotate-45 -translate-y-1.5 shrink-0 mx-0.5"
          ></div>
        ))}
      </div>

      <div className="text-[10px] text-brand-charcoal-muted tracking-[1em] font-bold opacity-80">
        FOR THE GLORY OF MANKIND
      </div>
    </div>
  );
};
