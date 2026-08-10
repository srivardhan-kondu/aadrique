import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { LineReveal, Reveal } from "@/components/motion/Reveal";
import { CTABand } from "@/components/CTABand";
import { useCaseStudies } from "@/lib/api";

export default function Work() {
  const { data: caseStudies = [], isLoading } = useCaseStudies();
  const [filter, setFilter] = useState("All");

  const sectors = useMemo(() => ["All", ...new Set(caseStudies.map((c) => c.sector))], [caseStudies]);
  const filtered = filter === "All" ? caseStudies : caseStudies.filter((c) => c.sector === filter);

  return (
    <div data-testid="work-page">
      <Seo title="Work" description="Selected case studies — measurable transformation across healthcare, retail, education and logistics." />

      <section className="pt-40 pb-20 border-b border-line relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-20 hatch-accent opacity-25 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="label-tech text-accentText mb-8">Selected work</p>
          <LineReveal
            as="h1"
            className="font-grotesk font-semibold tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl max-w-4xl"
            lines={["Outcomes,", "not activity."]}
          />
          <Reveal delay={0.4} className="mt-10 max-w-2xl">
            <p className="text-mutedInk text-base md:text-lg leading-relaxed">
              Every engagement below is told the same way: the challenge, the approach, and the numbers that moved.
              Client details are anonymised placeholders pending publication approval.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="flex flex-wrap gap-2 mb-14">
            {sectors.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                data-testid={`work-filter-${s.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className={`px-5 py-2.5 border font-grotesk text-sm tracking-wide transition-colors duration-300 ${
                  filter === s
                    ? "bg-accent text-[#0A0A0A] border-accent"
                    : "border-line text-mutedInk hover:border-lineStrong hover:text-inkStrong"
                }`}
              >
                {s}
              </button>
            ))}
          </Reveal>

          {isLoading ? (
            <p className="text-mutedInk" data-testid="work-loading">Loading case studies…</p>
          ) : (
            <div className="space-y-px" data-testid="work-grid">
              {filtered.map((cs, i) => (
                <Reveal key={cs.slug} delay={i * 0.05}>
                  <Link
                    to={`/work/${cs.slug}`}
                    data-testid={`work-card-${cs.slug}`}
                    className="group grid lg:grid-cols-12 gap-8 border border-line p-8 md:p-12 hover:border-accent transition-colors duration-300 bg-bg"
                  >
                    <div className="lg:col-span-7">
                      <p className="label-tech text-accentText">{cs.sector} · {cs.year}</p>
                      <h2 className="mt-4 font-grotesk font-semibold text-2xl md:text-3xl leading-snug group-hover:text-accentText transition-colors duration-300">
                        {cs.title}
                      </h2>
                      <p className="mt-4 text-sm text-mutedInk leading-relaxed max-w-xl">{cs.teaser}</p>
                      <p className="mt-6 text-xs text-mutedInk">{cs.client}</p>
                    </div>
                    <div className="lg:col-span-5 flex flex-col justify-between">
                      <div className="grid grid-cols-3 gap-4">
                        {cs.results.map((r) => (
                          <div key={r.label} className="border-l border-line pl-4">
                            <p className="font-grotesk font-semibold text-xl md:text-2xl text-inkStrong">{r.metric}</p>
                            <p className="mt-1 text-[11px] uppercase tracking-wide text-mutedInk leading-tight">{r.label}</p>
                          </div>
                        ))}
                      </div>
                      <span className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-mutedInk group-hover:text-accentText transition-colors duration-300">
                        Read case study <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABand title="Your case study could be next." />
    </div>
  );
}
