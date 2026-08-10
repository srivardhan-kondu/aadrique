import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { Seo } from "@/components/Seo";
import { LineReveal, Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { CTABand } from "@/components/CTABand";
import { useIndustry, useCaseStudy } from "@/lib/api";

export default function IndustryDetail() {
  const { slug } = useParams();
  const { data: industry, isLoading, isError } = useIndustry(slug);
  const { data: relatedCs } = useCaseStudy(industry?.related_case_study);

  if (isLoading)
    return <div className="pt-48 pb-32 text-center text-mutedInk" data-testid="industry-loading">Loading…</div>;
  if (isError || !industry)
    return (
      <div className="pt-48 pb-32 text-center" data-testid="industry-not-found">
        <p className="text-mutedInk">Industry not found.</p>
        <Link to="/industries" className="mt-4 inline-block text-accentText link-underline">← All industries</Link>
      </div>
    );

  return (
    <div data-testid="industry-detail-page">
      <Seo title={industry.name} description={industry.overview} />

      <section className="pt-40 pb-20 border-b border-line relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-20 hatch opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Link to="/industries" data-testid="industry-back-link" className="inline-flex items-center gap-2 label-tech text-mutedInk hover:text-accentText transition-colors duration-300 mb-10">
            <ArrowLeft className="w-3.5 h-3.5" /> Industries
          </Link>
          <p className="label-tech text-accentText mb-6">{industry.headline}</p>
          <LineReveal
            as="h1"
            className="font-grotesk font-semibold tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl max-w-4xl"
            lines={[industry.name]}
          />
          <Reveal delay={0.3} className="mt-8 max-w-2xl">
            <p className="text-mutedInk text-base md:text-lg leading-relaxed">{industry.overview}</p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-28 border-b border-line" data-testid="industry-challenges-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-14">
          <Reveal>
            <p className="label-tech text-accentText mb-8">Sector challenges</p>
            <ul className="border-t border-line">
              {industry.challenges.map((c, i) => (
                <li key={i} className="flex items-baseline gap-4 py-5 border-b border-line">
                  <span className="label-tech text-mutedInk">0{i + 1}</span>
                  <span className="text-inkStrong font-grotesk">{c}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="label-tech text-accentText mb-8">Applicable solutions</p>
            <Stagger className="grid gap-px bg-line border border-line" stagger={0.06}>
              {industry.solutions.map((s, i) => (
                <StaggerItem key={i}>
                  <div className="flex gap-4 p-5 bg-bg">
                    <Check className="w-4 h-4 text-accentText shrink-0 mt-1" />
                    <p className="text-sm text-ink leading-relaxed">{s}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-28 border-b border-line bg-surface" data-testid="industry-outcomes-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal><p className="label-tech text-accentText mb-12">Outcomes we target</p></Reveal>
          <div className="grid md:grid-cols-3 gap-px bg-line border border-line">
            {industry.outcomes.map((o, i) => (
              <Reveal key={i} delay={i * 0.08} className="p-8 md:p-10 bg-bg">
                <span className="inline-block h-6 w-px rotate-[30deg] bg-accent mb-6" />
                <p className="font-grotesk font-semibold text-xl leading-snug">{o}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {relatedCs && (
        <section className="py-20 md:py-28" data-testid="industry-related-work-section">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <Reveal>
              <p className="label-tech text-accentText mb-10">Relevant work</p>
              <Link
                to={`/work/${relatedCs.slug}`}
                data-testid={`industry-related-case-${relatedCs.slug}`}
                className="group block border border-line p-8 md:p-12 hover:border-accent transition-colors duration-300"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="label-tech text-accentText">
                      {[relatedCs.sector, relatedCs.year].filter(Boolean).join(" · ")}
                    </p>
                    <h2 className="mt-4 font-grotesk font-semibold text-2xl md:text-3xl max-w-2xl group-hover:text-accentText transition-colors duration-300">
                      {relatedCs.title}
                    </h2>
                  </div>
                  <ArrowUpRight className="w-6 h-6 text-mutedInk group-hover:text-accentText transition-colors duration-300 shrink-0" />
                </div>
                {(relatedCs.results || []).length > 0 ? (
                  <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
                    {relatedCs.results.map((r) => (
                      <div key={r.label}>
                        <p className="font-grotesk font-semibold text-2xl text-inkStrong">{r.metric}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-wide text-mutedInk">{r.label}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-8 text-sm text-mutedInk leading-relaxed max-w-2xl">{relatedCs.teaser}</p>
                )}
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      <CTABand title={`Transforming ${industry.name.toLowerCase()}? Let's talk.`} />
    </div>
  );
}
