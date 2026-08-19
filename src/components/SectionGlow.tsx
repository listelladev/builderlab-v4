// The same three-blob radial-gradient backdrop used behind every section
// on the homepage, factored out so new pages stay pixel-identical to it
// instead of hand-copying the markup each time.
export function SectionGlow({
  positions = [
    "top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] blur-[160px] opacity-30",
    "bottom-0 left-1/4 w-[500px] h-[400px] blur-[150px] opacity-20",
    "bottom-0 right-1/4 w-[500px] h-[400px] blur-[160px] opacity-20",
  ],
}: {
  positions?: string[];
}) {
  return (
    <>
      <div className="absolute inset-0 bg-[#08120E]" />
      {positions.map((pos, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${pos}`}
          style={{
            background: "radial-gradient(ellipse, #38B685, transparent 70%)",
          }}
        />
      ))}
    </>
  );
}
