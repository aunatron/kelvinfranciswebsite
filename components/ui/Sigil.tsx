type SigilProps = {
  cut?: "master" | "small";
  wings?: boolean;
  inscribe?: boolean;
  className?: string;
  label?: string;
};

/**
 * The KF sigil. Geometry is canon — reproduce exactly, never rotate,
 * never redesign. currentColor everywhere so the mode engine recolours it.
 */
export default function Sigil({
  cut = "master",
  wings = true,
  inscribe = false,
  className,
  label,
}: SigilProps) {
  const strokeWidth = cut === "small" ? 3.5 : 2;
  const junctionR = cut === "small" ? 2.6 : 1.8;
  // Classes are always present; the `sigil-draw` container class starts the
  // inscription — statically via `inscribe`, or added later (the Rupture).
  const s = "s-stroke";
  const f = "s-fill";

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={[inscribe ? "sigil-draw" : "", className ?? ""].join(" ").trim() || undefined}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
        <circle cx="50" cy="16" r="10" className={s} />
        <line x1="50" y1="21" x2="50" y2="50" className={s} />
        <line x1="50" y1="50" x2="40" y2="50" className={s} />
        <line x1="50" y1="50" x2="60" y2="50" className={s} />
        <circle cx="34" cy="50" r="5" className={s} />
        <circle cx="66" cy="50" r="5" className={s} />
        <line x1="50" y1="50" x2="50" y2="58" className={s} />
        <circle cx="50" cy="64" r="5" className={s} />
        <line x1="50" y1="70" x2="50" y2="88" className={s} />
        {wings && (
          <>
            <line x1="44.5" y1="37" x2="32" y2="19" className={s} />
            <line x1="44" y1="45" x2="34.5" y2="31.3" className={s} />
            <line x1="55.5" y1="37" x2="68" y2="19" className={s} />
            <line x1="56" y1="45" x2="65.5" y2="31.3" className={s} />
          </>
        )}
      </g>
      <circle cx="50" cy="16" r="5" fill="currentColor" className={f} />
      <circle cx="50" cy="50" r={junctionR} fill="currentColor" className={f} />
      <polygon points="50,96.5 47.2,87.5 52.8,87.5" fill="currentColor" className={f} />
    </svg>
  );
}
