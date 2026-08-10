import { useState, useEffect, useMemo, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

import {
  BrandGroup,
  LogoIcon,
  LogoText,
  StepsSection,
  StepsConnector,
  DashboardPreview,
  DashboardPreviewTitle,
  DashboardStats,
  DashboardStat,
  DashboardStatLabel,
  DashboardStatValue,
} from "./Register.style";

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

const stepContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.05 },
  },
};

const stepNumberVariants = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "backOut(1.5)" },
  },
};

const stepContentVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
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

const HEADING_LINES = ["Build Your Workforce", "Management Workspace"];

const FEATURES = [
  "Manage workers and workforce records",
  "Track attendance across multiple sites",
  "Assign workers to sites",
  "Manage payroll and payments",
];

const ONBOARDING_STEPS = [
  {
    number: "01",
    title: "Create your administrator account",
    desc: "Fill in your account details below.",
  },
  {
    number: "02",
    title: "Add your organization details",
    desc: "Configure your workspace settings.",
  },
  {
    number: "03",
    title: "Start managing your workforce",
    desc: "Access your dashboard and begin.",
  },
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
   ANIMATED HEADING
   ============================================================ */

const AnimatedHeading = ({ animate, loop }) => {
  const charLines = useMemo(() => HEADING_LINES.map(splitIntoChars), []);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !loop) return;

    let mounted = true;

    const startLoop = async () => {
      await new Promise((r) => setTimeout(r, 100));
      if (!mounted) return;

      while (mounted) {
        await animate.start("hidden");
        await new Promise((r) => setTimeout(r, 300));
        if (!mounted) return;
        await animate.start("visible");
        await new Promise((r) => setTimeout(r, 3200));
        if (!mounted) return;
      }
    };

    startLoop();

    return () => {
      mounted = false;
    };
  }, [loop, animate, reducedMotion]);

  if (reducedMotion) {
    return (
      <div style={{ display: "block" }}>
        {charLines.map((chars, lineIdx) => (
          <div
            key={lineIdx}
            style={{
              display: "block",
              whiteSpace: "pre",
              font: "inherit",
              fontWeight: 800,
              fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
              lineHeight: 1.18,
              color: "var(--text)",
            }}
          >
            {chars.map(({ id, char }) => (
              <span key={id}>{char}</span>
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
      animate={animate}
      style={{ display: "block" }}
    >
      {charLines.map((chars, lineIdx) => (
        <div
          key={lineIdx}
          style={{
            display: "block",
            whiteSpace: "pre",
            font: "inherit",
            fontWeight: 800,
            fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
            lineHeight: 1.18,
            color: "var(--text)",
          }}
        >
          {chars.map(({ id, char }) => (
            <motion.span
              key={id}
              variants={headingCharVariants}
              style={{ display: "inline" }}
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
        Create your administrator account and start managing workers,
        attendance, sites, and payroll from one centralized platform.
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
      Create your administrator account and start managing workers,
      attendance, sites, and payroll from one centralized platform.
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
   TRAVELING LIGHT
   ============================================================ */

const TravelingLight = ({ step, containerRef }) => {
  const reducedMotion = useReducedMotion();
  const [position, setPosition] = useState({ top: 0 });

  useEffect(() => {
    if (!containerRef.current || reducedMotion) return;

    const measure = () => {
      const stepEls = containerRef.current.querySelectorAll("[data-step]");
      if (stepEls[step]) {
        const rect = stepEls[step].getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        setPosition({
          top: rect.top - containerRect.top + rect.height * 0.15,
        });
      }
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [step, reducedMotion, containerRef]);

  if (reducedMotion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={
        step === 0
          ? { opacity: 0, scale: 0.5 }
          : { opacity: 1, scale: 1, top: position.top }
      }
      transition={{ duration: 0.7, ease: "easeInOut" }}
      style={{
        position: "absolute",
        left: "0.85rem",
        width: "0.5rem",
        height: "0.5rem",
        borderRadius: "50%",
        background: "#60a5fa",
        boxShadow: "0 0 8px #3b82f6, 0 0 18px rgba(59,130,246,0.45)",
        zIndex: 3,
        pointerEvents: "none",
      }}
    />
  );
};

/* ============================================================
   ANIMATED STEP
   ============================================================ */

const AnimatedStep = ({ stepData, index, animate }) => {
  if (animate === "hidden") {
    return (
      <div
        data-step={index}
        style={{
          position: "relative",
          paddingLeft: "2.6rem",
          paddingBottom: "1.15rem",
          opacity: 0,
          transform: "translateX(-10px)",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: "0.3rem",
            top: "0.1rem",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "2rem",
            height: "2rem",
            borderRadius: "0.6rem",
            background: "var(--primary-light)",
            color: "var(--primary)",
            fontSize: "0.85rem",
            fontWeight: 700,
            zIndex: 2,
          }}
        >
          {stepData.number}
        </span>
        <div>
          <span
            style={{
              display: "block",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "var(--text)",
            }}
          >
            {stepData.title}
          </span>
          <span
            style={{
              marginTop: "0.15rem",
              display: "block",
              fontSize: "0.82rem",
              color: "var(--text-secondary)",
            }}
          >
            {stepData.desc}
          </span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={stepContainerVariants}
      initial="hidden"
      animate={animate}
      data-step={index}
      style={{ position: "relative", paddingLeft: "2.6rem", paddingBottom: "1.15rem" }}
    >
      <motion.span variants={stepNumberVariants}>
        <span
          style={{
            position: "absolute",
            left: "0.3rem",
            top: "0.1rem",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "2rem",
            height: "2rem",
            borderRadius: "0.6rem",
            background: "var(--primary-light)",
            color: "var(--primary)",
            fontSize: "0.85rem",
            fontWeight: 700,
            zIndex: 2,
          }}
        >
          {stepData.number}
        </span>
      </motion.span>
      <div>
        <motion.span variants={stepContentVariants}>
          <span
            style={{
              display: "block",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "var(--text)",
            }}
          >
            {stepData.title}
          </span>
        </motion.span>
        <motion.span variants={stepContentVariants}>
          <span
            style={{
              marginTop: "0.15rem",
              display: "block",
              fontSize: "0.82rem",
              color: "var(--text-secondary)",
            }}
          >
            {stepData.desc}
          </span>
        </motion.span>
      </div>
    </motion.div>
  );
};

/* ============================================================
   ANIMATED STEPS
   ============================================================ */

const AnimatedSteps = ({ visibleCount }) => {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef(null);

  if (reducedMotion) {
    return (
      <StepsSection ref={containerRef} aria-label="Registration overview">
        <StepsConnector />
        {ONBOARDING_STEPS.map((step, i) => (
          <AnimatedStep key={i} stepData={step} index={i} animate="visible" />
        ))}
      </StepsSection>
    );
  }

  return (
    <StepsSection ref={containerRef} aria-label="Registration overview">
      <StepsConnector />
      <TravelingLight step={visibleCount} containerRef={containerRef} />
      {ONBOARDING_STEPS.map((step, i) => (
        <AnimatedStep
          key={i}
          stepData={step}
          index={i}
          animate={i < visibleCount ? "visible" : "hidden"}
        />
      ))}
    </StepsSection>
  );
};

/* ============================================================
   ANIMATED STAT
   ============================================================ */

const AnimatedStat = ({ label, value, duration, delay, popDelay, labelDelay, isCurrency }) => {
  const display = useCountUp(
    value,
    duration,
    delay,
    isCurrency
      ? (v) => `₹${Number(v).toLocaleString("en-IN")}`
      : (v) => String(v)
  );

  return (
    <DashboardStat>
      <DashboardStatLabel $labelDelay={labelDelay}>{label}</DashboardStatLabel>
      <DashboardStatValue $popDelay={popDelay}>{display}</DashboardStatValue>
    </DashboardStat>
  );
};

/* ============================================================
   MAIN EXPORT
   ============================================================ */

const RegisterIntro = ({ onIntroComplete }) => {
  const headingControls = useAnimation();
  const [phase, setPhase] = useState(0);
  const [visibleFeatures, setVisibleFeatures] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [loopHeading, setLoopHeading] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      const frame = requestAnimationFrame(() => {
        setPhase(10);
        setVisibleFeatures(4);
        setVisibleSteps(3);
        setLoopHeading(true);
        onIntroComplete();
      });
      return () => cancelAnimationFrame(frame);
    }

    let mounted = true;

    const runSequence = async () => {
      try {
        // Phase 0: Heading
        setPhase(0);
        await headingControls.start("visible");
        if (!mounted) return;

        // Short transition after heading
        await new Promise((r) => setTimeout(r, 180));
        if (!mounted) return;

        // Phase 1: Description
        setPhase(1);
        await new Promise((r) => setTimeout(r, 500));
        if (!mounted) return;

        // Phase 2-5: Features one by one
        for (let i = 0; i < FEATURES.length; i++) {
          setPhase(2 + i);
          setVisibleFeatures(i + 1);
          await new Promise((r) => setTimeout(r, 120));
          if (!mounted) return;
        }

        // Phase 6-8: Steps one by one
        for (let i = 0; i < ONBOARDING_STEPS.length; i++) {
          setPhase(6 + i);
          setVisibleSteps(i + 1);
          await new Promise((r) => setTimeout(r, 180));
          if (!mounted) return;
        }

        // Complete
        setPhase(9);
        setLoopHeading(true);
        onIntroComplete();
      } catch (error) {
        console.error("Registration intro animation failed:", error);
        setPhase(9);
        setVisibleFeatures(4);
        setVisibleSteps(3);
        setLoopHeading(true);
        onIntroComplete();
      }
    };

    runSequence();

    return () => {
      mounted = false;
    };
  }, [reducedMotion, headingControls, onIntroComplete]);

  const showDescription = phase >= 1;
  const dashboardVisible = phase === 9;

  return (
    <>
      <BrandGroup>
        <LogoIcon aria-label="Contractor Worker Management">C</LogoIcon>
        <LogoText>
          <h2>Contractor</h2>
          <p>Worker Management</p>
        </LogoText>
      </BrandGroup>

      <div style={{ marginBottom: "0.8rem" }}>
        <AnimatedHeading animate={headingControls} loop={loopHeading} />
      </div>

      <AnimatedDescription animate={showDescription ? "visible" : "hidden"} />

      <AnimatedFeatureList visibleCount={visibleFeatures} />

      <AnimatedSteps visibleCount={visibleSteps} />

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
                label="TOTAL WORKERS"
                value={155}
                duration={1400}
                delay={200}
                popDelay={700}
                labelDelay={150}
              />
              <AnimatedStat
                label="ACTIVE SITES"
                value={23}
                duration={1000}
                delay={450}
                popDelay={900}
                labelDelay={400}
              />
              <AnimatedStat
                label="PRESENT TODAY"
                value={140}
                duration={1400}
                delay={700}
                popDelay={1200}
                labelDelay={650}
              />
              <AnimatedStat
                label="PENDING SALARY"
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

export default RegisterIntro;
