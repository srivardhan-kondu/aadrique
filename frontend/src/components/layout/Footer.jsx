import { Link } from "react-router-dom";
import { SITE, NAV_LINKS } from "@/lib/site";

const COLS = [
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Work", to: "/work" },
      { label: "Insights", to: "/insights" },
      { label: "FAQ", to: "/faq" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "RepoIQ", to: "/products/repoiq" },
      { label: "All products", to: "/products" },
    ],
  },
  {
    title: "Capabilities",
    links: [
      { label: "AI Consulting", to: "/capabilities/ai-consulting" },
      { label: "AI Transformation", to: "/capabilities/ai-transformation" },
      { label: "Digital Transformation", to: "/capabilities/digital-transformation" },
      { label: "Custom Software", to: "/capabilities/custom-software-development" },
      { label: "All capabilities", to: "/capabilities" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Terms of Service", to: "/terms" },
    ],
  },
];

export const Footer = () => (
  <footer data-testid="site-footer" className="bg-[#060606] text-[#F2ECDD] border-t border-[rgba(246,240,222,0.14)]">
    <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-8">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <p className="font-grotesk font-semibold tracking-[0.35em] text-xl text-white">AADRIQUE</p>
          <p className="label-tech mt-3 text-[#FA942C]">Build. Transform. Scale.</p>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-[rgba(242,236,221,0.55)]">
            A Technology Transformation Company. We understand the business first, identify opportunities, and
            recommend practical technology and AI solutions that create measurable value.
          </p>
          <div className="mt-8 space-y-2 text-sm">
            <a href={`mailto:${SITE.email}`} data-testid="footer-email-link" className="block hover:text-[#FA942C] transition-colors duration-300">
              {SITE.email}
            </a>
            <a href={`tel:${SITE.phoneHref}`} data-testid="footer-phone-link" className="block hover:text-[#FA942C] transition-colors duration-300">
              {SITE.phone}
            </a>
            <p className="text-[rgba(242,236,221,0.45)]">India · Serving clients globally</p>
          </div>
        </div>

        <div className="lg:col-span-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {COLS.map((col) => (
            <div key={col.title}>
              <p className="label-tech text-[rgba(242,236,221,0.45)] mb-5">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      data-testid={`footer-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-sm text-[rgba(242,236,221,0.7)] hover:text-white transition-colors duration-300"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 overflow-hidden select-none" aria-hidden="true">
        <p
          className="font-grotesk font-bold tracking-[0.12em] text-center whitespace-nowrap leading-none text-[clamp(3rem,11vw,10rem)]"
          style={{ WebkitTextStroke: "1px rgba(246,240,222,0.16)", color: "transparent" }}
        >
          AADRIQUE
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-[rgba(246,240,222,0.12)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="text-xs text-[rgba(242,236,221,0.45)]">
          © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          {NAV_LINKS.slice(0, 4).map((l) => (
            <Link key={l.to} to={l.to} className="text-xs text-[rgba(242,236,221,0.45)] hover:text-[#FA942C] transition-colors duration-300">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);
