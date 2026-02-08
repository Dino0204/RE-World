export const Background = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,53,47,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(56,53,47,0.05)_1px,transparent_1px)] bg-size-[4px_4px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,var(--color-brand-beige-dark)_100%)] opacity-40"></div>
      {/* todo: Next Image*/}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      ></div>
    </div>
  );
};
