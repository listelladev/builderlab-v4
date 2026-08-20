// Content for /privacy-policy and /terms-conditions, modeled as blocks so
// the shared LegalContent renderer can lay out headings, sub-headings,
// paragraphs, and bulleted lists consistently across both pages.
export type LegalBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export type LegalDoc = {
  title: string;
  effectiveDate: string;
  company: string;
  contact: string;
  intro: string;
  blocks: LegalBlock[];
};

export const privacyPolicy: LegalDoc = {
  title: "Privacy Policy",
  effectiveDate: "November 10, 2025",
  company: "BuilderLab Group Inc.",
  contact: "info@builderlab.com",
  intro:
    "BuilderLab Group Inc. is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and handle your personal information when you visit our website or use our services.",
  blocks: [
    { type: "heading", text: "1. Information We Collect" },
    { type: "subheading", text: "1.1 Information You Provide" },
    { type: "paragraph", text: "We collect personal information when you:" },
    {
      type: "list",
      items: [
        "Submit a contact form",
        "Book a consultation",
        "Request services or support",
        "Subscribe to newsletters",
      ],
    },
    { type: "paragraph", text: "This may include:" },
    {
      type: "list",
      items: [
        "Full name",
        "Email address",
        "Phone number",
        "Company name",
        "Job title",
        "Any information you choose to provide",
      ],
    },
    { type: "subheading", text: "1.2 Information Collected Automatically" },
    {
      type: "paragraph",
      text: "We automatically collect technical information including:",
    },
    {
      type: "list",
      items: [
        "IP address",
        "Browser type and version",
        "Device and operating system",
        "Pages visited",
        "Time and date of visits",
        "Referral sources",
      ],
    },
    { type: "subheading", text: "1.3 Cookies and Tracking" },
    {
      type: "paragraph",
      text: "We use cookies, analytics tools, and tracking technologies to improve site performance and user experience.",
    },
    {
      type: "paragraph",
      text: "You can manage cookies through your browser settings.",
    },

    { type: "heading", text: "2. How We Use Your Information" },
    { type: "paragraph", text: "We use your information to:" },
    {
      type: "list",
      items: [
        "Deliver services and respond to inquiries",
        "Improve website performance",
        "Send updates or marketing emails (only if you opt in)",
        "Maintain records and internal reporting",
        "Comply with legal requirements",
        "Enforce our policies",
      ],
    },

    { type: "heading", text: "3. Legal Basis (EEA Users)" },
    {
      type: "paragraph",
      text: "For users in the European Economic Area, we process personal data under:",
    },
    {
      type: "list",
      items: ["Consent", "Contract necessity", "Legal obligations", "Legitimate interest"],
    },

    { type: "heading", text: "4. Sharing Your Information" },
    {
      type: "paragraph",
      text: "We do not sell or rent your personal information. We may share data with:",
    },
    { type: "subheading", text: "4.1 Service Providers" },
    { type: "paragraph", text: "Trusted vendors who assist with:" },
    {
      type: "list",
      items: [
        "Email marketing",
        "CRM systems",
        "Scheduling tools",
        "Analytics",
        "Website hosting",
      ],
    },
    {
      type: "paragraph",
      text: "These providers must protect your data and use it only for authorized purposes.",
    },
    { type: "subheading", text: "4.2 Legal Requirements" },
    {
      type: "paragraph",
      text: "We may disclose information if required to comply with legal obligations or protect rights and safety.",
    },

    { type: "heading", text: "5. Data Retention" },
    {
      type: "paragraph",
      text: "We retain personal data only as long as necessary for:",
    },
    {
      type: "list",
      items: [
        "Providing services",
        "Business operations",
        "Record keeping",
        "Compliance with legal obligations",
      ],
    },
    {
      type: "paragraph",
      text: "If you request deletion, we will remove your information unless we must retain it under law.",
    },

    { type: "heading", text: "6. Data Security" },
    {
      type: "paragraph",
      text: "We use administrative, technical, and physical safeguards including:",
    },
    {
      type: "list",
      items: ["Secure hosting", "SSL encryption", "Access controls", "Regular updates and monitoring"],
    },
    {
      type: "paragraph",
      text: "While we prioritize security, no system is fully secure and we cannot guarantee absolute protection.",
    },

    { type: "heading", text: "7. Your Rights" },
    { type: "subheading", text: "7.1 GDPR Rights" },
    { type: "paragraph", text: "Users in the EU or EEA may request:" },
    {
      type: "list",
      items: ["Access", "Correction", "Deletion", "Restriction", "Objection", "Data portability"],
    },
    {
      type: "paragraph",
      text: "Contact info@builderlab.com to exercise these rights.",
    },
    { type: "subheading", text: "7.2 California Residents (CCPA)" },
    { type: "paragraph", text: "California residents may request:" },
    {
      type: "list",
      items: [
        "Disclosure of data collected",
        "Deletion of personal information",
        "Opt out of data selling",
        "Non discrimination for exercising rights",
      ],
    },
    { type: "paragraph", text: "BuilderLab does not sell personal data." },

    { type: "heading", text: "8. Email Preferences" },
    {
      type: "paragraph",
      text: "You may unsubscribe from promotional emails at any time. Transactional emails related to services may still be sent.",
    },

    { type: "heading", text: "9. Third Party Links" },
    {
      type: "paragraph",
      text: "We are not responsible for the content or privacy practices of third party sites linked from our website.",
    },

    { type: "heading", text: "10. Children’s Privacy" },
    {
      type: "paragraph",
      text: "We do not knowingly collect data from children under the age of 13. If such data is discovered, we will delete it promptly.",
    },

    { type: "heading", text: "11. International Data Transfers" },
    {
      type: "paragraph",
      text: "If you access our site from outside Canada, your data may be transferred to and stored in Canada or other locations with different privacy laws.",
    },

    { type: "heading", text: "12. Updates to This Policy" },
    {
      type: "paragraph",
      text: "We may update this Privacy Policy periodically. Continued use of the website means you accept the updated version.",
    },

    { type: "heading", text: "13. Contact" },
    { type: "paragraph", text: "BuilderLab Group Inc." },
    { type: "paragraph", text: "Email: info@builderlab.com" },
    { type: "paragraph", text: "Website: builderlab.com" },
  ],
};

