import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { LineReveal, Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { CTABand } from "@/components/CTABand";
import { useServices } from "@/lib/api";
import { serviceIcon } from "@/lib/icons";

export default function Capabilities() {
  const { data: services = [], isLoading } = useServices();

  return (
    <div data-testid="capabilities-page">
      <Seo title="Capabilities" description="AI consulting, transformation, custom software, cloud, data and automation — eleven capabilities, one philosophy: understand first." />

      <section className="pt-24 md:pt-28 pb-12 md:pb-14 border-b border-line relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-20 hatch-accent opacity-25 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="label-tech text-accentText mb-6">Capabilities</p>
          <LineReveal
            as="h1"
            className="font-grotesk font-semibold tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl max-w-4xl"
            lines={["Eleven disciplines.", "One philosophy."]}
          />
          <Reveal delay={0.4} className="mt-8 max-w-2xl">
            <p className="text-mutedInk text-base md:text-lg leading-relaxed">
              Every capability below starts the same way: with your business, not our toolbox. Explore each to see
              the problem it solves, how we deliver it, and what you receive.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {isLoading ? (
            <p className="text-mutedInk" data-testid="capabilities-loading">Loading capabilities…</p>
          ) : (
            <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line" stagger={0.05}>
              {services.map((s, i) => {
                const Icon = serviceIcon(s.slug);
                return (
                  <StaggerItem key={s.slug}>
                    <Link
                      to={`/capabilities/${s.slug}`}
                      data-testid={`capabilities-grid-card-${s.slug}`}
                      className="group flex flex-col h-full min-h-[230px] p-8 md:p-10 bg-bg hover:bg-surface transition-colors duration-500"
                    >
                      <div className="flex items-start justify-between">
                        <Icon className="w-7 h-7 text-accentText" strokeWidth={1.5} />
                        <span className="label-tech text-mutedInk">{String(i + 1).padStart(2, "0")}</span>
                      </div>
                      <h2 className="mt-8 font-grotesk font-semibold text-2xl group-hover:text-accentText transition-colors duration-300">{s.title}</h2>
                      <p className="mt-2 label-tech text-accentText">{s.tagline}</p>
                      <p className="mt-4 text-sm text-mutedInk leading-relaxed flex-1">{s.summary}</p>
                      <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-inkStrong">
                        View detail <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </StaggerItem>
                );
              })}
              <StaggerItem>
                <Link
                  to="/products"
                  data-testid="capabilities-grid-card-products"
                  className="group flex flex-col justify-between h-full min-h-[230px] p-8 md:p-10 bg-accent text-[#0A0A0A]"
                >
                  <ArrowUpRight className="w-7 h-7 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" strokeWidth={1.5} />
                  <div className="mt-8">
                    <h2 className="font-grotesk font-semibold text-2xl">Prefer something ready-built?</h2>
                    <p className="mt-4 text-sm text-[#0A0A0A]/70 leading-relaxed">
                      Explore our own AI products — the same engineering standard, delivered as software you can start using now.
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            </Stagger>
          )}
        </div>
      </section>

      <CTABand title="Not sure which capability fits your problem?" subtitle="That's exactly the conversation we're best at. Tell us the problem — we'll map the path." />
    </div>
  );
}
