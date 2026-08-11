import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Seo } from "@/components/Seo";
import { LineReveal, Reveal } from "@/components/motion/Reveal";
import { CTABand } from "@/components/CTABand";
import { usePost, usePosts } from "@/lib/api";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default function ArticleDetail() {
  const { slug } = useParams();
  const { data: post, isLoading, isError } = usePost(slug);
  const { data: posts = [] } = usePosts();

  if (isLoading)
    return <div className="pt-32 pb-20 text-center text-mutedInk" data-testid="article-loading">Loading…</div>;
  if (isError || !post)
    return (
      <div className="pt-32 pb-20 text-center" data-testid="article-not-found">
        <p className="text-mutedInk">Article not found.</p>
        <Link to="/insights" className="mt-4 inline-block text-accentText link-underline">← All insights</Link>
      </div>
    );

  const related = posts.filter((p) => p.slug !== slug).slice(0, 2);
  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: "AADRIQUE TECH PVT LTD" },
  };

  return (
    <div data-testid="article-detail-page">
      <Seo title={post.title} description={post.excerpt} jsonLd={jsonLd} />

      <section className="pt-24 md:pt-28 pb-12 md:pb-14 border-b border-line relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-20 hatch opacity-40 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <Link to="/insights" data-testid="article-back-link" className="inline-flex items-center gap-2 label-tech text-mutedInk hover:text-accentText transition-colors duration-300 mb-8">
            <ArrowLeft className="w-3.5 h-3.5" /> Insights
          </Link>
          <p className="label-tech text-accentText mb-6">{post.category}</p>
          <LineReveal
            as="h1"
            className="font-grotesk font-semibold tracking-tight leading-[1.08] text-4xl sm:text-5xl"
            lines={[post.title]}
          />
          <Reveal delay={0.3} className="mt-8 flex flex-wrap items-center gap-6">
            <p className="text-sm text-mutedInk">{post.author} · {fmtDate(post.date)} · {post.reading_time} min read</p>
            <button
              onClick={share}
              data-testid="article-share-btn"
              className="inline-flex items-center gap-2 border border-line px-4 py-2 text-xs uppercase tracking-[0.15em] text-mutedInk hover:border-accent hover:text-accentText transition-colors duration-300"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          </Reveal>
        </div>
      </section>

      <article className="py-12 md:py-16" data-testid="article-body">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <p className="font-grotesk text-xl md:text-2xl leading-relaxed text-inkStrong mb-10">{post.excerpt}</p>
          {post.content.map((block, i) => (
            <Reveal key={i} className="mb-8">
              <h2 className="font-grotesk font-semibold text-2xl mb-4 flex items-baseline gap-4">
                <span className="label-tech text-accentText">0{i + 1}</span>
                {block.h}
              </h2>
              <p className="text-ink leading-relaxed text-base md:text-lg">{block.p}</p>
            </Reveal>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section className="pb-14 border-t border-line pt-10" data-testid="article-related-section">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <p className="label-tech text-accentText mb-8">Related reading</p>
            <div className="grid md:grid-cols-2 gap-px bg-line border border-line">
              {related.map((p) => (
                <Link key={p.slug} to={`/insights/${p.slug}`} data-testid={`article-related-${p.slug}`} className="group p-8 bg-bg hover:bg-surface transition-colors duration-500">
                  <p className="label-tech text-accentText">{p.category}</p>
                  <h3 className="mt-4 font-grotesk font-semibold text-xl leading-snug group-hover:text-accentText transition-colors duration-300">{p.title}</h3>
                  <p className="mt-3 text-sm text-mutedInk">{p.reading_time} min read</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABand />
    </div>
  );
}
