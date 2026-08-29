// wistia-player exposes both `poster` (a custom thumbnail image, overriding
// Wistia's own auto-generated video-frame swatch) and `fit-strategy="cover"`
// (crops to fill the box instead of letterboxing/pillarboxing to fit it) as
// first-class attributes — confirmed against the player's own reflected
// properties and its rendered <video>'s computed object-fit, in both the
// poster and the actually-playing state. No shadow-DOM overrides needed,
// and no custom play-button facade either: Wistia's own poster + play
// button already trigger real playback on a single click, so a wrapper
// component with its own play button had to be removed, since clicking it
// only unmounted-and-remounted the player, which put Wistia's play button
// right back where it started instead of starting playback.
// A <video poster> is a plain fetch, so it never goes through next/image
// the way a <Image> would — these posters were being served at their
// full source size (up to 2050px wide) into a card that is 288px on
// mobile and 380px on desktop. Lighthouse costed the largest single one
// at 354KB of waste. Routing them through the optimizer endpoint by hand
// gets the same resize/format negotiation an <Image> would: 1080 is a
// default deviceSize, and still covers the widest card at 3x DPR, so
// nothing is visibly softer.
function optimized(src: string, width = 1080, quality = 75) {
  if (!src.startsWith("/")) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

export function WistiaEmbed({
  mediaId,
  poster,
}: {
  mediaId: string;
  poster: string;
}) {
  return (
    <wistia-player
      media-id={mediaId}
      poster={optimized(poster)}
      fit-strategy="cover"
      aspect="1.7777777777777777"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
