import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check, Minus } from "lucide-react";
import { Seo } from "@/components/Seo";
import { LineReveal, Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { CTABand } from "@/components/CTABand";
import { useProduct } from "@/lib/api";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Headline = ({ lines, accent = "text-outline" }) => (
  <h2 className="font-grotesk font-semibold tracking-tight text-4xl md:text-5xl max-w-3xl">
    {lines.map((line, i) => (
      <span key={line} className={lines.length > 1 && i === lines.length - 1 ? accent : undefined}>
        {line}
        {i < lines.length - 1 && <br />}
      </span>
    ))}
  </h2>
);

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: product, isLoading, isError } = useProduct(slug);

  if (isLoading)
    return <div className="pt-32 pb-20 text-center text-mutedInk" data-testid="product-loading">Loading…</div>;
  if (isError || !product)
    return (
      <div className="pt-32 pb-20 text-center" data-testid="product-not-found">
        <p className="text-mutedInk">Product not found.</p>
        <Link to="/products" className="mt-4 inline-block text-accentText link-underline">← All products</Link>
      </div>
    );

  const highlights = product.highlights || [];
  const whatItDoes = product.what_it_does || [];
  const howItWorks = product.how_it_works || [];
  const commitments = product.commitments || [];
  const audience = product.audience || [];
  const delivery = product.delivery || [];
  const languages = product.languages || [];
  const techStack = product.tech_stack || [];
  const faqs = product.faqs || [];
  const saas = product.saas || [];
  const headlines = product.headlines || {};
  const comparison = product.comparison || {};
  const comparisonHeaders = comparison.headers || [];
  const comparisonRows = comparison.rows || [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    applicationCategory: "DeveloperApplication",
    description: product.summary,
    author: { "@type": "Organization", name: "AADRIQUE TECH PVT LTD" },
    publisher: { "@type": "Organization", name: "AADRIQUE TECH PVT LTD" },
  };

  return (
    <div data-testid="product-detail-page">
      <Seo title={product.name} description={product.summary} jsonLd={jsonLd} />

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="pt-24 md:pt-28 pb-12 md:pb-14 border-b border-line relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-20 hatch opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Link
            to="/products"
            data-testid="product-back-link"
            className="inline-flex items-center gap-2 label-tech text-mutedInk hover:text-accentText transition-colors duration-300 mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All products
          </Link>
          <p className="label-tech text-accentText mb-6 flex flex-wrap items-center gap-3">
            <span className="inline-block h-4 w-px rotate-[30deg] bg-accent" />
            An AADRIQUE product — {product.category}
            {product.status && (
              <span
                className="px-2 py-0.5 border border-line text-[10px] tracking-[0.15em] text-mutedInk"
                data-testid="product-status-badge"
              >
                {product.status}
              </span>
            )}
          </p>
          <LineReveal
            as="h1"
            className="font-grotesk font-semibold tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl"
            lines={[product.name]}
          />
          <Reveal delay={0.3}>
            <p className="mt-6 font-grotesk font-medium text-2xl md:text-3xl text-inkStrong">{product.tagline}</p>
            <p className="mt-6 max-w-2xl text-mutedInk text-base md:text-lg leading-relaxed">{product.summary}</p>
          </Reveal>

          <Reveal delay={0.45} className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/contact"
              data-testid="product-demo-cta"
              className="group inline-flex items-center gap-3 bg-accent text-[#0A0A0A] px-8 py-4 font-grotesk font-medium tracking-wide hover:bg-inkStrong hover:text-bg transition-colors duration-300"
            >
              Request a demo
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <a
              href="#how-it-works"
              data-testid="product-how-it-works-link"
              className="inline-flex items-center gap-3 border border-lineStrong px-8 py-4 font-grotesk font-medium tracking-wide text-inkStrong hover:border-accent hover:text-accentText transition-colors duration-300"
            >
              See how it works
            </a>
          </Reveal>

          {highlights.length > 0 && (
            <Reveal delay={0.55} className="mt-10 md:mt-12 grid grid-cols-2 md:grid-cols-4 border border-line" data-testid="product-highlights">
              {highlights.map((h, i) => (
                <div
                  key={h.label}
                  className={`p-6 md:p-8 ${i > 0 ? "border-l border-line" : ""} ${i >= 2 ? "max-md:border-t max-md:border-line" : ""} ${i === 2 ? "max-md:border-l-0" : ""}`}
                >
                  <p className="font-grotesk font-semibold text-2xl md:text-3xl text-inkStrong">{h.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.15em] text-mutedInk leading-tight">{h.label}</p>
                </div>
              ))}
            </Reveal>
          )}
        </div>
      </section>

      {/* ── The problem ──────────────────────────────── */}
      <section className="py-12 md:py-16 border-b border-line" data-testid="product-problem-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <Reveal><p className="label-tech text-accentText">The problem</p></Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal>
              <p className="font-grotesk text-2xl md:text-3xl leading-snug text-inkStrong max-w-3xl">{product.problem}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── What it does ─────────────────────────────── */}
      {whatItDoes.length > 0 && (
        <section className="py-12 md:py-16 border-b border-line" data-testid="product-capabilities-section">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <Reveal>
              <p className="label-tech text-accentText mb-6">What it does</p>
              <Headline lines={headlines.capabilities || ["What it does."]} />
            </Reveal>
            <Stagger className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line" stagger={0.06}>
              {whatItDoes.map((item, i) => (
                <StaggerItem key={item.title}>
                  <div className="h-full p-8 bg-bg hover:bg-surface transition-colors duration-500" data-testid={`product-capability-${i}`}>
                    <div className="flex items-start justify-between">
                      <Check className="w-5 h-5 text-accentText" strokeWidth={1.75} />
                      <span className="label-tech text-mutedInk">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="mt-8 font-grotesk font-semibold text-xl leading-snug">{item.title}</h3>
                    <p className="mt-3 text-sm text-mutedInk leading-relaxed">{item.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* ── How it works ─────────────────────────────── */}
      {howItWorks.length > 0 && (
        <section id="how-it-works" className="py-12 md:py-16 border-b border-line bg-surface scroll-mt-20" data-testid="product-process-section">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <Reveal>
              <p className="label-tech text-accentText mb-6">How it works</p>
              <Headline lines={headlines.process || ["How it works."]} />
            </Reveal>
            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
              {howItWorks.map((s, i) => (
                <Reveal key={s.step} delay={i * 0.05} className="p-8 bg-bg">
                  <p className="font-grotesk text-4xl font-medium text-outline-accent">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-8 font-grotesk font-semibold text-xl">{s.step}</h3>
                  <p className="mt-3 text-sm text-mutedInk leading-relaxed">{s.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Comparison ───────────────────────────────── */}
      {comparisonHeaders.length > 0 && comparisonRows.length > 0 && (
        <section className="py-12 md:py-16 border-b border-line" data-testid="product-comparison-section">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <Reveal>
              <p className="label-tech text-accentText mb-6">Why it's different</p>
              <Headline lines={headlines.comparison || [`Where ${product.name} differs.`]} accent="text-accentText" />
            </Reveal>
            <Reveal delay={0.15} className="mt-10 overflow-x-auto border border-line">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line">
                    <th className="p-5 label-tech text-mutedInk font-normal w-1/4" scope="col">
                      <span className="sr-only">Capability</span>
                    </th>
                    {comparisonHeaders.map((h, i) => {
                      const isUs = i === comparisonHeaders.length - 1;
                      return (
                        <th
                          key={h}
                          scope="col"
                          className={`p-5 label-tech font-normal border-l border-line ${isUs ? "text-accentText" : "text-mutedInk"}`}
                        >
                          {h}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, r) => (
                    <tr key={row.capability} className={r < comparisonRows.length - 1 ? "border-b border-line" : ""}>
                      <th scope="row" className="p-5 font-grotesk font-medium text-inkStrong text-sm text-left align-top">
                        {row.capability}
                      </th>
                      {(row.values || []).map((v, i) => {
                        const isUs = i === row.values.length - 1;
                        const isNo = v === "No";
                        return (
                          <td
                            key={i}
                            className={`p-5 text-sm align-top border-l border-line ${isUs ? "text-inkStrong bg-surface" : "text-mutedInk"}`}
                          >
                            <span className="flex items-start gap-2">
                              {isUs ? (
                                <Check className="w-4 h-4 text-accentText shrink-0 mt-0.5" strokeWidth={2} />
                              ) : isNo ? (
                                <Minus className="w-4 h-4 text-mutedInk shrink-0 mt-0.5" />
                              ) : null}
                              {v}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── Commitments ──────────────────────────────── */}
      {commitments.length > 0 && (
        <section className="py-12 md:py-16 border-b border-line" data-testid="product-commitments-section">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="label-tech text-accentText mb-6">Built to be trusted</p>
                <Headline lines={headlines.commitments || ["Built to be trusted."]} accent="text-outline" />
                {product.commitments_intro && (
                  <p className="mt-8 text-mutedInk leading-relaxed max-w-md">{product.commitments_intro}</p>
                )}
              </Reveal>
            </div>
            <Stagger className="lg:col-span-7 grid sm:grid-cols-2 gap-px bg-line border border-line" stagger={0.08}>
              {commitments.map((c, i) => (
                <StaggerItem key={c.title}>
                  <div className="h-full p-8 bg-bg hover:bg-surface transition-colors duration-500" data-testid={`product-commitment-${i}`}>
                    <span className="inline-block h-6 w-px rotate-[30deg] bg-accent mb-6" />
                    <h3 className="font-grotesk font-semibold text-lg leading-snug">{c.title}</h3>
                    <p className="mt-3 text-sm text-mutedInk leading-relaxed">{c.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* ── Who it's for ─────────────────────────────── */}
      {audience.length > 0 && (
        <section className="py-12 md:py-16 border-b border-line" data-testid="product-audience-section">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <Reveal><p className="label-tech text-accentText mb-8">Who it's for</p></Reveal>
            <div className="border-t border-line">
              {audience.map((a, i) => (
                <Reveal key={a.title} delay={i * 0.05}>
                  <div
                    className={`group grid md:grid-cols-12 gap-4 md:gap-8 py-7 md:py-9 hover:bg-surface transition-colors duration-500 ${i < audience.length - 1 ? "border-b border-line" : ""}`}
                    data-testid={`product-audience-${i}`}
                  >
                    <div className="md:col-span-2">
                      <span className="label-tech text-mutedInk">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="md:col-span-4">
                      <h3 className="font-grotesk font-semibold text-xl md:text-2xl group-hover:text-accentText transition-colors duration-300">
                        {a.title}
                      </h3>
                    </div>
                    <div className="md:col-span-6">
                      <p className="text-mutedInk leading-relaxed max-w-lg">{a.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Delivery, languages and stack ────────────── */}
      {(delivery.length > 0 || languages.length > 0 || techStack.length > 0) && (
      <section className="py-12 md:py-16 border-b border-line" data-testid="product-delivery-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-10">
          {delivery.length > 0 && (
            <Reveal>
              <p className="label-tech text-accentText mb-6">How you run it</p>
              <ul className="border-t border-line">
                {delivery.map((d, i) => (
                  <li key={d.title} className="py-5 border-b border-line">
                    <div className="flex items-baseline gap-4">
                      <span className="label-tech text-mutedInk">0{i + 1}</span>
                      <div>
                        <p className="font-grotesk text-inkStrong">{d.title}</p>
                        <p className="mt-2 text-sm text-mutedInk leading-relaxed">{d.desc}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
          <Reveal delay={0.15}>
            {languages.length > 0 && (
              <>
                <p className="label-tech text-accentText mb-6">Language support</p>
                <div className="border-t border-line" data-testid="product-languages">
                  {languages.map((l) => (
                    <div key={l.name} className="py-5 border-b border-line">
                      <div className="flex flex-wrap items-baseline gap-3">
                        <p className="font-grotesk text-inkStrong">{l.name}</p>
                        <span className="px-2 py-0.5 border border-line text-[10px] uppercase tracking-[0.15em] text-mutedInk">
                          {l.tier}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-mutedInk leading-relaxed">{l.detail}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
            {techStack.length > 0 && (
              <div className="mt-10">
                <p className="label-tech text-accentText mb-6">Built with</p>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((t) => (
                    <span
                      key={t}
                      className="px-4 py-2 border border-line text-sm text-mutedInk hover:border-accent hover:text-accentText transition-colors duration-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </section>
      )}

      {/* ── SaaS platform ────────────────────────────── */}
      {saas.length > 0 && (
        <section className="py-12 md:py-16 border-b border-line bg-surface" data-testid="product-saas-section">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <Reveal>
              <p className="label-tech text-accentText mb-6">Platform</p>
              <h2 className="font-grotesk font-semibold tracking-tight text-4xl md:text-5xl max-w-2xl">
                Delivered as software,<br />
                <span className="text-outline">not as a project.</span>
              </h2>
            </Reveal>
            <Stagger className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line" stagger={0.06}>
              {saas.map((c, i) => (
                <StaggerItem key={c.title}>
                  <div className="h-full p-8 bg-bg" data-testid={`product-saas-${i}`}>
                    <span className="inline-block h-6 w-px rotate-[30deg] bg-accent mb-6" />
                    <h3 className="font-grotesk font-semibold text-lg leading-snug">{c.title}</h3>
                    <p className="mt-3 text-sm text-mutedInk leading-relaxed">{c.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────── */}
      {faqs.length > 0 && (
        <section className="py-12 md:py-16" data-testid="product-faq-section">
          <div className="max-w-4xl mx-auto px-6 lg:px-10">
            <Reveal><p className="label-tech text-accentText mb-8">Common questions</p></Reveal>
            <Accordion type="single" collapsible className="border-t border-line">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-b border-line">
                  <AccordionTrigger
                    data-testid={`product-faq-trigger-${i}`}
                    className="font-grotesk text-left text-lg text-inkStrong hover:text-accentText hover:no-underline py-6"
                  >
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-mutedInk leading-relaxed pb-6">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      <CTABand
        title={`See ${product.name} run on your code.`}
        subtitle="Pilots start with one repository you choose, run end to end — the report and the generated test suite reviewed together, with your team in the room."
      />
    </div>
  );
}
