import { useEffect } from "react";
import { ORG_JSONLD } from "@/lib/site";

const DEFAULT_DESC =
  "AADRIQUE TECH PVT LTD — Technology Transformation Company. We understand your business first, then build practical AI and technology solutions that create measurable value.";

export const Seo = ({ title, description, jsonLd }) => {
  const json = JSON.stringify(jsonLd || ORG_JSONLD);
  useEffect(() => {
    document.title = title ? `${title} — AADRIQUE` : "AADRIQUE — Build. Transform. Scale.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description || DEFAULT_DESC;
    let script = document.getElementById("seo-jsonld");
    if (!script) {
      script = document.createElement("script");
      script.id = "seo-jsonld";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = json;
  }, [title, description, json]);
  return null;
};
