import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

export const CTABand = ({
  title = "Let's find your next advantage.",
  subtitle = "A 30-minute conversation about your business. No pitch, no jargon — just an honest read on where technology can move your numbers.",
}) => (
  <section className="relative bg-[#FA942C] text-[#0A0A0A] overflow-hidden" data-testid="cta-band">
    <div className="absolute inset-y-0 right-0 w-1/3 hatch opacity-30 pointer-events-none" style={{ "--line": "rgba(10,10,10,0.4)" }} />
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 md:py-16">
      <Reveal>
        <p className="label-tech mb-6 text-[#0A0A0A]/70">Start the conversation</p>
        <h2 className="font-grotesk font-semibold tracking-tight text-4xl md:text-5xl max-w-3xl text-[#0A0A0A]">
          {title}
        </h2>
        <p className="mt-6 max-w-xl text-[#0A0A0A]/75 text-base md:text-lg leading-relaxed">{subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/contact"
            data-testid="cta-band-book-btn"
            className="group inline-flex items-center gap-3 bg-[#0A0A0A] text-[#F6F0DE] px-8 py-4 font-grotesk font-medium tracking-wide hover:bg-white hover:text-[#0A0A0A] transition-colors duration-300"
          >
            Book a consultation
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <a
            href="mailto:info@aadrique.in"
            data-testid="cta-band-email-link"
            className="inline-flex items-center gap-3 border border-[#0A0A0A]/40 px-8 py-4 font-grotesk font-medium tracking-wide hover:border-[#0A0A0A] transition-colors duration-300"
          >
            info@aadrique.in
          </a>
        </div>
      </Reveal>
    </div>
  </section>
);
