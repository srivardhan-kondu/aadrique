import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X, ArrowUpRight } from "lucide-react";
import { NAV_LINKS, EASE, SITE } from "@/lib/site";

export const Header = ({ theme, toggleTheme }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <>
      <header
        data-testid="site-header"
        className="fixed top-0 inset-x-0 z-50 border-b border-line backdrop-blur-xl"
        style={{ backgroundColor: "color-mix(in srgb, var(--bg) 72%, transparent)" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 md:h-[72px] flex items-center justify-between">
          <Link to="/" data-testid="header-logo-link" className="flex items-center gap-1.5 group">
            <span className="font-grotesk font-semibold tracking-[0.35em] text-inkStrong text-sm md:text-base">
              AADRIQUE
            </span>
            <img
              src={SITE.monogram}
              alt=""
              aria-hidden="true"
              width="18"
              height="18"
              className="h-4 md:h-[18px] w-auto shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                data-testid={`nav-link-${l.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `link-underline font-grotesk text-[13px] tracking-[0.08em] uppercase transition-colors duration-300 ${
                    isActive ? "text-accentText" : "text-mutedInk hover:text-inkStrong"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              data-testid="theme-toggle-btn"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              className="p-2 border border-line text-mutedInk hover:text-inkStrong hover:border-lineStrong transition-colors duration-300"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <Link
              to="/contact"
              data-testid="header-contact-cta"
              className="hidden md:inline-flex items-center gap-2 bg-accent text-[#0A0A0A] px-5 py-2.5 font-grotesk font-medium text-sm tracking-wide hover:bg-inkStrong hover:text-bg transition-colors duration-300"
            >
              Book a consultation
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setOpen(!open)}
              data-testid="mobile-menu-btn"
              aria-label="Toggle menu"
              className="lg:hidden p-2 border border-line text-inkStrong"
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="mobile-menu-overlay"
            className="fixed inset-0 z-40 pt-24 px-6"
            style={{ backgroundColor: "var(--bg)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-y-0 right-6 w-24 hatch opacity-40 pointer-events-none" />
            <nav className="flex flex-col" aria-label="Mobile">
              {[...NAV_LINKS, { label: "Contact", to: "/contact" }].map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.5, ease: EASE }}
                >
                  <NavLink
                    to={l.to}
                    data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
                    className="flex items-baseline gap-4 py-4 border-b border-line font-grotesk text-3xl font-medium text-inkStrong"
                  >
                    <span className="label-tech text-accentText">0{i + 1}</span>
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
