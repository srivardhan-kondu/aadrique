import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

/**
 * One product, as a full-width clickable row. Shared by the home page and the
 * products index so a new product added to the CMS appears identically in both
 * without either page being touched.
 */
export const ProductCard = ({ product: p }) => (
  <Link
    to={`/products/${p.slug}`}
    data-testid={`product-card-${p.slug}`}
    className="group grid lg:grid-cols-12 gap-8 border border-line p-8 md:p-10 bg-bg hover:border-accent transition-colors duration-300"
  >
    <div className="lg:col-span-7">
      <p className="label-tech text-accentText flex flex-wrap items-center gap-3">
        {p.category}
        {p.status && (
          <span className="px-2 py-0.5 border border-line text-[10px] tracking-[0.15em] text-mutedInk">
            {p.status}
          </span>
        )}
      </p>
      <h3 className="mt-5 font-grotesk font-semibold tracking-tight text-4xl md:text-5xl leading-[1.05] group-hover:text-accentText transition-colors duration-300">
        {p.name}
      </h3>
      <p className="mt-3 font-grotesk font-medium text-lg md:text-xl text-inkStrong">{p.tagline}</p>
      <p className="mt-4 text-sm text-mutedInk leading-relaxed max-w-xl">{p.summary}</p>
    </div>
    <div className="lg:col-span-5 flex flex-col justify-between gap-8">
      <div className="grid grid-cols-2 gap-px bg-line border border-line">
        {(p.highlights || []).map((h) => (
          <div key={h.label} className="p-5 md:p-6 bg-bg">
            <p className="font-grotesk font-semibold text-lg md:text-xl text-inkStrong">{h.value}</p>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-mutedInk leading-tight">{h.label}</p>
          </div>
        ))}
      </div>
      <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-mutedInk group-hover:text-accentText transition-colors duration-300">
        Explore {p.name}
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </div>
  </Link>
);

export default ProductCard;
