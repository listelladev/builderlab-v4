import type { Metadata } from "next";
import { LegalContent } from "@/components/LegalContent";
import { termsOfService } from "@/lib/legal";

export const metadata: Metadata = {
  title: 'Terms & Conditions | Builderlab',
  description: "The terms governing your use of builderlab.com and Builderlab's services.",
  openGraph: {
    title: 'Terms & Conditions | Builderlab',
    description: "The terms governing your use of builderlab.com and Builderlab's services.",
    url: '/terms-conditions',
    siteName: "Builderlab",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: 'Terms & Conditions | Builderlab',
    description: "The terms governing your use of builderlab.com and Builderlab's services.",
  },
};

export default function TermsConditionsPage() {
  return <LegalContent doc={termsOfService} />;
}
