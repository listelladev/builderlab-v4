import type { Metadata } from "next";
import Script from "next/script";
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
  preconnect("https://connect.facebook.net");
  return (
    <html lang="en" className={`h-full antialiased ${signature.variable}`}>
      <body className="min-h-full flex flex-col bg-[#08120e] text-[#f4f4f9]">
        {/* Diagnostic: ?fx=off strips every decorative effect (animations,
            transitions, filters, backdrop-filters, masks, reveals) via CSS
            under html.fx-off — see globals.css. Inline and first in <body>
            so the class exists before any content paints. Used to bisect
            real-device rendering cost; harmless and inert otherwise. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(location.search.indexOf('fx=off')>-1)document.documentElement.classList.add('fx-off');",
          }}
        />
        {children}

        {/* Meta Pixel (1053971497392479), site-wide.
            `afterInteractive` rather than the vendor's inline <script>: it
            keeps fbevents.js off the critical render path, which this site
            guards carefully after the mobile rendering work. The pixel
            still fires its PageView on every route. The <noscript> beacon
            is the vendor's verbatim fallback. */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1053971497392479');
fbq('track', 'PageView');`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src="https://www.facebook.com/tr?id=1053971497392479&ev=PageView&noscript=1"
          />
        </noscript>
      </body>
    </html>
  );
}
