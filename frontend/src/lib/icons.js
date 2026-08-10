import {
  Compass, Sparkles, Layers, Code2, Globe, Smartphone, PenTool, Cloud, BarChart3, Workflow, Cpu, ArrowUpRight,
} from "lucide-react";

const MAP = {
  "ai-consulting": Compass,
  "ai-transformation": Sparkles,
  "digital-transformation": Layers,
  "custom-software-development": Code2,
  "web-applications": Globe,
  "mobile-applications": Smartphone,
  "ui-ux-design": PenTool,
  "cloud-solutions": Cloud,
  "data-analytics": BarChart3,
  automation: Workflow,
  "technology-consulting": Cpu,
};

export const serviceIcon = (slug) => MAP[slug] || ArrowUpRight;
