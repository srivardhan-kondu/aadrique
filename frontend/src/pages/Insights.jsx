import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Seo } from "@/components/Seo";
import { LineReveal, Reveal } from "@/components/motion/Reveal";
import { CTABand } from "@/components/CTABand";
import { usePosts } from "@/lib/api";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function Insights() {
  const { data: posts = [], isLoading } = usePosts();
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => ["All", ...new Set(posts.map((p) => p.category))], [posts]);
  const filtered = posts.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      (query === "" || `${p.title} ${p.excerpt}`.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div data-testid="insights-page">
      <Seo title="Insights" description="Business-first thinking on AI strategy, digital transformation, data and engineering from AADRIQUE." />

      <section className="pt-24 md:pt-28 pb-12 md:pb-14 border-b border-line relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-20 hatch opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="label-tech text-accentText mb-6">Insights</p>
          <LineReveal
            as="h1"
            className="font-grotesk font-semibold tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl max-w-4xl"
            lines={["Thinking that", "earns its keep."]}
          />
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="flex flex-wrap items-center justify-between gap-6 mb-10">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  data-testid={`insights-filter-${c.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className={`px-5 py-2.5 border font-grotesk text-sm tracking-wide transition-colors duration-300 ${
                    category === c
                      ? "bg-accent text-[#0A0A0A] border-accent"
                      : "border-line text-mutedInk hover:border-lineStrong hover:text-inkStrong"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mutedInk" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles…"
                data-testid="insights-search-input"
                className="bg-transparent border border-line pl-11 pr-4 py-2.5 text-sm text-inkStrong placeholder:text-mutedInk focus:border-accent focus:outline-none w-64 transition-colors duration-300"
              />
            </div>
          </Reveal>

          {isLoading ? (
            <p className="text-mutedInk" data-testid="insights-loading">Loading articles…</p>
          ) : filtered.length === 0 ? (
            <p className="text-mutedInk py-10" data-testid="insights-empty">No articles match your search.</p>
          ) : (
            <div className="border-t border-line" data-testid="insights-list">
              {filtered.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.04}>
                  <Link
                    to={`/insights/${p.slug}`}
                    data-testid={`insight-row-${p.slug}`}
                    className="group grid md:grid-cols-12 gap-4 md:gap-8 py-8 border-b border-line hover:bg-surface transition-colors duration-500"
                  >
                    <div className="md:col-span-3">
                      <p className="label-tech text-accentText">{p.category}</p>
                      <p className="mt-2 text-xs text-mutedInk">{fmtDate(p.date)} · {p.reading_time} min read</p>
                    </div>
                    <div className="md:col-span-6">
                      <h2 className="font-grotesk font-semibold text-2xl leading-snug group-hover:text-accentText transition-colors duration-300">
                        {p.title}
                      </h2>
                      <p className="mt-3 text-sm text-mutedInk leading-relaxed">{p.excerpt}</p>
                    </div>
                    <div className="md:col-span-3 flex md:justify-end items-start">
                      <span className="label-tech text-mutedInk group-hover:text-accentText transition-colors duration-300">Read →</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABand title="Prefer a conversation to an article?" />
    </div>
  );
}
