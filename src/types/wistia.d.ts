// Wistia's <wistia-player> is a custom element registered at runtime by
// https://fast.wistia.com/player.js — this just tells JSX it's a valid tag.
// React 19's JSX types live under React.JSX (not the old bare global JSX
// namespace), so this has to augment "react" itself, not `declare global`.
import type {} from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "wistia-player": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "media-id": string;
          aspect?: string;
          poster?: string;
          "fit-strategy"?: "cover" | "contain" | "fill" | "none" | "scale-down";
        },
        HTMLElement
      >;
    }
  }
}
