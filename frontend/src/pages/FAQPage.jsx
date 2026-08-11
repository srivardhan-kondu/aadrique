import { Seo } from "@/components/Seo";
import { LineReveal, Reveal } from "@/components/motion/Reveal";
import { CTABand } from "@/components/CTABand";
import { useFaqs } from "@/lib/api";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQPage() {
  const { data: groups = [], isLoading } = useFaqs();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((g) =>
      g.items.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      }))
    ),
  };

  return (
    <div data-testid="faq-page">
      <Seo title="FAQ" description="Common questions about working with AADRIQUE — engagements, pricing, technology and delivery." jsonLd={jsonLd} />

      <section className="pt-24 md:pt-28 pb-12 md:pb-14 border-b border-line relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-20 hatch opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="label-tech text-accentText mb-6">FAQ</p>
          <LineReveal
            as="h1"
            className="font-grotesk font-semibold tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl max-w-4xl"
            lines={["Straight answers", "to fair questions."]}
          />
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {isLoading ? (
            <p className="text-mutedInk" data-testid="faq-loading">Loading questions…</p>
          ) : (
            groups.map((group, gi) => (
              <Reveal key={group.category} delay={gi * 0.05} className="grid lg:grid-cols-12 gap-8 py-10 border-b border-line last:border-b-0">
                <div className="lg:col-span-4">
                  <p className="label-tech text-accentText">{String(gi + 1).padStart(2, "0")}</p>
                  <h2 className="mt-4 font-grotesk font-semibold text-2xl md:text-3xl max-w-xs">{group.category}</h2>
                </div>
                <div className="lg:col-span-8">
                  <Accordion type="single" collapsible className="border-t border-line">
                    {group.items.map((f, i) => (
                      <AccordionItem key={i} value={`g${gi}-f${i}`} className="border-b border-line">
                        <AccordionTrigger
                          data-testid={`faq-trigger-${gi}-${i}`}
                          className="font-grotesk text-left text-base md:text-lg text-inkStrong hover:text-accentText hover:no-underline py-6"
                        >
                          {f.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-mutedInk leading-relaxed pb-6 text-sm md:text-base">
                          {f.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </Reveal>
            ))
          )}
        </div>
      </section>

      <CTABand title="Still have a question?" subtitle="Ask us directly — a real person replies within one business day." />
    </div>
  );
}
