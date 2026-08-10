import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { LineReveal, Reveal } from "@/components/motion/Reveal";
import { submitContact, useServices } from "@/lib/api";
import { SITE } from "@/lib/site";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  company: z.string().optional(),
  role: z.string().optional(),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  service_interest: z.string().optional(),
  budget_range: z.string().optional(),
  message: z.string().min(10, "Tell us a little more (min. 10 characters)"),
  website: z.string().max(0).optional(),
});

const BUDGETS = ["Under $10k", "$10k – $25k", "$25k – $75k", "$75k+", "Not sure yet"];

const inputCls =
  "w-full bg-transparent border-b border-line py-3 text-inkStrong placeholder:text-mutedInk focus:border-accent focus:outline-none transition-colors duration-300";
const labelCls = "label-tech text-mutedInk block mb-2";

export default function Contact() {
  const { data: services = [] } = useServices();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { website: "" } });

  const onSubmit = async (values) => {
    try {
      await submitContact(values);
      toast.success("Thank you — we'll reply within one business day.");
      reset();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Something went wrong. Please try again or email us directly.");
    }
  };

  return (
    <div data-testid="contact-page">
      <Seo title="Contact" description="Book a consultation with AADRIQUE — tell us about your business and we'll map where technology can move your numbers." />

      <section className="pt-40 pb-16 border-b border-line relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-20 hatch-accent opacity-25 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="label-tech text-accentText mb-8">Contact</p>
          <LineReveal
            as="h1"
            className="font-grotesk font-semibold tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl max-w-4xl"
            lines={["Tell us about", "your business."]}
          />
          <Reveal delay={0.4} className="mt-8 max-w-xl">
            <p className="text-mutedInk text-base md:text-lg leading-relaxed">
              Not a sales call. A working conversation about your operations, your numbers, and where technology can
              honestly help. We reply within one business day.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-16">
          {/* Form */}
          <Reveal className="lg:col-span-7">
            <form onSubmit={handleSubmit(onSubmit)} noValidate data-testid="contact-form" className="space-y-10">
              <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...register("website")} />

              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-10">
                <div>
                  <label htmlFor="name" className={labelCls}>Name *</label>
                  <input id="name" data-testid="contact-name-input" className={inputCls} placeholder="Your full name" {...register("name")} />
                  {errors.name && <p className="mt-2 text-xs text-red-400" data-testid="contact-name-error">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="company" className={labelCls}>Company</label>
                  <input id="company" data-testid="contact-company-input" className={inputCls} placeholder="Company name" {...register("company")} />
                </div>
                <div>
                  <label htmlFor="role" className={labelCls}>Role</label>
                  <input id="role" data-testid="contact-role-input" className={inputCls} placeholder="e.g. CEO, Operations Head" {...register("role")} />
                </div>
                <div>
                  <label htmlFor="email" className={labelCls}>Email *</label>
                  <input id="email" type="email" data-testid="contact-email-input" className={inputCls} placeholder="you@company.com" {...register("email")} />
                  {errors.email && <p className="mt-2 text-xs text-red-400" data-testid="contact-email-error">{errors.email.message}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className={labelCls}>Phone</label>
                  <input id="phone" data-testid="contact-phone-input" className={inputCls} placeholder="+91 …" {...register("phone")} />
                </div>
                <div>
                  <label htmlFor="service_interest" className={labelCls}>Service interest</label>
                  <select id="service_interest" data-testid="contact-service-select" className={`${inputCls} appearance-none cursor-pointer [&>option]:bg-surface [&>option]:text-ink`} {...register("service_interest")}>
                    <option value="">Select a capability…</option>
                    {services.map((s) => (
                      <option key={s.slug} value={s.title}>{s.title}</option>
                    ))}
                    <option value="General enquiry">General enquiry</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Budget range</label>
                  <div className="flex flex-wrap gap-2 pt-1" data-testid="contact-budget-group">
                    {BUDGETS.map((b) => (
                      <label key={b} className="cursor-pointer">
                        <input type="radio" value={b} className="peer sr-only" {...register("budget_range")} />
                        <span className="inline-block px-4 py-2 border border-line text-sm text-mutedInk peer-checked:border-accent peer-checked:text-accentText transition-colors duration-300">
                          {b}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className={labelCls}>Message *</label>
                  <textarea
                    id="message"
                    rows={5}
                    data-testid="contact-message-input"
                    className={`${inputCls} resize-none border border-line p-4`}
                    placeholder="What problem are you trying to solve? What does success look like?"
                    {...register("message")}
                  />
                  {errors.message && <p className="mt-2 text-xs text-red-400" data-testid="contact-message-error">{errors.message.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                data-testid="contact-submit-btn"
                className="group inline-flex items-center gap-3 bg-accent text-[#0A0A0A] px-10 py-4 font-grotesk font-medium tracking-wide hover:bg-inkStrong hover:text-bg transition-colors duration-300 disabled:opacity-60"
              >
                {isSubmitting ? "Sending…" : "Send enquiry"}
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </form>
          </Reveal>

          {/* Direct details */}
          <Reveal delay={0.15} className="lg:col-span-5">
            <div className="border border-line p-8 md:p-10 bg-surface">
              <p className="label-tech text-accentText mb-8">Direct</p>
              <div className="space-y-7">
                <a href={`mailto:${SITE.email}`} data-testid="contact-direct-email" className="flex items-start gap-4 group">
                  <Mail className="w-5 h-5 text-accentText mt-0.5" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-mutedInk">Email</p>
                    <p className="mt-1 font-grotesk text-inkStrong group-hover:text-accentText transition-colors duration-300">{SITE.email}</p>
                  </div>
                </a>
                <a href={`tel:${SITE.phoneHref}`} data-testid="contact-direct-phone" className="flex items-start gap-4 group">
                  <Phone className="w-5 h-5 text-accentText mt-0.5" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-mutedInk">Phone</p>
                    <p className="mt-1 font-grotesk text-inkStrong group-hover:text-accentText transition-colors duration-300">{SITE.phone}</p>
                  </div>
                </a>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-accentText mt-0.5" strokeWidth={1.5} />
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-mutedInk">Office</p>
                    <p className="mt-1 font-grotesk text-inkStrong">India</p>
                    <p className="text-xs text-mutedInk mt-1">[Placeholder] Full office address to be supplied</p>
                  </div>
                </div>
              </div>
              <div className="mt-10 pt-8 border-t border-line">
                <p className="label-tech text-accentText mb-4">Prefer to talk first?</p>
                <p className="text-sm text-mutedInk leading-relaxed">
                  Mention "consultation" in your message and we'll send a scheduling link for a free 30-minute call.
                </p>
              </div>
            </div>
            <div className="mt-6 h-32 hatch border border-line" aria-hidden="true" />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
