import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { LineReveal, Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Marquee } from "@/components/Marquee";
import { CTABand } from "@/components/CTABand";
import { ProductCard } from "@/components/ProductCard";
import { useServices, useIndustries, useCaseStudies, useProducts, usePosts } from "@/lib/api";
import { serviceIcon } from "@/lib/icons";
import { SITE, EASE } from "@/lib/site";

const APPROACH = [
  { n: "01", title: "Understand", desc: "We start inside your business — operations, economics, constraints — before any technology is mentioned. The problem defines the solution, never the reverse." },
  { n: "02", title: "Identify", desc: "Every opportunity is scored against business impact, feasibility and risk. Most ideas don't survive this filter. The ones that do are worth funding." },
  { n: "03", title: "Recommend", desc: "A clear, prioritised roadmap with honest trade-offs — including the recommendation to not build, when that's the right answer." },
  { n: "04", title: "Deliver", desc: "Working software in weeks, measured against the metric it exists to move. Value is only real when your team uses it daily." },
];

const WHY = [
  { title: "Business first, technology second", desc: "We diagnose before we prescribe. If AI isn't the answer, we say so — in writing." },
  { title: "Measured in your numbers", desc: "Every engagement is tied to a metric: cost, speed, risk or revenue. Progress is reported against it." },
  { title: "Senior people, small teams", desc: "You work with the people who scope the engagement. No bait-and-switch to junior benches." },
  { title: "You own everything", desc: "Full IP transfer, documented systems, deliberate knowledge handover. Independence is the deliverable." },
];

const METRICS = [
  { value: "11", label: "Capabilities under one roof" },
  { value: "6", label: "Industry practices" },
  { value: "1 day", label: "Enquiry response time" },
  { value: "100%", label: "Client IP ownership" },
];

