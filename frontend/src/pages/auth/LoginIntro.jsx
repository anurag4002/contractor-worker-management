import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

import {
  BrandGroup,
  LogoIcon,
  LogoText,
  DashboardPreview,
  DashboardPreviewTitle,
  DashboardStats,
  DashboardStat,
  DashboardStatLabel,
  DashboardStatValue,
} from "./Login.style";

import useCountUp from "../../hooks/useCountUp";

/* ============================================================
   ANIMATION VARIANTS
   ============================================================ */

const reducedMotionQuery = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

const headingCharVariants = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const headingContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.045, delayChildren: 0.1 },
  },
};

const descriptionVariants = {
  hidden: { opacity: 0, y: -15, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const featureItemVariants = {
  hidden: { opacity: 0, x: -14 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const checkIconVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: "backOut(1.4)" },
  },
};

const dashboardPreviewVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/* ============================================================
   HELPERS
   ============================================================ */

const splitIntoChars = (text) =>
  text.split("").map((char, i) => ({
    id: i,
    char: char === " " ? "\u00A0" : char,
  }));

const HEADING_LINES = ["Manage Your", "Workforce With Confidence"];

const FEATURES = [
  "Manage workers and workforce records",
  "Track daily attendance across all sites",
  "Manage site assignments and worker allocation",
  "Simplify payroll and payment tracking",
];

const useReducedMotion = () => {
  const [reduced, setReduced] = useState(() => reducedMotionQuery.matches);

  useEffect(() => {
    const handler = (e) => setReduced(e.matches);
    reducedMotionQuery.addEventListener("change", handler);
    return () => reducedMotionQuery.removeEventListener("change", handler);
  }, []);

  return reduced;
};

/* ============================================================
   ANIMATED LOGO
   ============================================================ */

const AnimatedLogo = ({ animate }) => {
  if (animate === "hidden") {
    return (
      <BrandGroup
        style={{
          opacity: 0,
          transform: "translateY(-8px) scale(0.97)",
        }}
      >
        <LogoIcon aria-label="Contractor Worker Management">C</LogoIcon>
        <LogoText>
          <h2>Contractor</h2>
          <p>Worker Management</p>
        </LogoText>
      </BrandGroup>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={animate}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <BrandGroup>
        <LogoIcon aria-label="Contractor Worker Management">C</LogoIcon>
        <LogoText>
          <h2>Contractor</h2>
          <p>Worker Management</p>
        </LogoText>
      </BrandGroup>
    </motion.div>
  );
};

/* ============================================================
   ANIMATED HEADING
   ============================================================ */

const AnimatedHeading = () => {
  const controls = useAnimation();
  const charLines = useMemo(() => HEADING_LINES.map(splitIntoChars), []);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    let mounted = true;

    const runLoop = async () => {
      while (mounted) {
        await controls.start("visible");
        if (!mounted) return;

        await new Promise((r) => setTimeout(r, 1000));
        if (!mounted) return;

        await controls.start("hidden");
        if (!mounted) return;

        await new Promise((r) => setTimeout(r, 250));
        if (!mounted) return;
      }
    };

    runLoop();

    return () => {
      mounted = false;
      controls.stop();
    };
  }, [controls, reducedMotion]);

  if (reducedMotion) {
    return (
      <div style={{ display: "block", maxWidth: "100%" }}>
        {charLines.map((chars, lineIdx) => (
          <div
            key={lineIdx}
            style={{
              display: "block",
              whiteSpace: "normal",
              overflowWrap: "break-word",
              wordBreak: "normal",
              font: "inherit",
              fontWeight: 800,
              fontSize: "clamp(1.5rem, 5.5vw, 2.8rem)",
              lineHeight: 1.18,
              color: "var(--text)",
              maxWidth: "100%",
            }}
          >
            {chars.map(({ id, char }) => (
              <span key={id} style={{ display: "inline-block", whiteSpace: "pre" }}>{char}</span>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={headingContainerVariants}
      initial="hidden"
      animate={controls}
      style={{ display: "block", maxWidth: "100%" }}
    >
      {charLines.map((chars, lineIdx) => (
        <div
          key={lineIdx}
          style={{
            display: "block",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "normal",
            font: "inherit",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 5.5vw, 2.8rem)",
            lineHeight: 1.18,
            color: "var(--text)",
            maxWidth: "100%",
          }}
        >
          {chars.map(({ id, char }) => (
            <motion.span
              key={id}
              variants={headingCharVariants}
              style={{ display: "inline-block", whiteSpace: "pre" }}
            >
              {char}
            </motion.span>
          ))}
        </div>
      ))}
    </motion.div>
  );
};

/* ============================================================
   ANIMATED DESCRIPTION
   ============================================================ */

const AnimatedDescription = ({ animate }) => {
  if (animate === "hidden") {
    return (
      <p
        style={{
          margin: "0 0 1.85rem",
          maxWidth: "36rem",
          fontSize: "1rem",
          lineHeight: 1.65,
          color: "var(--text-secondary)",
          opacity: 0,
          transform: "translateY(-15px)",
          filter: "blur(3px)",
        }}
      >
        Manage workers, attendance, sites, and payroll from one centralized contractor management platform.
      </p>
    );
  }

  return (
    <motion.p
      variants={descriptionVariants}
      initial="hidden"
      animate={animate}
      style={{
        margin: "0 0 1.85rem",
        maxWidth: "36rem",
        fontSize: "1rem",
        lineHeight: 1.65,
        color: "var(--text-secondary)",
      }}
    >
      Manage workers, attendance, sites, and payroll from one centralized contractor management platform.
    </motion.p>
  );
};

/* ============================================================
   ANIMATED FEATURE ITEM
   ============================================================ */

const AnimatedFeatureItem = ({ text, animate }) => {
  if (animate === "hidden") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.7rem",
          fontSize: "0.95rem",
          color: "var(--text-secondary)",
          opacity: 0,
          transform: "translateX(-14px)",
        }}
      >
        <FiCheckCircle
          style={{ color: "var(--success)", fontSize: "1.2rem", flexShrink: 0 }}
        />
        {text}
      </div>
    );
  }

  return (
    <motion.div variants={featureItemVariants} initial="hidden" animate={animate}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.7rem",
          fontSize: "0.95rem",
          color: "var(--text-secondary)",
        }}
      >
        <motion.span variants={checkIconVariants} initial="hidden" animate={animate}>
          <FiCheckCircle
            style={{ color: "var(--success)", fontSize: "1.2rem", flexShrink: 0 }}
          />
        </motion.span>
        {text}
      </div>
    </motion.div>
  );
};