export const termsOfService: LegalDoc = {
  title: "Terms and Conditions",
  effectiveDate: "November 10, 2025",
  company: "BuilderLab Group Inc.",
  contact: "info@builderlab.com",
  intro:
    "Welcome to BuilderLab Group Inc. These Terms and Conditions govern your use of our website builderlab.com and any services offered through it. By accessing or using our website, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, please do not use the website.",
  blocks: [
    { type: "heading", text: "1. About BuilderLab Group Inc." },
    {
      type: "paragraph",
      text: "BuilderLab Group Inc. provides consulting, advisory, and digital service support for builders, contractors, and related industries. All information on this site is for general purposes and should not be considered legal, financial, or personalized professional advice unless explicitly stated.",
    },

    { type: "heading", text: "2. Use of the Website" },
    { type: "subheading", text: "2.1 Eligibility" },
    {
      type: "paragraph",
      text: "You must be at least 18 years old to use our website or submit information.",
    },
    { type: "subheading", text: "2.2 Permitted Use" },
    {
      type: "paragraph",
      text: "You agree to use the site only for lawful purposes and in accordance with these Terms. You may not:",
    },
    {
      type: "list",
      items: [
        "Disrupt, damage, or interfere with website performance",
        "Attempt to access restricted areas or data",
        "Copy, distribute, or modify content without permission",
        "Upload harmful, malicious, or offensive content",
      ],
    },

    { type: "heading", text: "3. Intellectual Property" },
    {
      type: "paragraph",
      text: "All website content including text, graphics, branding, images, videos, layout, and downloads is owned by BuilderLab Group Inc. or its licensors. You may not reuse or distribute any content without written consent.",
    },

    { type: "heading", text: "4. Bookings, Payments, and Services" },
    {
      type: "paragraph",
      text: "Bookings made through our site or third party platforms are subject to availability and confirmation. Pricing is available where applicable and may change without notice.",
    },
    {
      type: "paragraph",
      text: "Payments may be processed through third party providers such as Stripe, PayPal, or scheduling platforms.",
    },
    { type: "paragraph", text: "BuilderLab Group Inc. retains the right to:" },
    {
      type: "list",
      items: [
        "Refuse or cancel bookings",
        "Update service offerings or pricing",
        "Modify availability",
      ],
    },

    { type: "heading", text: "5. User Submissions" },
    {
      type: "paragraph",
      text: "When you submit information through forms, email, or other channels, you grant us the right to use that information for communication and business purposes consistent with our Privacy Policy.",
    },
    {
      type: "paragraph",
      text: "You agree not to submit content that is offensive, defamatory, infringes on intellectual property, or contains harmful code.",
    },

    { type: "heading", text: "6. Third Party Links" },
    {
      type: "paragraph",
      text: "Our website may link to third party websites. We are not responsible for their content, policies, or actions. Access third party sites at your own risk.",
    },

    { type: "heading", text: "7. Disclaimers" },
    {
      type: "paragraph",
      text: "The site and its content are provided on an as is basis. We do not guarantee accuracy, completeness, or reliability.",
    },
    {
      type: "paragraph",
      text: "We disclaim all warranties to the fullest extent permitted by law, including implied warranties of fitness for a particular purpose and non infringement.",
    },

    { type: "heading", text: "8. Limitation of Liability" },
    {
      type: "paragraph",
      text: "BuilderLab Group Inc. is not liable for any direct or indirect losses including damages related to website use, service performance, or reliance on information provided.",
    },

    { type: "heading", text: "9. Indemnification" },
    {
      type: "paragraph",
      text: "You agree to indemnify and hold harmless BuilderLab Group Inc. from claims, losses, liabilities, or damages resulting from your use of the site or violation of these Terms.",
    },

    { type: "heading", text: "10. No Refund Policy" },
    {
      type: "paragraph",
      text: "All payments made to BuilderLab Group Inc. are final and non refundable. Once services begin, no refunds, credits, or guarantees of outcomes are provided.",
    },
    { type: "paragraph", text: "The client acknowledges:" },
    {
      type: "list",
      items: [
        "The deliverables include expertise, strategy, and time",
        "Results vary depending on external market conditions",
        "No specific performance or financial outcomes are guaranteed",
      ],
    },
    {
      type: "paragraph",
      text: "Chargebacks or payment disputes are not permitted. Any attempt to reverse or dispute payment is considered a material breach and may lead to legal action to recover funds, legal fees, and related costs.",
    },
    {
      type: "paragraph",
      text: "Cancellations or failures related to the client’s own customers or internal processes do not qualify for refunds or credits.",
    },
    {
      type: "paragraph",
      text: "This refund policy remains in full effect throughout and after the agreement term.",
    },

    { type: "heading", text: "11. Termination" },
    {
      type: "paragraph",
      text: "We may suspend or terminate access to the website or services at our discretion if these Terms are violated.",
    },

    { type: "heading", text: "12. Governing Law" },
    {
      type: "paragraph",
      text: "These Terms are governed by the laws of the Province of Alberta, Canada. Disputes shall be handled in the courts located in Calgary, Alberta.",
    },

    { type: "heading", text: "13. Changes to Terms" },
    {
      type: "paragraph",
      text: "We may update these Terms at any time. Continued use of the site means you accept the updated version.",
    },

    { type: "heading", text: "14. Contact" },
    { type: "paragraph", text: "BuilderLab Group Inc." },
    { type: "paragraph", text: "Email: info@builderlab.com" },
    { type: "paragraph", text: "Website: builderlab.com" },
  ],
};
