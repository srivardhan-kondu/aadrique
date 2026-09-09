import { Seo } from "@/components/Seo";
import { LineReveal, Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { CTABand } from "@/components/CTABand";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/lib/api";

export default function Products() {
  const { data: products = [], isLoading } = useProducts();
  // Platform capabilities are shared across the range, so state them once.
  const platform = products.find((p) => (p.saas || []).length > 0)?.saas || [];

  return (
    <div data-testid="products-page">
      <Seo
        title="Products"
        description="Products built, run and supported by AADRIQUE — including RepoIQ, an AI engineering platform that writes, executes and proves a test suite for any codebase."
      />

      <section className="pt-24 md:pt-28 pb-12 md:pb-14 border-b border-line relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-20 hatch-accent opacity-25 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="label-tech text-accentText mb-6">Products</p>
          <LineReveal
            as="h1"
            className="font-grotesk font-semibold tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl max-w-4xl"
            lines={["Our products."]}
          />
          <Reveal delay={0.4} className="mt-8 max-w-2xl">
            <p className="text-mutedInk text-base md:text-lg leading-relaxed">
              Alongside client delivery, we build and run our own software. The same engineering standard and the
              same accountability — taken to market under our own name, supported and sold as products in their
              own right.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {isLoading ? (
            <p className="text-mutedInk" data-testid="products-loading">Loading products…</p>
          ) : (
            <div className="space-y-px" data-testid="products-grid">
              {products.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.05}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {platform.length > 0 && (
        <section className="py-12 md:py-16 border-t border-line bg-surface" data-testid="products-platform-section">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <Reveal>
              <p className="label-tech text-accentText mb-6">Platform</p>
              <h2 className="font-grotesk font-semibold tracking-tight text-4xl md:text-5xl max-w-3xl">
                Every product,<br />
                <span className="text-outline">delivered the same way.</span>
              </h2>
              <p className="mt-8 max-w-2xl text-mutedInk leading-relaxed">
                Whichever product you start with, the platform underneath it is the same — and so are the
                commitments about where your data lives and what it is used for.
              </p>
            </Reveal>
            <Stagger className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line" stagger={0.06}>
              {platform.map((c, i) => (
                <StaggerItem key={c.title}>
                  <div className="h-full p-8 bg-bg" data-testid={`products-platform-${i}`}>
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

      <CTABand
        title="Want a closer look?"
        subtitle="Tell us which product interests you and the problem you're trying to solve — we'll show it running on something real, not a slide."
      />
    </div>
  );
}
