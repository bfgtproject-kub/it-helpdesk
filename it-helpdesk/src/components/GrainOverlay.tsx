const NOISE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/**
 * Barely-there film grain + a soft gold glow, layered behind page content.
 * Fixed + pointer-events-none so it never interferes with interaction;
 * kept out of the accessibility tree since it's purely decorative.
 */
export default function GrainOverlay() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -top-40 right-0 h-[36rem] w-[36rem] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--gold-light) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
        style={{ backgroundImage: `url("${NOISE_SVG}")` }}
      />
    </div>
  );
}
