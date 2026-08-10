import { useState, useEffect } from "react";

const useCountUp = (end, duration = 800, shouldStart = true, formatter = null) => {
  const [display, setDisplay] = useState(() => {
    if (formatter) return formatter(0);
    return 0;
  });

  useEffect(() => {
    if (!shouldStart) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisplay(formatter ? formatter(end) : end);
      return;
    }

    let startTime = null;
    let animationFrame = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * end;

      if (progress < 1) {
        setDisplay(formatter ? formatter(current) : Math.floor(current));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplay(formatter ? formatter(end) : end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, shouldStart, formatter]);

  return display;
};

export default useCountUp;
