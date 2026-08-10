import { useRef, useState, useEffect, useCallback } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import useCountUp from "../../hooks/useCountUp";

const formatCount = (value, decimals, prefix, suffix) => {
  const num = Number(value);
  const formatted = decimals > 0 ? num.toFixed(decimals) : Math.floor(num).toLocaleString();
  return `${prefix}${formatted}${suffix}`;
};

export const CountUp = ({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1500,
  delay = 0,
  shouldStart = false,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();

  const active = shouldStart && isInView;
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (active && !started) {
      const timer = setTimeout(() => setStarted(true), delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [active, started, delay]);

  const formatter = useCallback(
    (val) => formatCount(val, decimals, prefix, suffix),
    [decimals, prefix, suffix]
  );
  const display = useCountUp(value, duration, started, formatter);

  if (shouldReduceMotion) {
    return (
      <span
        ref={ref}
        style={{ fontVariantNumeric: "tabular-nums", display: "inline-block" }}
      >
        {formatCount(value, decimals, prefix, suffix)}
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
