import type { Metadata } from "next";
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
  return (
    <html lang="en" className={`h-full antialiased ${signature.variable}`}>
      <body className="min-h-full flex flex-col bg-[#08120e] text-[#f4f4f9]">
        {children}
      </body>
    </html>
  );
}
