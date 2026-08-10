import { motion } from "framer-motion";
import { EASE } from "@/lib/site";

export const LineReveal = ({ lines, className = "", lineClassName = "", delay = 0, as: Tag = "h1", inView = false }) => {
  const anim = inView
    ? { whileInView: { y: 0 }, viewport: { once: true, margin: "-60px" } }
    : { animate: { y: 0 } };
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className={`block ${lineClassName}`}
            initial={{ y: "115%" }}
            {...anim}
            transition={{ duration: 0.95, delay: delay + i * 0.13, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

export const Reveal = ({ children, delay = 0, y = 32, className = "", once = true }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once, margin: "-70px" }}
    transition={{ duration: 0.85, delay, ease: EASE }}
  >
    {children}
  </motion.div>
);

export const Stagger = ({ children, className = "", stagger = 0.08 }) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-60px" }}
    variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = "", y = 28 }) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y },
      show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
    }}
  >
    {children}
  </motion.div>
);
