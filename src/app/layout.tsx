import type { Metadata } from "next";
import { preconnect } from "react-dom";
import localFont from "next/font/local";
import "./globals.css";

// Used only for the client-name "signature" treatment on case study
// testimonials, kept separate from the body font stack.
const signature = localFont({
  src: "../fonts/Thesignature.ttf",
  variable: "--font-signature",
});

export const metadata: Metadata = {
  title: "Builderlab | Growth Marketing Agency for Custom Home Builders",
  description:
    "The growth partner for custom home builders. Scroll-stopping ads, Meta & Google Ads, and landing pages that convert.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Emitted as <link rel="preconnect"> in the SSR'd head: the reel videos
  // and Wistia testimonials live on these hosts, and on a phone the
  // DNS+TCP+TLS handshake otherwise happens only once the first media
  // request is already being made.
  preconnect("https://vz-8f67defd-6ab.b-cdn.net");
  preconnect("https://fast.wistia.com");
  return (
    <html lang="en" className={`h-full antialiased ${signature.variable}`}>
      <body className="min-h-full flex flex-col bg-[#08120e] text-[#f4f4f9]">
        {children}
      </body>
    </html>
  );
}
