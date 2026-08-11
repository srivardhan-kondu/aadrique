import { Seo } from "@/components/Seo";
import { LineReveal, Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Marquee } from "@/components/Marquee";
import { CTABand } from "@/components/CTABand";

const VALUES = [
  { title: "Clarity", desc: "Plain language, honest trade-offs, written recommendations. If we can't explain it simply, we don't understand it well enough." },
  { title: "Precision", desc: "Scoped engagements, measured outcomes, rehearsed deliveries. Craft is a habit, not a phase." },
  { title: "Transformation", desc: "We're judged by what changes in your business after we leave — not by what we shipped." },
  { title: "Trust", desc: "We'll recommend against our own revenue when that's the right answer. It's why clients come back." },
  { title: "Progress", desc: "Working software every month. A number that moves every quarter. Momentum over ceremony." },
];

const ENGAGEMENT = [
  { step: "Consult", desc: "A free 30-minute conversation about your business and where technology might move your numbers." },
  { step: "Discover", desc: "A short, fixed-price discovery producing an assessment and roadmap with standalone value." },
  { step: "Deliver", desc: "Phased delivery in 2–6 week increments — working software and honest reporting at every step." },
  { step: "Transfer", desc: "Documentation, training and handover. Your independence is part of the deliverable." },
];

const FACTS = [
  { k: "Company", v: "AADRIQUE TECH PVT LTD" },
  { k: "Positioning", v: "Technology Transformation Company" },
  { k: "Founder", v: "Guna Sanjay Sagar" },
  { k: "Co-Founder", v: "Geetha Reddy" },
  { k: "Headquarters", v: "India" },
  { k: "Market", v: "Global, India-first" },
  { k: "Email", v: "info@aadrique.in" },
  { k: "Phone", v: "+91 96528 86208" },
];

const TEAM = [
  {
    name: "Guna Sanjay Sagar",
    initials: "GS",
    role: "Founder",
    bio: "Leads every engagement from first conversation to handover — the person who scopes your work stays accountable for it.",
  },
  {
    name: "Geetha Reddy",
    initials: "GR",
    role: "Co-Founder",
    bio: "Co-founded AADRIQUE and works alongside the founder on how engagements are scoped, staffed and delivered.",
  },
];

// Rendered with the same cell structure as the leadership card so the three
// columns share one baseline instead of drifting with copy length.
const PRINCIPLES = [
  {
    title: "Small by design",
    label: "Team structure",
    desc: "Senior specialists join per engagement — architects, designers, data engineers — matched to the problem, never a bench.",
  },
  {
    title: "No bait-and-switch",
    label: "Delivery model",
    desc: "The people who scope your engagement are the people who deliver it. That's a structural choice, not a slogan.",
  },
];

