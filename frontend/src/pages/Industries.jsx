import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { LineReveal, Reveal } from "@/components/motion/Reveal";
import { CTABand } from "@/components/CTABand";
import { useIndustries } from "@/lib/api";

export default function Industries() {
  const { data: industries = [], isLoading } = useIndustries();

  return (
    <div data-testid="industries-page">
      <Seo title="Industries" description="Healthcare, retail, education, financial services, manufacturing and public sector — where AADRIQUE delivers transformation." />

      <section className="pt-24 md:pt-28 pb-12 md:pb-14 border-b border-line relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-20 hatch opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="label-tech text-accentText mb-6">Industries</p>
          <LineReveal
            as="h1"
            className="font-grotesk font-semibold tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl max-w-4xl"
            lines={["Different sectors.", "Same discipline."]}
          />
          <Reveal delay={0.4} className="mt-8 max-w-2xl">
            <p className="text-mutedInk text-base md:text-lg leading-relaxed">
              Technology problems wear different uniforms in every industry, but the method doesn't change:
              understand the sector's economics, then build what moves them.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {isLoading ? (
            <p className="text-mutedInk" data-testid="industries-loading">Loading industries…</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-px bg-line border border-line">
              {industries.map((ind, i) => (
                <Reveal key={ind.slug} delay={(i % 2) * 0.08}>
                  <Link
                    to={`/industries/${ind.slug}`}
                    data-testid={`industries-grid-card-${ind.slug}`}
                    className="group flex flex-col h-full min-h-[210px] p-8 md:p-10 bg-bg hover:bg-surface transition-colors duration-500"
                  >
                    <div className="flex items-start justify-between">
                      <span className="label-tech text-mutedInk">{String(i + 1).padStart(2, "0")}</span>
                      <ArrowUpRight className="w-5 h-5 text-mutedInk group-hover:text-accentText transition-colors duration-300" />
                    </div>
                    <h2 className="mt-8 font-grotesk font-semibold text-2xl md:text-3xl group-hover:text-accentText transition-colors duration-300">
                      {ind.name}
                    </h2>
                    <p className="mt-2 label-tech text-accentText">{ind.headline}</p>
                    <p className="mt-5 text-sm text-mutedInk leading-relaxed max-w-md">{ind.overview}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABand title="Don't see your industry? Talk to us anyway." subtitle="The method transfers. If your sector runs on processes, data and decisions, we can help." />
    </div>
  );
}
