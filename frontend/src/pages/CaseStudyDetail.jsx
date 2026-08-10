import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Seo } from "@/components/Seo";
import { LineReveal, Reveal } from "@/components/motion/Reveal";
import { CTABand } from "@/components/CTABand";
import { useCaseStudy } from "@/lib/api";

const Block = ({ label, children }) => (
  <div className="grid lg:grid-cols-12 gap-8 py-14 md:py-20 border-b border-line">
    <div className="lg:col-span-4">
      <Reveal><p className="label-tech text-accentText">{label}</p></Reveal>
    </div>
    <div className="lg:col-span-8">
      <Reveal><div className="text-ink text-base md:text-lg leading-relaxed max-w-2xl">{children}</div></Reveal>
    </div>
  </div>
);

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const { data: cs, isLoading, isError } = useCaseStudy(slug);

  if (isLoading)
    return <div className="pt-48 pb-32 text-center text-mutedInk" data-testid="case-study-loading">Loading…</div>;
  if (isError || !cs)
    return (
      <div className="pt-48 pb-32 text-center" data-testid="case-study-not-found">
        <p className="text-mutedInk">Case study not found.</p>
        <Link to="/work" className="mt-4 inline-block text-accentText link-underline">← All work</Link>
      </div>
    );

  return (
    <div data-testid="case-study-detail-page">
      <Seo title={cs.title} description={cs.teaser} />

      <section className="pt-40 pb-20 border-b border-line relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-20 hatch opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Link to="/work" data-testid="case-study-back-link" className="inline-flex items-center gap-2 label-tech text-mutedInk hover:text-accentText transition-colors duration-300 mb-10">
            <ArrowLeft className="w-3.5 h-3.5" /> All work
          </Link>
          <p className="label-tech text-accentText mb-6">{cs.sector} · {cs.year}</p>
          <LineReveal
            as="h1"
            className="font-grotesk font-semibold tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-6xl max-w-4xl"
            lines={[cs.title]}
          />
          <Reveal delay={0.3}>
            <p className="mt-8 text-sm text-mutedInk flex flex-wrap items-center gap-3">
              {cs.client}
              {cs.illustrative && (
                <span className="px-2 py-0.5 border border-line text-[10px] uppercase tracking-[0.15em]" data-testid="case-study-illustrative-badge">
                  Illustrative engagement
                </span>
              )}
            </p>
          </Reveal>

          <Reveal delay={0.4} className="mt-14 grid grid-cols-3 border border-line max-w-3xl" >
            {cs.results.map((r, i) => (
              <div key={r.label} className={`p-6 md:p-8 ${i > 0 ? "border-l border-line" : ""}`} data-testid={`case-study-metric-${i}`}>
                <p className="font-grotesk font-semibold text-2xl md:text-4xl text-accentText">{r.metric}</p>
                <p className="mt-2 text-[11px] md:text-xs uppercase tracking-wide text-mutedInk leading-tight">{r.label}</p>
              </div>
            ))}
          </Reveal>
          {cs.illustrative && (
            <p className="mt-3 text-[11px] text-mutedInk max-w-3xl" data-testid="case-study-illustrative-note">
              Representative scenario — client identity withheld; figures illustrate targeted outcomes, not verified claims.
            </p>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10" data-testid="case-study-body">
        <Block label="The challenge">{cs.challenge}</Block>
        <Block label="Our approach">{cs.approach}</Block>
        <Block label="The solution">{cs.solution}</Block>
        <Block label="Technologies">
          <div className="flex flex-wrap gap-2">
            {cs.technologies.map((t) => (
              <span key={t} className="px-4 py-2 border border-line text-sm text-mutedInk">{t}</span>
            ))}
          </div>
        </Block>
        {cs.testimonial && (
          <div className="py-16 md:py-24">
            <Reveal>
              <span className="inline-block h-8 w-px rotate-[30deg] bg-accent mb-8" />
              <blockquote className="font-grotesk text-2xl md:text-3xl leading-snug text-inkStrong max-w-3xl" data-testid="case-study-testimonial">
                “{cs.testimonial.quote}”
              </blockquote>
              <p className="mt-6 label-tech text-mutedInk">{cs.testimonial.author}</p>
            </Reveal>
          </div>
        )}
      </section>

      <CTABand title="Want results like these?" />
    </div>
  );
}