export default function About() {
  return (
    <div data-testid="about-page">
      <Seo title="About" description="AADRIQUE TECH PVT LTD — a Technology Transformation Company. Our origin, philosophy, values and how we work." />

      <section className="pt-40 pb-24 border-b border-line relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-20 hatch opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="label-tech text-accentText mb-8">About AADRIQUE</p>
          <LineReveal
            as="h1"
            className="font-grotesk font-semibold tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl max-w-4xl"
            lines={["Built on a refusal", "to sell technology", "for its own sake."]}
          />
          <Reveal delay={0.5} className="mt-10 max-w-2xl">
            <p className="text-mutedInk text-base md:text-lg leading-relaxed">
              AADRIQUE was founded on a simple observation: most technology projects fail before the first line of
              code — at the moment someone decided what to build without understanding the business. We exist to fix
              that moment.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 md:py-32 border-b border-line" data-testid="philosophy-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-14">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="label-tech text-accentText">Philosophy</p>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal>
              <h2 className="font-grotesk font-semibold tracking-tight text-3xl md:text-4xl leading-snug">
                "We don't push AI into businesses. We first understand the business, identify opportunities, and
                recommend practical technology and AI solutions that create{" "}
                <span className="text-accentText">measurable business value</span>."
              </h2>
              <p className="mt-10 text-mutedInk leading-relaxed max-w-2xl">
                That sentence governs everything: which engagements we accept, how we scope discovery, what we
                recommend, and how we report progress. It means we sometimes recommend less technology, cheaper
                technology, or no technology at all. It also means that when we do build, it works — because it was
                built for a problem that actually exists.
              </p>
            </Reveal>
            <div className="mt-14 grid sm:grid-cols-2 gap-px bg-line border border-line">
              <Reveal className="p-8 bg-bg">
                <p className="label-tech text-accentText mb-4">Mission</p>
                <p className="text-inkStrong font-grotesk text-lg leading-snug">
                  Help businesses adopt the right technology to solve real business problems — practically,
                  measurably, and on their terms.
                </p>
              </Reveal>
              <Reveal delay={0.1} className="p-8 bg-bg">
                <p className="label-tech text-accentText mb-4">Vision</p>
                <p className="text-inkStrong font-grotesk text-lg leading-snug">
                  A world where technology decisions are business decisions — made with clarity, owned with
                  confidence, and measured without excuses.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Marquee items={["Clarity", "Precision", "Transformation", "Trust", "Progress"]} />

      {/* Values */}
      <section className="py-24 md:py-32 border-b border-line" data-testid="values-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <p className="label-tech text-accentText mb-6">Values</p>
            <h2 className="font-grotesk font-semibold tracking-tight text-4xl md:text-5xl">What we refuse to compromise.</h2>
          </Reveal>
          <div className="mt-16 border-t border-line">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.04}>
                <div className="grid md:grid-cols-12 gap-4 py-8 border-b border-line group hover:bg-surface transition-colors duration-500" data-testid={`value-row-${i}`}>
                  <span className="md:col-span-1 label-tech text-mutedInk pt-2">0{i + 1}</span>
                  <h3 className="md:col-span-4 font-grotesk font-semibold text-2xl md:text-3xl group-hover:text-accentText transition-colors duration-300">{v.title}</h3>
                  <p className="md:col-span-7 text-mutedInk leading-relaxed max-w-xl">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement model */}
      <section className="py-24 md:py-32 border-b border-line bg-surface" data-testid="engagement-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal>
            <p className="label-tech text-accentText mb-6">How we work</p>
            <h2 className="font-grotesk font-semibold tracking-tight text-4xl md:text-5xl max-w-2xl">An engagement model without surprises.</h2>
          </Reveal>
          <Stagger className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line" stagger={0.08}>
            {ENGAGEMENT.map((e, i) => (
              <StaggerItem key={e.step}>
                <div className="h-full p-8 bg-bg" data-testid={`engagement-step-${i}`}>
                  <p className="font-grotesk text-4xl font-medium text-outline-accent">0{i + 1}</p>
                  <h3 className="mt-8 font-grotesk font-semibold text-xl">{e.step}</h3>
                  <p className="mt-3 text-sm text-mutedInk leading-relaxed">{e.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Team + facts */}
      <section className="py-24 md:py-32" data-testid="team-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-14">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="label-tech text-accentText mb-6">Leadership</p>
              <h2 className="font-grotesk font-semibold tracking-tight text-3xl md:text-4xl">The people you'll actually work with.</h2>
            </Reveal>
            <div className="mt-12 grid sm:grid-cols-2 gap-px bg-line border border-line">
              {TEAM.map((t, i) => (
                <Reveal key={t.name} delay={i * 0.08} className="p-6 bg-bg">
                  <div className="h-40 md:h-44 bg-surface2 hatch mb-5 flex items-end p-3">
                    <span className="font-grotesk font-semibold text-4xl text-accentText">{t.initials}</span>
                  </div>
                  <h3 className="font-grotesk font-semibold text-base leading-tight">{t.name}</h3>
                  <p className="mt-1 text-xs text-accentText uppercase tracking-wide">{t.role}</p>
                  <p className="mt-3 text-xs text-mutedInk leading-relaxed">{t.bio}</p>
                </Reveal>
              ))}
              {PRINCIPLES.map((p, i) => (
                <Reveal key={p.title} delay={(TEAM.length + i) * 0.08} className="p-6 bg-bg">
                  <div className="h-40 md:h-44 mb-5 flex items-end">
                    <span className="inline-block h-10 w-px rotate-[30deg] bg-accent" />
                  </div>
                  <h3 className="font-grotesk font-semibold text-base leading-tight">{p.title}</h3>
                  <p className="mt-1 text-xs text-accentText uppercase tracking-wide">{p.label}</p>
                  <p className="mt-3 text-xs text-mutedInk leading-relaxed">{p.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <Reveal>
              <p className="label-tech text-accentText mb-6">Company facts</p>
              <div className="border border-line">
                {FACTS.map((f, i) => (
                  <div key={f.k} className={`flex justify-between gap-6 p-5 ${i > 0 ? "border-t border-line" : ""}`} data-testid={`company-fact-${i}`}>
                    <span className="text-xs uppercase tracking-[0.15em] text-mutedInk pt-0.5">{f.k}</span>
                    <span className="text-sm text-inkStrong text-right font-grotesk">{f.v}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CTABand title="Work with a partner who understands first." />
    </div>
  );
}
