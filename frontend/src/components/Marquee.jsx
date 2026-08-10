export const Marquee = ({ items, className = "" }) => {
  const row = (key) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key === 1}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="font-grotesk font-medium uppercase tracking-[0.18em] text-[clamp(2.4rem,6vw,5.5rem)] text-outline whitespace-nowrap px-6">
            {item}
          </span>
          <span className="h-[1.2em] w-px rotate-[30deg] bg-accent/60" />
        </span>
      ))}
    </div>
  );
  return (
    <div data-testid="editorial-marquee" className={`overflow-hidden border-y border-line py-8 ${className}`}>
      <div className="marquee-track">{[0, 1].map(row)}</div>
    </div>
  );
};
