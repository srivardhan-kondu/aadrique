import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { Seo } from "@/components/Seo";
import { LineReveal, Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { CTABand } from "@/components/CTABand";
import { useService, useCaseStudies } from "@/lib/api";
import { serviceIcon } from "@/lib/icons";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function ServiceDetail() {
  const { slug } = useParams();
  const { data: service, isLoading, isError } = useService(slug);
  const { data: caseStudies = [] } = useCaseStudies();

  if (isLoading)
    return <div className="pt-48 pb-32 text-center text-mutedInk" data-testid="service-loading">Loading…</div>;
  if (isError || !service)
    return (
      <div className="pt-48 pb-32 text-center" data-testid="service-not-found">
        <p className="text-mutedInk">Capability not found.</p>
        <Link to="/capabilities" className="mt-4 inline-block text-accentText link-underline">← All capabilities</Link>
      </div>
    );

  const Icon = serviceIcon(service.slug);
  const related = caseStudies.slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    provider: { "@type": "Organization", name: "AADRIQUE TECH PVT LTD" },
  };

  return (
    <div data-testid="service-detail-page">
      <Seo title={service.title} description={service.summary} jsonLd={jsonLd} />

      <section className="pt-40 pb-20 border-b border-line relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-20 hatch opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Link to="/capabilities" data-testid="service-back-link" className="inline-flex items-center gap-2 label-tech text-mutedInk hover:text-accentText transition-colors duration-300 mb-10">
            <ArrowLeft className="w-3.5 h-3.5" /> Capabilities
          </Link>
          <div className="flex items-center gap-4 mb-8">
            <Icon className="w-8 h-8 text-accentText" strokeWidth={1.5} />
            <p className="label-tech text-accentText">{service.tagline}</p>
          </div>
          <LineReveal
            as="h1"
            className="font-grotesk font-semibold tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl max-w-4xl"
            lines={[service.title]}
          />
          <Reveal delay={0.3} className="mt-8 max-w-2xl">
            <p className="text-mutedInk text-base md:text-lg leading-relaxed">{service.summary}</p>
          </Reveal>
        </div>
      </section>

      {/* Problem framing */}
      <section className="py-20 md:py-28 border-b border-line" data-testid="service-problem-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <Reveal><p className="label-tech text-accentText">The problem</p></Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal>
              <p className="font-grotesk text-2xl md:text-3xl leading-snug text-inkStrong max-w-3xl">{service.problem}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="py-20 md:py-28 border-b border-line" data-testid="service-whatwedo-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <Reveal><p className="label-tech text-accentText">What we do</p></Reveal>
          </div>
          <Stagger className="lg:col-span-8 grid sm:grid-cols-2 gap-px bg-line border border-line" stagger={0.07}>
            {service.what_we_do.map((item, i) => (
              <StaggerItem key={i}>
                <div className="h-full p-7 bg-bg flex gap-4">
                  <Check className="w-4 h-4 text-accentText shrink-0 mt-1" />
                  <p className="text-sm text-ink leading-relaxed">{item}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 md:py-28 border-b border-line bg-surface" data-testid="service-process-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal><p className="label-tech text-accentText mb-12">Process</p></Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
            {service.process.map((p, i) => (
              <Reveal key={p.step} delay={i * 0.06} className="p-8 bg-bg">
                <p className="font-grotesk text-4xl font-medium text-outline-accent">0{i + 1}</p>
                <h3 className="mt-8 font-grotesk font-semibold text-xl">{p.step}</h3>
                <p className="mt-3 text-sm text-mutedInk leading-relaxed">{p.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables + stack */}
      <section className="py-20 md:py-28 border-b border-line" data-testid="service-deliverables-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-14">
          <Reveal>
            <p className="label-tech text-accentText mb-8">Deliverables</p>
            <ul className="border-t border-line">
              {service.deliverables.map((d, i) => (
                <li key={i} className="flex items-baseline gap-4 py-4 border-b border-line">
                  <span className="label-tech text-mutedInk">0{i + 1}</span>
                  <span className="text-inkStrong font-grotesk">{d}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="label-tech text-accentText mb-8">Typical stack</p>
            <div className="flex flex-wrap gap-2">
              {service.tech_stack.map((t) => (
                <span key={t} className="px-4 py-2 border border-line text-sm text-mutedInk hover:border-accent hover:text-accentText transition-colors duration-300">
                  {t}
                </span>
              ))}
            </div>
            {related.length > 0 && (
              <div className="mt-14">
                <p className="label-tech text-accentText mb-6">Related work</p>
                <div className="space-y-px">
                  {related.map((cs) => (
                    <Link key={cs.slug} to={`/work/${cs.slug}`} data-testid={`service-related-${cs.slug}`} className="group block p-5 border border-line hover:border-accent transition-colors duration-300">
                      <p className="label-tech text-mutedInk">{cs.sector}</p>
                      <p className="mt-2 font-grotesk text-inkStrong group-hover:text-accentText transition-colors duration-300">{cs.title}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28" data-testid="service-faq-section">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <Reveal><p className="label-tech text-accentText mb-10">Common questions</p></Reveal>
          <Accordion type="single" collapsible className="border-t border-line">
            {service.faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b border-line">
                <AccordionTrigger data-testid={`service-faq-trigger-${i}`} className="font-grotesk text-left text-lg text-inkStrong hover:text-accentText hover:no-underline py-6">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-mutedInk leading-relaxed pb-6">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CTABand title={`Talk to us about ${service.title.toLowerCase()}.`} />
    </div>
  );
}
