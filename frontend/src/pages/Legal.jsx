import { Seo } from "@/components/Seo";
import { LineReveal, Reveal } from "@/components/motion/Reveal";

const PRIVACY = {
  title: "Privacy Policy",
  updated: "Last updated: 1 June 2026",
  sections: [
    { h: "1. Who we are", p: "AADRIQUE TECH PVT LTD ('AADRIQUE', 'we', 'us') operates www.aadrique.in. This policy explains what personal data we collect through this website, why we collect it, and how we handle it. For any privacy question, contact info@aadrique.in." },
    { h: "2. Data we collect", p: "When you submit our contact form we collect the details you provide: name, company, role, email, phone number, service interest, budget range and your message. We also collect standard technical data (IP address, browser type) in server logs for security and reliability purposes." },
    { h: "3. How we use your data", p: "We use contact form data solely to respond to your enquiry, prepare for consultations you request, and maintain a record of our correspondence. We do not sell personal data, and we do not use it for unsolicited marketing without your consent." },
    { h: "4. Legal basis", p: "We process your data on the basis of your consent (submitted via the form), our legitimate interest in responding to business enquiries, and compliance with applicable law, including India's Digital Personal Data Protection Act (DPDP) and, where applicable, the GDPR." },
    { h: "5. Retention", p: "Enquiry data is retained for as long as needed to handle your enquiry and any resulting business relationship, after which it is deleted or anonymised. You may request deletion at any time." },
    { h: "6. Sharing", p: "We do not share your personal data with third parties except service providers essential to operating this website (hosting, infrastructure), bound by confidentiality, or where required by law." },
    { h: "7. Your rights", p: "You may request access to, correction of, or deletion of your personal data, and withdraw consent at any time by writing to info@aadrique.in. We respond to verified requests within 30 days." },
    { h: "8. Changes", p: "We may update this policy from time to time. The 'last updated' date above reflects the current version. Material changes will be highlighted on this page." },
  ],
};

const TERMS = {
  title: "Terms of Service",
  updated: "Last updated: 1 June 2026",
  sections: [
    { h: "1. Acceptance", p: "By accessing www.aadrique.in you agree to these terms. If you do not agree, please do not use the website. These terms govern website use only; consulting engagements are governed by separate written agreements." },
    { h: "2. Use of the website", p: "You may use this website for lawful purposes only. You agree not to attempt to gain unauthorised access, disrupt its operation, scrape content at scale, or submit false or misleading information through our forms." },
    { h: "3. Content and intellectual property", p: "All content on this website — text, design, graphics, wordmark and monogram — is the property of AADRIQUE TECH PVT LTD unless otherwise stated, and may not be reproduced without written permission." },
    { h: "4. Placeholder content", p: "Certain metrics, client references and testimonials on this website are clearly marked as placeholders pending publication approval and should not be relied upon as verified claims." },
    { h: "5. No professional advice", p: "Website content, including articles in our Insights section, is provided for general information and does not constitute professional, legal or financial advice. Engage us formally for advice specific to your situation." },
    { h: "6. Limitation of liability", p: "To the maximum extent permitted by law, AADRIQUE is not liable for indirect or consequential loss arising from use of this website. The website is provided 'as is' without warranties of any kind." },
    { h: "7. Third-party links", p: "This website may link to third-party sites. We are not responsible for their content or privacy practices." },
    { h: "8. Governing law", p: "These terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the courts of India." },
    { h: "9. Contact", p: "Questions about these terms: info@aadrique.in or +91 96528 86208." },
  ],
};

export default function Legal({ page }) {
  const doc = page === "privacy" ? PRIVACY : TERMS;

  return (
    <div data-testid={`legal-page-${page}`}>
      <Seo title={doc.title} description={`${doc.title} for AADRIQUE TECH PVT LTD.`} />

      <section className="pt-40 pb-16 border-b border-line relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-20 hatch opacity-40 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <p className="label-tech text-accentText mb-8">Legal</p>
          <LineReveal
            as="h1"
            className="font-grotesk font-semibold tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-6xl"
            lines={[doc.title]}
          />
          <Reveal delay={0.3}>
            <p className="mt-6 text-sm text-mutedInk" data-testid="legal-last-updated">{doc.updated}</p>
          </Reveal>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          {doc.sections.map((s, i) => (
            <Reveal key={i} className="mb-10">
              <h2 className="font-grotesk font-semibold text-xl mb-3">{s.h}</h2>
              <p className="text-mutedInk leading-relaxed">{s.p}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
