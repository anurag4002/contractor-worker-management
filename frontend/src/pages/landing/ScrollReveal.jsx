import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export const ScrollReveal = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      animate={
        isInView || shouldReduceMotion
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 40 }
      }
      transition={{ duration: 0.6, ease: "easeOut", delay: shouldReduceMotion ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
};