export default function Home() {
  const { data: services = [] } = useServices();
  const { data: industries = [] } = useIndustries();
  const { data: caseStudies = [] } = useCaseStudies();
  const { data: products = [] } = useProducts();
  const { data: posts = [] } = usePosts();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const yHatch = useTransform(scrollYProgress, [0, 1], [0, -90]);

  return (
    <div data-testid="home-page">
      <Seo />

      {/* ── Hero ─────────────────────────────────────── */}
      <section ref={heroRef} className="relative overflow-hidden border-b border-line">
        <motion.img
          src={SITE.monogram}
          alt=""
          aria-hidden="true"
          style={{ y: yA }}
          className="absolute -right-16 top-24 w-[420px] md:w-[560px] opacity-[0.07] pointer-events-none select-none"
        />
        <motion.div
          style={{ y: yHatch }}
          className="absolute right-0 top-0 h-full w-16 md:w-28 hatch-accent opacity-30 pointer-events-none"
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full pt-24 md:pt-28 pb-14 md:pb-16 relative">
          <motion.p
            className="label-tech text-accentText mb-7 flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.8 }}
          >
            <span className="inline-block h-4 w-px rotate-[30deg] bg-accent" />
            Technology Transformation Company — Build · Transform · Scale
          </motion.p>

          <LineReveal
            as="h1"
            delay={0.25}
            className="font-grotesk font-semibold tracking-tight leading-[0.98] text-5xl sm:text-6xl lg:text-7xl max-w-5xl"
            lines={["Technology that solves", "real business problems."]}
          />

          <motion.p
            className="mt-8 max-w-xl text-mutedInk text-base md:text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: EASE }}
          >
            We don't push AI into businesses. We understand yours first, identify the opportunities,
            and build practical technology that creates measurable value.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8, ease: EASE }}
          >
            <Link
              to="/contact"
              data-testid="hero-book-consultation-btn"
              className="group inline-flex items-center gap-3 bg-accent text-[#0A0A0A] px-8 py-4 font-grotesk font-medium tracking-wide hover:bg-inkStrong hover:text-bg transition-colors duration-300"
            >
              Book a consultation
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to="/capabilities"
              data-testid="hero-explore-capabilities-btn"
              className="inline-flex items-center gap-3 border border-lineStrong px-8 py-4 font-grotesk font-medium tracking-wide text-inkStrong hover:border-accent hover:text-accentText transition-colors duration-300"
            >
              Explore capabilities
            </Link>
          </motion.div>

          {/* Flagship product, surfaced in the hero. min-h reserves the row so
              the async load can't shove the trust strip down on first paint. */}
          <div className="mt-8 min-h-[46px]">
            {products.slice(0, 1).map((p) => (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.95, duration: 0.8 }}
              >
                <Link
                  to={`/products/${p.slug}`}
                  data-testid="hero-product-link"
                  className="group inline-flex flex-wrap items-center gap-3 border border-line px-4 py-2.5 hover:border-accent transition-colors duration-300"
                >
                  <span className="label-tech text-accentText">Flagship product</span>
                  <span className="font-grotesk font-medium text-inkStrong">{p.name}</span>
                  <span className="hidden sm:inline text-sm text-mutedInk">{p.tagline}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-mutedInk group-hover:text-accentText transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* trust strip */}
          <motion.div
            className="mt-10 md:mt-12 grid grid-cols-2 md:grid-cols-4 border border-line"
            data-testid="hero-trust-strip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.9 }}
          >
            {METRICS.map((m, i) => (
              <div key={m.label} className={`p-6 md:p-8 ${i > 0 ? "border-l border-line" : ""} ${i >= 2 ? "max-md:border-t max-md:border-line" : ""} ${i === 2 ? "max-md:border-l-0" : ""}`}>
                <p className="font-grotesk font-semibold text-3xl md:text-4xl text-inkStrong">{m.value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.15em] text-mutedInk">{m.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────── */}
      <Marquee items={["Build", "Transform", "Scale", "AADRIQUE"]} />

      {/* ── Products ─────────────────────────────────── */}
      {products.length > 0 && (
        <section className="relative overflow-hidden border-b border-line bg-surface" data-testid="products-section">
          <div className="absolute right-0 top-0 h-full w-16 md:w-28 hatch-accent opacity-25 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 md:py-20 relative">
            <Reveal className="flex flex-wrap items-end justify-between gap-6 mb-10">
              <div>
                <p className="label-tech text-accentText mb-6 flex items-center gap-4">
                  <span className="inline-block h-4 w-px rotate-[30deg] bg-accent" />
                  AADRIQUE Products
                </p>
                <h2 className="font-grotesk font-semibold tracking-tight text-4xl md:text-5xl lg:text-6xl max-w-3xl">
                  Our products.
                </h2>
              </div>
              <Link
                to="/products"
                data-testid="products-view-all-link"
                className="link-underline font-grotesk text-sm uppercase tracking-[0.12em] text-mutedInk hover:text-inkStrong transition-colors duration-300"
              >
                All products →
              </Link>
            </Reveal>

            <div className="space-y-px" data-testid="home-products-grid">
              {products.slice(0, 3).map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.06}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Approach: numbered manifesto ─────────────── */}
      <section className="py-12 md:py-16" data-testid="approach-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <p className="label-tech text-accentText mb-6">The AADRIQUE approach</p>
            <h2 className="font-grotesk font-semibold tracking-tight text-4xl md:text-5xl max-w-3xl">
              Understand the business.<br />
              <span className="text-outline">Then recommend.</span>
            </h2>
          </Reveal>
          <div className="mt-10 md:mt-12 border-t border-line">
            {APPROACH.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.05}>
                <div className={`group grid md:grid-cols-12 gap-4 md:gap-8 py-7 md:py-10 hover:bg-surface transition-colors duration-500 ${i < APPROACH.length - 1 ? "border-b border-line" : ""}`} data-testid={`approach-step-${step.n}`}>
                  <div className="md:col-span-2">
                    <span className="font-grotesk font-medium text-5xl md:text-6xl text-outline-accent group-hover:text-accentText transition-colors duration-500" style={{ WebkitTextStroke: undefined }}>
                      {step.n}
                    </span>
                  </div>
                  <div className="md:col-span-4">
                    <h3 className="font-grotesk font-semibold text-2xl md:text-3xl">{step.title}</h3>
                  </div>
                  <div className="md:col-span-6">
                    <p className="text-mutedInk leading-relaxed max-w-lg">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Capabilities grid ────────────────────────── */}
      <section className="py-12 md:py-16 border-t border-line" data-testid="capabilities-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="flex flex-wrap items-end justify-between gap-6 mb-8">
            <div>
              <p className="label-tech text-accentText mb-6">Capabilities</p>
              <h2 className="font-grotesk font-semibold tracking-tight text-4xl md:text-5xl">What we build.</h2>
            </div>
            <Link to="/capabilities" data-testid="capabilities-view-all-link" className="link-underline font-grotesk text-sm uppercase tracking-[0.12em] text-mutedInk hover:text-inkStrong transition-colors duration-300">
              All capabilities →
            </Link>
          </Reveal>
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line" stagger={0.05}>
            {services.map((s, i) => {
              const Icon = serviceIcon(s.slug);
              return (
                <StaggerItem key={s.slug}>
                  <Link
                    to={`/capabilities/${s.slug}`}
                    data-testid={`capability-card-${s.slug}`}
                    className="group flex flex-col justify-between h-full min-h-[190px] p-8 bg-bg hover:bg-surface transition-colors duration-500"
                  >
                    <div className="flex items-start justify-between">
                      <Icon className="w-6 h-6 text-accentText" strokeWidth={1.5} />
                      <span className="label-tech text-mutedInk">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="mt-8">
                      <h3 className="font-grotesk font-semibold text-xl group-hover:text-accentText transition-colors duration-300">{s.title}</h3>
                      <p className="mt-2 text-sm text-mutedInk leading-relaxed">{s.tagline}</p>
                      <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-mutedInk opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Explore <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
            <StaggerItem>
              <Link
                to="/contact"
                data-testid="capability-card-cta"
                className="group flex flex-col justify-between h-full min-h-[190px] p-8 bg-accent text-[#0A0A0A]"
              >
                <ArrowUpRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" strokeWidth={1.5} />
                <div className="mt-8">
                  <h3 className="font-grotesk font-semibold text-xl">Not sure where to start?</h3>
                  <p className="mt-2 text-sm text-[#0A0A0A]/70 leading-relaxed">Book a consultation — we'll help you find it.</p>
                </div>
              </Link>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* ── Industries ───────────────────────────────── */}
      <section className="py-12 md:py-16 border-t border-line" data-testid="industries-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <p className="label-tech text-accentText mb-6">Industries</p>
            <h2 className="font-grotesk font-semibold tracking-tight text-4xl md:text-5xl max-w-2xl">Where we work.</h2>
          </Reveal>
          <div className="mt-10 border-t border-line">
            {industries.map((ind, i) => (
              <Reveal key={ind.slug} delay={i * 0.04}>
                <Link
                  to={`/industries/${ind.slug}`}
                  data-testid={`industry-row-${ind.slug}`}
                  className={`group flex items-center justify-between py-6 hover:pl-4 transition-[padding] duration-500 ${i < industries.length - 1 ? "border-b border-line" : ""}`}
                >
                  <div className="flex items-baseline gap-6">
                    <span className="label-tech text-mutedInk">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-grotesk font-medium text-2xl md:text-4xl text-inkStrong group-hover:text-accentText transition-colors duration-300">
                      {ind.name}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm text-mutedInk max-w-xs text-right">{ind.headline}</span>
                  <ArrowUpRight className="w-5 h-5 text-mutedInk group-hover:text-accentText transition-colors duration-300 shrink-0 ml-4" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Selected work ────────────────────────────── */}
      <section className="py-12 md:py-16 border-t border-line bg-surface" data-testid="selected-work-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="flex flex-wrap items-end justify-between gap-6 mb-8">
            <div>
              <p className="label-tech text-accentText mb-6">Selected work</p>
              <h2 className="font-grotesk font-semibold tracking-tight text-4xl md:text-5xl">What we've built.</h2>
            </div>
            <Link to="/work" data-testid="work-view-all-link" className="link-underline font-grotesk text-sm uppercase tracking-[0.12em] text-mutedInk hover:text-inkStrong transition-colors duration-300">
              All case studies →
            </Link>
          </Reveal>
          <div className="grid lg:grid-cols-3 gap-px bg-line border border-line">
            {caseStudies.slice(0, 3).map((cs) => (
              <Link
                key={cs.slug}
                to={`/work/${cs.slug}`}
                data-testid={`case-study-teaser-${cs.slug}`}
                className="group flex flex-col justify-between p-8 md:p-10 bg-bg hover:bg-surface2 transition-colors duration-500"
              >
                <div>
                  <p className="label-tech text-accentText">{cs.sector}</p>
                  <h3 className="mt-5 font-grotesk font-semibold text-xl md:text-2xl leading-snug group-hover:text-accentText transition-colors duration-300">
                    {cs.title}
                  </h3>
                  <p className="mt-4 text-sm text-mutedInk leading-relaxed">{cs.teaser}</p>
                </div>
                {(cs.results || []).length > 0 ? (
                  <div className="mt-8 pt-6 border-t border-line grid grid-cols-3 gap-4">
                    {cs.results.map((r) => (
                      <div key={r.label}>
                        <p className="font-grotesk font-semibold text-lg md:text-xl text-inkStrong">{r.metric}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-wide text-mutedInk leading-tight">{r.label}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-8 pt-6 border-t border-line flex flex-wrap gap-2">
                    {(cs.focus || []).map((f) => (
                      <span key={f} className="text-[11px] uppercase tracking-wide text-mutedInk">{f}</span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why AADRIQUE ─────────────────────────────── */}
      <section className="py-12 md:py-16 border-t border-line" data-testid="why-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="label-tech text-accentText mb-6">Why AADRIQUE</p>
              <h2 className="font-grotesk font-semibold tracking-tight text-4xl md:text-5xl">
                Differentiators,<br />not adjectives.
              </h2>
              <p className="mt-8 text-mutedInk leading-relaxed max-w-md">
                Every consultancy claims excellence. We'd rather tell you exactly how we work — and let the way we
                work be the argument.
              </p>
            </Reveal>
          </div>
          <Stagger className="lg:col-span-7 grid sm:grid-cols-2 gap-px bg-line border border-line" stagger={0.08}>
            {WHY.map((w, i) => (
              <StaggerItem key={w.title}>
                <div className="h-full p-8 bg-bg hover:bg-surface transition-colors duration-500" data-testid={`why-card-${i}`}>
                  <span className="inline-block h-6 w-px rotate-[30deg] bg-accent mb-6" />
                  <h3 className="font-grotesk font-semibold text-lg">{w.title}</h3>
                  <p className="mt-3 text-sm text-mutedInk leading-relaxed">{w.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Insights preview ─────────────────────────── */}
      <section className="py-12 md:py-16 border-t border-line" data-testid="insights-preview-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="flex flex-wrap items-end justify-between gap-6 mb-8">
            <div>
              <p className="label-tech text-accentText mb-6">Insights</p>
              <h2 className="font-grotesk font-semibold tracking-tight text-4xl md:text-5xl">Think in public.</h2>
            </div>
            <Link to="/insights" data-testid="insights-view-all-link" className="link-underline font-grotesk text-sm uppercase tracking-[0.12em] text-mutedInk hover:text-inkStrong transition-colors duration-300">
              All insights →
            </Link>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-px bg-line border border-line">
            {posts.slice(0, 3).map((p) => (
              <Link
                key={p.slug}
                to={`/insights/${p.slug}`}
                data-testid={`insight-preview-${p.slug}`}
                className="group p-8 md:p-10 bg-bg hover:bg-surface transition-colors duration-500"
              >
                <div className="flex items-center justify-between">
                  <p className="label-tech text-accentText">{p.category}</p>
                  <p className="text-xs text-mutedInk">{p.reading_time} min read</p>
                </div>
                <h3 className="mt-6 font-grotesk font-semibold text-xl leading-snug group-hover:text-accentText transition-colors duration-300">
                  {p.title}
                </h3>
                <p className="mt-4 text-sm text-mutedInk leading-relaxed">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABand />
    </div>
  );
}
