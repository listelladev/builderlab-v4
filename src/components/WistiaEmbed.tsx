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
      poster={poster}
      fit-strategy="cover"
      aspect="1.7777777777777777"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
