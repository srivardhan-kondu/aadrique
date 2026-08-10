import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE, EASE } from "@/lib/site";

export const LoadingScreen = () => {
  const [show, setShow] = useState(() => !sessionStorage.getItem("aadrique-intro"));

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      sessionStorage.setItem("aadrique-intro", "1");
      setShow(false);
    }, 2100);
    return () => clearTimeout(t);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          data-testid="loading-screen"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#060606]"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <motion.img
            src={SITE.monogram}
            alt="AADRIQUE monogram"
            className="w-16 h-16 object-contain"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: EASE }}
          />
          <div className="mt-6 overflow-hidden">
            <motion.p
              className="font-grotesk font-semibold tracking-[0.4em] text-[#F2ECDD] text-sm"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            >
              AADRIQUE
            </motion.p>
          </div>
          <motion.div
            className="mt-8 h-px bg-[#FA942C] w-40 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, delay: 0.4, ease: "easeInOut" }}
          />
          <motion.p
            className="label-tech mt-4 text-[rgba(242,236,221,0.4)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Build. Transform. Scale.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
