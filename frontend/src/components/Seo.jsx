import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ORG_JSONLD, SITE } from "@/lib/site";

const DEFAULT_TITLE = "AADRIQUE — Build. Transform. Scale.";
const DEFAULT_DESC =
  "AADRIQUE TECH PVT LTD — Technology Transformation Company. We understand your business first, then build practical AI and technology solutions that create measurable value.";

const SITE_URL = (process.env.REACT_APP_SITE_URL || SITE.url).replace(/\/+$/, "");

const upsertMeta = (selector, attrs) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  return el;
};

const setNamedMeta = (name, content) => {
  upsertMeta(`meta[name="${name}"]`, { name }).setAttribute("content", content);
};

const setPropMeta = (property, content) => {
  upsertMeta(`meta[property="${property}"]`, { property }).setAttribute("content", content);
};

const setLink = (rel, href) => {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

export const Seo = ({ title, description, jsonLd, image, noindex = false }) => {
  const { pathname } = useLocation();
  const json = JSON.stringify(jsonLd || ORG_JSONLD);

  useEffect(() => {
    const fullTitle = title ? `${title} — AADRIQUE` : DEFAULT_TITLE;
    const desc = description || DEFAULT_DESC;
    const url = `${SITE_URL}${pathname}`;
    // OG/Twitter images must be absolute — crawlers don't resolve relative paths.
    const rawImage = image || SITE.monogram;
    const ogImage = rawImage.startsWith("http") ? rawImage : `${SITE_URL}${rawImage}`;

    document.title = fullTitle;
    setNamedMeta("description", desc);
    // Search engines must not index 404s, and crawlers should follow links regardless.
    setNamedMeta("robots", noindex ? "noindex, follow" : "index, follow");
    setLink("canonical", url);

    setPropMeta("og:title", fullTitle);
    setPropMeta("og:description", desc);
    setPropMeta("og:url", url);
    setPropMeta("og:type", "website");
    setPropMeta("og:site_name", SITE.name);
    setPropMeta("og:image", ogImage);

    setNamedMeta("twitter:card", "summary_large_image");
    setNamedMeta("twitter:title", fullTitle);
    setNamedMeta("twitter:description", desc);
    setNamedMeta("twitter:image", ogImage);

    let script = document.getElementById("seo-jsonld");
    if (!script) {
      script = document.createElement("script");
      script.id = "seo-jsonld";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = json;
  }, [title, description, json, pathname, image, noindex]);

  return null;
};

export default Seo;