/* ============================================================
   ANIMATED FEATURE LIST
   ============================================================ */

const AnimatedFeatureList = ({ visibleCount }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem",
        marginBottom: "2rem",
      }}
    >
      {FEATURES.map((text, i) => (
        <AnimatedFeatureItem
          key={text}
          text={text}
          animate={i < visibleCount ? "visible" : "hidden"}
        />
      ))}
    </div>
  );
};

/* ============================================================
   ANIMATED STAT
   ============================================================ */

const AnimatedStat = ({ label, value, duration, delay, popDelay, labelDelay, isCurrency }) => {
  const [started, setStarted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (started) return;
    const timer = setTimeout(() => setStarted(true), delay || 0);
    return () => clearTimeout(timer);
  }, [delay, started]);

  const formatter = useCallback(
    isCurrency
      ? (v) => `₹${Number(Math.round(v)).toLocaleString("en-IN")}`
      : (v) => String(Math.round(v)),
    [isCurrency]
  );

  const display = useCountUp(value, duration, started, formatter);

  if (shouldReduceMotion) {
    return (
      <DashboardStat>
        <DashboardStatLabel $labelDelay={labelDelay}>{label}</DashboardStatLabel>
        <DashboardStatValue $popDelay={popDelay}>{display}</DashboardStatValue>
      </DashboardStat>
    );
  }

  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{
        duration: 3,
        delay: (delay || 0) / 1000,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <DashboardStat>
        <DashboardStatLabel $labelDelay={labelDelay}>{label}</DashboardStatLabel>
        <DashboardStatValue $popDelay={popDelay}>{display}</DashboardStatValue>
      </DashboardStat>
    </motion.div>
  );
};

/* ============================================================
   MAIN EXPORT
   ============================================================ */

const LoginIntro = ({ onIntroComplete }) => {
  const [phase, setPhase] = useState(0);
  const [visibleFeatures, setVisibleFeatures] = useState(0);
  const [dashboardVisible, setDashboardVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      const frame = requestAnimationFrame(() => {
        setPhase(10);
        setVisibleFeatures(4);
        setDashboardVisible(true);
        onIntroComplete();
      });
      return () => cancelAnimationFrame(frame);
    }

    let mounted = true;

    const runSequence = async () => {
      try {
        // Phase 0: Logo
        setPhase(0);
        await new Promise((r) => setTimeout(r, 350));
        if (!mounted) return;

        // Phase 1: Heading
        setPhase(1);
        await new Promise((r) => setTimeout(r, 180));
        if (!mounted) return;

        // Phase 2: Description
        setPhase(2);
        await new Promise((r) => setTimeout(r, 500));
        if (!mounted) return;

        // Phase 3-6: Features one by one
        for (let i = 0; i < FEATURES.length; i++) {
          setPhase(3 + i);
          setVisibleFeatures(i + 1);
          await new Promise((r) => setTimeout(r, 120));
          if (!mounted) return;
        }

        // Phase 7: Dashboard
        setPhase(7);
        setDashboardVisible(true);
        onIntroComplete();
      } catch (error) {
        console.error("Login intro animation failed:", error);
        setPhase(10);
        setVisibleFeatures(4);
        setDashboardVisible(true);
        onIntroComplete();
      }
    };

    runSequence();

    return () => {
      mounted = false;
    };
  }, [reducedMotion, onIntroComplete]);

  const showLogo = phase >= 0;
  const showDescription = phase >= 2;

  return (
    <>
      <AnimatedLogo animate={showLogo ? "visible" : "hidden"} />

      <div style={{ marginBottom: "0.8rem" }}>
        <AnimatedHeading />
      </div>

      <AnimatedDescription animate={showDescription ? "visible" : "hidden"} />

      <AnimatedFeatureList visibleCount={visibleFeatures} />

      {dashboardVisible && (
        <motion.div
          variants={dashboardPreviewVariants}
          initial="hidden"
          animate="visible"
        >
          <DashboardPreview aria-label="Platform overview preview">
            <DashboardPreviewTitle>Platform Overview</DashboardPreviewTitle>
            <DashboardStats>
              <AnimatedStat
                label="Total Workers"
                value={155}
                duration={1400}
                delay={200}
                popDelay={700}
                labelDelay={150}
              />
              <AnimatedStat
                label="Present Today"
                value={140}
                duration={1000}
                delay={450}
                popDelay={900}
                labelDelay={400}
              />
              <AnimatedStat
                label="Active Sites"
                value={23}
                duration={1400}
                delay={700}
                popDelay={1200}
                labelDelay={650}
              />
              <AnimatedStat
                label="Pending Payroll"
                value={4328843}
                duration={1800}
                delay={950}
                popDelay={1600}
                labelDelay={900}
                isCurrency
              />
            </DashboardStats>
          </DashboardPreview>
        </motion.div>
      )}
    </>
  );
};

export default LoginIntro;
