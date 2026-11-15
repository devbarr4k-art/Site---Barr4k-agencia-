// Elementos gráficos do deck: cruzes "+", blocos de pixel e manchas de cor

export function Cross({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`w-5 h-5 text-white/80 ${className}`} aria-hidden>
      <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/** Cruzes nos 4 cantos da seção, igual aos slides */
export function CornerCrosses() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] hidden sm:block" aria-hidden>
      <Cross className="absolute left-8 top-8 lg:left-14 lg:top-14" />
      <Cross className="absolute right-8 top-8 lg:right-14 lg:top-14" />
      <Cross className="absolute left-8 bottom-8 lg:left-14 lg:bottom-14" />
      <Cross className="absolute right-8 bottom-8 lg:right-14 lg:bottom-14" />
    </div>
  );
}

// Grade de pixels (1 = quadrado preenchido)
const CLUSTERS: Record<string, string[]> = {
  a: ["0011", "0110", "1101", "0001"],
  b: ["1000", "1100", "0110", "1011"],
  c: ["01100", "11010", "00111", "01001"],
  d: ["1", "0", "1"],
};

export function PixelCluster({
  variant = "a",
  size = 14,
  className = "",
  color = "bg-white",
}: {
  variant?: keyof typeof CLUSTERS;
  size?: number;
  className?: string;
  color?: string;
}) {
  const rows = CLUSTERS[variant];
  return (
    <div
      className={`pointer-events-none grid ${className}`}
      style={{ gridTemplateColumns: `repeat(${rows[0].length}, ${size}px)`, gridAutoRows: `${size}px` }}
      aria-hidden
    >
      {rows.flatMap((r, y) =>
        r.split("").map((c, x) => <span key={`${x}-${y}`} className={c === "1" ? color : ""} />)
      )}
    </div>
  );
}

export function Blobs({ variant = "hero" }: { variant?: "hero" | "left" | "right" | "bottom" }) {
  if (variant === "hero")
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="blob blob-amber drift-a" style={{ width: "62vw", height: "62vw", right: "-14vw", top: "-30vw" }} />
        <div className="blob blob-blue drift-b" style={{ width: "58vw", height: "58vw", right: "-10vw", bottom: "-34vw" }} />
        <div className="blob blob-blue drift-a" style={{ width: "26vw", height: "26vw", left: "12vw", top: "-14vw", opacity: 0.45 }} />
      </div>
    );
  if (variant === "left")
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="blob blob-blue drift-b" style={{ width: "48vw", height: "48vw", left: "-18vw", top: "10%" }} />
        <div className="blob blob-amber drift-a" style={{ width: "34vw", height: "34vw", left: "-12vw", bottom: "-18vw" }} />
      </div>
    );
  if (variant === "right")
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="blob blob-amber drift-b" style={{ width: "40vw", height: "40vw", right: "-16vw", top: "-10vw" }} />
        <div className="blob blob-blue drift-a" style={{ width: "46vw", height: "46vw", right: "-20vw", bottom: "-20vw" }} />
      </div>
    );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="blob blob-blue drift-a" style={{ width: "60vw", height: "40vw", left: "-10vw", bottom: "-26vw" }} />
      <div className="blob blob-amber drift-b" style={{ width: "40vw", height: "30vw", right: "-8vw", bottom: "-22vw" }} />
    </div>
  );
}
