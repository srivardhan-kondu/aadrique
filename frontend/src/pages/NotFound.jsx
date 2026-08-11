import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { LineReveal, Reveal } from "@/components/motion/Reveal";
import { NAV_LINKS } from "@/lib/site";

export default function NotFound() {
  return (
    <div data-testid="not-found-page">
      <Seo
        title="Page not found"
        description="The page you're looking for doesn't exist. Explore AADRIQUE's capabilities, industries and work."
        noindex
      />

      <section className="pt-24 md:pt-28 pb-12 md:pb-14 border-b border-line relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-20 hatch-accent opacity-25 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="label-tech text-accentText mb-6">Error 404</p>
          <LineReveal
            as="h1"
            className="font-grotesk font-semibold tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl max-w-4xl"
            lines={["This page", "doesn't exist."]}
          />
          <Reveal delay={0.4} className="mt-8 max-w-xl">
            <p className="text-mutedInk text-base md:text-lg leading-relaxed">
              The link may be out of date or mistyped. Everything else is still where you left it.
            </p>
          </Reveal>
          <Reveal delay={0.5}>
            <Link
              to="/"
              data-testid="not-found-home-link"
              className="group mt-8 inline-flex items-center gap-3 bg-accent text-[#0A0A0A] px-10 py-4 font-grotesk font-medium tracking-wide hover:bg-inkStrong hover:text-bg transition-colors duration-300"
            >
              Back to home
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="label-tech text-mutedInk mb-8">Or try one of these</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-line">
            {[...NAV_LINKS, { label: "Contact", to: "/contact" }].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group border-r border-b border-line p-8 flex items-center justify-between hover:bg-surface transition-colors duration-300"
              >
                <span className="font-grotesk text-inkStrong group-hover:text-accentText transition-colors duration-300">
                  {link.label}
                </span>
                <ArrowUpRight className="w-4 h-4 text-mutedInk group-hover:text-accentText transition-colors duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
