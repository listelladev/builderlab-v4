import type { Metadata } from "next";
import { LegalContent } from "@/components/LegalContent";
import { privacyPolicy } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy | Builderlab",
  description: "How Builderlab Group Inc. collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return <LegalContent doc={privacyPolicy} />;
}
