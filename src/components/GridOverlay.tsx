// Faint graph-paper grid laid over a section's glow/base background —
// two repeating-linear-gradient hairlines (one per axis) rather than an
// image, so it scales losslessly and stays crisp at any viewport width.
// Sits above the glow blobs (later in DOM = higher stacking, no z-index
// needed since none of the glow layers set one either) so the lines read
// as an overlay across the whole section, glow included, matching the
// reference screenshot rather than being masked by it.
export function GridOverlay({ opacity = 0.05 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)",
        backgroundSize: "88px 88px",
        opacity,
        maskImage:
          "radial-gradient(ellipse at center, black 40%, transparent 85%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 40%, transparent 85%)",
      }}
    />
  );
}
