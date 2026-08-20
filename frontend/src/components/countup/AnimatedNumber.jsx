import { useRef, useState, useEffect } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const formatValue = (value, format) => {
  if (format === "currency") {
    return `₹${new Intl.NumberFormat("en-IN").format(Math.round(value))}`;
  }
  return String(Math.round(value));
};

export const AnimatedNumber = ({
  value,
  format = "number",
  duration = 1400,
  delay = 0,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  const shouldReduceMotion = useReducedMotion();
  const animationRef = useRef(null);
  const hasAnimated = useRef(false);

  const [display, setDisplay] = useState(() => formatValue(0, format));

  useEffect(() => {
    if (shouldReduceMotion || !isInView) return;

    const startAnimation = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const startTime = performance.now();
      const target = value;
      const formatter = (val) => formatValue(val, format);

      const animate = (timestamp) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const current = target * easedProgress;

        setDisplay(formatter(current));

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setDisplay(formatter(target));
          animationRef.current = null;
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    const timer = setTimeout(startAnimation, delay);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [shouldReduceMotion, isInView, value, duration, delay, format]);

  if (shouldReduceMotion) {
    return (
      <span
        ref={ref}
        style={{ fontVariantNumeric: "tabular-nums", display: "inline-block" }}
      >
        {formatValue(value, format)}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      style={{ fontVariantNumeric: "tabular-nums", display: "inline-block" }}
    >
      {display}
    </span>
  );
};
