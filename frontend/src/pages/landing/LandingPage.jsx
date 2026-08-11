import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";
import {
  FiUsers,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiShield,
  FiArrowRight,
  FiCheckCircle,
  FiXCircle,
  FiActivity,
  FiMail,
  FiPhone,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiSun,
  FiMoon,
} from "react-icons/fi";

import { useTheme } from "../../context/ThemeContext";
import {
  ThemeToggle,
} from "../../layouts/header/Header.style";

import {
  PageWrapper,
  Container,
  StickyHeader,
  NavInner,
  LogoGroup,
  LogoIcon,
  LogoText,
  NavMenu,
  NavActions,
  PrimaryButton,
  SecondaryButton,
  HeroSection,
  Badge,
  HeroTitle,
  HeroDescription,
  HeroButtonGroup,
  DashboardMockWrapper,
  MockHeader,
  MockDots,
  MockTitle,
  MockBody,
  MockGrid,
  MockCard,
  MockTableCard,
  MockBadge,
  TrustSection,
  TrustGrid,
  TrustCard,
  SectionHeader,
  FeaturesSection,
  FeaturesGrid,
  FeatureCard,
  FeatureIconBox,
  FeatureCardTitle,
  FeatureCardDesc,
  ModulesSection,
  ModulesGrid,
  ModuleCard,
  WorkflowSection,
  WorkflowGrid,
  WorkflowStepCard,
  ComparisonSection,
  ComparisonGrid,
  ComparisonCard,
  ComparisonList,
  ComparisonItem,
  CTASection,
  CTABox,
  Footer,
  FooterGrid,
  FooterCol,
  SocialRow,
  FooterBottom,
} from "./LandingPage.style";

const features = [
  {
    icon: <FiUsers />,
    title: "Worker Management",
    desc: "Maintain complete worker profiles including Aadhaar, PAN, ESIC, trade skill categories, and salary structures.",
  },
  {
    icon: <FiCalendar />,
    title: "Attendance Management",
    desc: "Log and monitor daily site attendance with Present, Absent, Leave, Half Day, and Holiday classifications.",
  },
  {
    icon: <FiMapPin />,
    title: "Site Management",
    desc: "Track multiple project sites, assign site supervisors, manage capacity limits, and monitor worker allocation.",
  },
  {
    icon: <FiDollarSign />,
    title: "Wage & Payroll",
    desc: "Automate daily wage and monthly salary calculations, overtime allowances, deductions, and payment statuses.",
  },
  {
    icon: <FiFileText />,
    title: "Reports & Analytics",
    desc: "Generate and export comprehensive site reports, worker attendance logs, and payroll summaries in PDF and Excel format.",
  },
  {
    icon: <FiShield />,
    title: "Role Based Access Control",
    desc: "Enterprise-grade JWT authentication protecting sensitive financial calculations and admin management features.",
  },
];

const modules = [
  {
    icon: <FiUsers />,
    title: "Worker Profile",
    tag: "Core Module",
    desc: "Comprehensive database storing identity docs, emergency contacts, bank details, and trade skills.",
  },
  {
    icon: <FiMapPin />,
    title: "Site Management",
    tag: "Operations",
    desc: "Real-time tracking of active sites, client info, capacity utilization, and supervisor assignments.",
  },
  {
    icon: <FiCalendar />,
    title: "Attendance Management",
    tag: "Daily Logs",
    desc: "Streamlined site attendance capture supporting daily wage calculations and holiday tagging.",
  },
  {
    icon: <FiDollarSign />,
    title: "Wage Management",
    tag: "Payroll",
    desc: "Automated salary processing for daily & monthly workers with full financial transparency.",
  },
  {
    icon: <FiActivity />,
    title: "Dashboard",
    tag: "Overview",
    desc: "Centralized analytics hub featuring active site counts, worker totals, and attendance trends.",
  },
  {
    icon: <FiFileText />,
    title: "Reports",
    tag: "Exports",
    desc: "One-click export of structured attendance logs, site summaries, and payroll ledgers.",
  },
];

const workflowSteps = [
  {
    step: "1",
    title: "Add Worker Profile",
    desc: "Register worker details, trade skill level, daily wage rate, and identity documentation.",
  },
  {
    step: "2",
    title: "Assign to Site",
    desc: "Allocate workers to specific construction or project sites under designated supervisors.",
  },
  {
    step: "3",
    title: "Mark Daily Attendance",
    desc: "Log daily attendance status (Present, Absent, Half Day, Leave) with automated shift hours.",
  },
  {
    step: "4",
    title: "Generate Payroll",
    desc: "Calculate accurate net wages automatically and export official payroll reports with 1-click.",
  },
];

const heroContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, y: -12, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const descriptionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const buttonContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const dashboardVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const dashboardHeaderVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const metricCardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const tableVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const statusBadgeVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <PageWrapper>
      {/* TOP ANNOUNCEMENT BAR */}
     

      {/* STICKY NAVBAR */}
      <StickyHeader>
        <Container>
          <NavInner>
            <LogoGroup onClick={() => navigate("/")}>
              <LogoIcon>C</LogoIcon>
              <LogoText>
                <span>Contractor</span>
                <small>Worker Management</small>
              </LogoText>
            </LogoGroup>

            <NavMenu>
              <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection("features"); }}>Features</a>
              <a href="#modules" onClick={(e) => { e.preventDefault(); scrollToSection("modules"); }}>Modules</a>
              <a href="#workflow" onClick={(e) => { e.preventDefault(); scrollToSection("workflow"); }}>Workflow</a>
              <a href="#why-choose-us" onClick={(e) => { e.preventDefault(); scrollToSection("why-choose-us"); }}>Why Choose Us</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection("contact"); }}>Contact</a>
            </NavMenu>

            <NavActions>
              <ThemeToggle onClick={toggleTheme} aria-label="Toggle theme" title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}>
                {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
              </ThemeToggle>
              <PrimaryButton onClick={handleLoginClick}>
                Login <FiArrowRight size={16} />
              </PrimaryButton>
              <SecondaryButton onClick={handleRegisterClick}>
                Register
              </SecondaryButton>
            </NavActions>
          </NavInner>
        </Container>
      </StickyHeader>

      {/* HERO SECTION */}
      <HeroSection>
        <Container>
          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={badgeVariants}>
              <Badge>
                <FiShield size={14} /> Professional Contractor Management Platform
              </Badge>
            </motion.div>

            <HeroTitle>
              <motion.div variants={headingVariants}>
                Manage Workers, Attendance, Sites &
              </motion.div>
              <motion.div variants={headingVariants}>
                Payroll from One Dashboard
              </motion.div>
            </HeroTitle>

            <motion.div variants={descriptionVariants}>
              <HeroDescription>
                A high-performance SaaS platform designed for contractors and site supervisors to streamline workforce registration, daily site attendance, and automated payroll operations.
              </HeroDescription>
            </motion.div>

            <motion.div variants={buttonContainerVariants}>
              <HeroButtonGroup>
                <motion.div variants={buttonVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <PrimaryButton onClick={handleLoginClick} style={{ padding: "12px 24px", fontSize: "0.95rem" }}>
                    Login to Dashboard <FiArrowRight size={18} />
                  </PrimaryButton>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <SecondaryButton onClick={handleRegisterClick} style={{ padding: "12px 24px", fontSize: "0.95rem" }}>
                    Create Account
                  </SecondaryButton>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <SecondaryButton onClick={() => scrollToSection("features")} style={{ padding: "12px 24px", fontSize: "0.95rem" }}>
                    Explore Features
                  </SecondaryButton>
                </motion.div>
              </HeroButtonGroup>
            </motion.div>
          </motion.div>

          <motion.div
            variants={dashboardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.7 }}
          >
            <DashboardMockWrapper>
              <MockHeader>
                <motion.div variants={dashboardHeaderVariants} initial="hidden" animate="visible">
                  <MockDots>
                    <span />
                    <span />
                    <span />
                  </MockDots>
                </motion.div>
                <motion.div variants={dashboardHeaderVariants} initial="hidden" animate="visible" transition={{ delay: 0.05 }}>
                  <MockTitle>CMS Admin Dashboard — System Overview</MockTitle>
                </motion.div>
                <div style={{ width: 40 }} />
              </MockHeader>

              <MockBody>
                <MockGrid>
                  <motion.div variants={metricCardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                    <MockCard>
                      <div className="meta">
                        <span>Total Workers</span>
                        <h4>148</h4>
                      </div>
                      <div className="icon-box" style={{ background: "#eff6ff", color: "#2563eb" }}>
                        <FiUsers />
                      </div>
                    </MockCard>
                  </motion.div>
                  <motion.div variants={metricCardVariants} initial="hidden" animate="visible" transition={{ delay: 0.18 }}>
                    <MockCard>
                      <div className="meta">
                        <span>Present Today</span>
                        <h4>126</h4>
                      </div>
                      <div className="icon-box" style={{ background: "#dcfce7", color: "#16a34a" }}>
                        <FiCheckCircle />
                      </div>
                    </MockCard>
                  </motion.div>
                  <motion.div variants={metricCardVariants} initial="hidden" animate="visible" transition={{ delay: 0.26 }}>
                    <MockCard>
                      <div className="meta">
                        <span>Active Sites</span>
                        <h4>12</h4>
                      </div>
                      <div className="icon-box" style={{ background: "#fef3c7", color: "#d97706" }}>
                        <FiMapPin />
                      </div>
                    </MockCard>
                  </motion.div>
                  <motion.div variants={metricCardVariants} initial="hidden" animate="visible" transition={{ delay: 0.34 }}>
                    <MockCard>
                      <div className="meta">
                        <span>Pending Salary</span>
                        <h4>₹1,84,500</h4>
                      </div>
                      <div className="icon-box" style={{ background: "#f3e8ff", color: "#7c3aed" }}>
                        <FiDollarSign />
                      </div>
                    </MockCard>
                  </motion.div>
                </MockGrid>

                <motion.div variants={tableVariants} initial="hidden" animate="visible" transition={{ delay: 0.55 }}>
                  <MockTableCard>
                    <h5>Recent Site Activity & Attendance</h5>
                    <table>
                      <thead>
                        <tr>
                          <th>Site Name</th>
                          <th>Supervisor</th>
                          <th>Assigned Workers</th>
                          <th>Present Today</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <motion.tr variants={tableRowVariants} initial="hidden" animate="visible" transition={{ delay: 0.65 }}>
                          <td><strong>Metro Station Line 3</strong></td>
                          <td>Rajesh Kumar</td>
                          <td>45 Workers</td>
                          <td>42 Present</td>
                          <td><motion.span variants={statusBadgeVariants} initial="hidden" animate="visible" transition={{ delay: 0.75 }}><MockBadge type="active">Active</MockBadge></motion.span></td>
                        </motion.tr>
                        <motion.tr variants={tableRowVariants} initial="hidden" animate="visible" transition={{ delay: 0.75 }}>
                          <td><strong>Commercial Tower B</strong></td>
                          <td>Amit Sharma</td>
                          <td>32 Workers</td>
                          <td>29 Present</td>
                          <td><motion.span variants={statusBadgeVariants} initial="hidden" animate="visible" transition={{ delay: 0.85 }}><MockBadge type="active">Active</MockBadge></motion.span></td>
                        </motion.tr>
                        <motion.tr variants={tableRowVariants} initial="hidden" animate="visible" transition={{ delay: 0.85 }}>
                          <td><strong>Residential Complex Alpha</strong></td>
                          <td>Suresh Verma</td>
                          <td>28 Workers</td>
                          <td>25 Present</td>
                          <td><motion.span variants={statusBadgeVariants} initial="hidden" animate="visible" transition={{ delay: 0.95 }}><MockBadge type="present">In Progress</MockBadge></motion.span></td>
                        </motion.tr>
                      </tbody>
                    </table>
                  </MockTableCard>
                </motion.div>
              </MockBody>
            </DashboardMockWrapper>
          </motion.div>
        </Container>
      </HeroSection>

      {/* TRUST / STATS SECTION */}
      <ScrollReveal delay={0}>
        <TrustSection>
          <Container>
            <TrustGrid>
              <TrustCard>
                <h3>5000+</h3>
                <p>Workers Managed</p>
              </TrustCard>
              <TrustCard>
                <h3>99.9%</h3>
                <p>Attendance Accuracy</p>
              </TrustCard>
              <TrustCard>
                <h3>120+</h3>
                <p>Active Project Sites</p>
              </TrustCard>
              <TrustCard>
                <h3>₹2.5Cr+</h3>
                <p>Payroll Processed</p>
              </TrustCard>
            </TrustGrid>
          </Container>
        </TrustSection>
      </ScrollReveal>

      {/* FEATURES SECTION */}
      <ScrollReveal delay={0.1}>
        <FeaturesSection id="features">
          <Container>
            <SectionHeader>
              <h2>Comprehensive SaaS Features</h2>
              <p>Everything you need to eliminate paperwork, avoid wage disputes, and run site operations smoothly.</p>
            </SectionHeader>

            <FeaturesGrid>
              {features.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, ease: "easeOut", delay: idx * 0.08 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                >
                  <FeatureCard>
                    <FeatureIconBox>{item.icon}</FeatureIconBox>
                    <FeatureCardTitle>{item.title}</FeatureCardTitle>
                    <FeatureCardDesc>{item.desc}</FeatureCardDesc>
                  </FeatureCard>
                </motion.div>
              ))}
            </FeaturesGrid>
          </Container>
        </FeaturesSection>
      </ScrollReveal>

      {/* MODULES SECTION */}
      <ScrollReveal delay={0.1}>
        <ModulesSection id="modules">
          <Container>
            <SectionHeader>
              <h2>Core System Modules</h2>
              <p>Built specifically around contractor workflow requirements and site management standards.</p>
            </SectionHeader>

            <ModulesGrid>
              {modules.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, ease: "easeOut", delay: idx * 0.08 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                >
                  <ModuleCard>
                    <div className="top">
                      <div className="module-icon">{item.icon}</div>
                      <span className="tag">{item.tag}</span>
                    </div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </ModuleCard>
                </motion.div>
              ))}
            </ModulesGrid>
          </Container>
        </ModulesSection>
      </ScrollReveal>

      {/* WORKFLOW SECTION */}
      <ScrollReveal delay={0.1}>
        <WorkflowSection id="workflow">
          <Container>
            <SectionHeader>
              <h2>Simple 4-Step Site Workflow</h2>
              <p>Designed for rapid adoption by site managers with zero learning curve.</p>
            </SectionHeader>

            <WorkflowGrid>
              {workflowSteps.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, ease: "easeOut", delay: idx * 0.12 }}
                >
                  <WorkflowStepCard>
                    <div className="step-num">{item.step}</div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </WorkflowStepCard>
                </motion.div>
              ))}
            </WorkflowGrid>
          </Container>
        </WorkflowSection>
      </ScrollReveal>

      {/* WHY CHOOSE US / COMPARISON SECTION */}
      <ScrollReveal delay={0.1}>
        <ComparisonSection id="why-choose-us">
          <Container>
            <SectionHeader>
              <h2>Why Choose Contractor Worker Management?</h2>
              <p>See how digital automation transforms traditional site operations into an efficient enterprise workflow.</p>
            </SectionHeader>

            <ComparisonGrid>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <ComparisonCard type="traditional">
                  <h3>
                    <FiXCircle color="#dc2626" /> Traditional Manual Method
                  </h3>
                  <ComparisonList>
                    <ComparisonItem type="traditional">
                      <FiXCircle className="icon" />
                      <span>Manual paper registers prone to loss, damage, and unauthorized tampering.</span>
                    </ComparisonItem>
                    <ComparisonItem type="traditional">
                      <FiXCircle className="icon" />
                      <span>Frequent wage calculation errors and disputes regarding daily rates & overtime.</span>
                    </ComparisonItem>
                    <ComparisonItem type="traditional">
                      <FiXCircle className="icon" />
                      <span>Days wasted every month manually compiling site attendance into Excel sheets.</span>
                    </ComparisonItem>
                    <ComparisonItem type="traditional">
                      <FiXCircle className="icon" />
                      <span>No central visibility into active worker capacity or multi-site deployment.</span>
                    </ComparisonItem>
                  </ComparisonList>
                </ComparisonCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <ComparisonCard type="modern">
                  <h3>
                    <FiCheckCircle color="#16a34a" /> Contractor Worker Management System
                  </h3>
                  <ComparisonList>
                    <ComparisonItem type="modern">
                      <FiCheckCircle className="icon" />
                      <span>Cloud-backed digital registration with full identity & bank documentation.</span>
                    </ComparisonItem>
                    <ComparisonItem type="modern">
                      <FiCheckCircle className="icon" />
                      <span>100% automated wage and payroll calculations with clear breakdown reports.</span>
                    </ComparisonItem>
                    <ComparisonItem type="modern">
                      <FiCheckCircle className="icon" />
                      <span>Instant 1-click PDF & Excel report exports for administrative audits.</span>
                    </ComparisonItem>
                    <ComparisonItem type="modern">
                      <FiCheckCircle className="icon" />
                      <span>Real-time multi-site monitoring dashboard accessible anywhere.</span>
                    </ComparisonItem>
                  </ComparisonList>
                </ComparisonCard>
              </motion.div>
            </ComparisonGrid>
          </Container>
        </ComparisonSection>
      </ScrollReveal>

      {/* CALL TO ACTION */}
      <ScrollReveal delay={0.1}>
        <CTASection>
          <Container>
            <CTABox>
              <h2>Ready to Digitize Your Workforce?</h2>
              <p>Access your contractor admin portal to manage site workers, log daily attendance, and process payroll with complete accuracy.</p>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <PrimaryButton onClick={handleLoginClick} style={{ padding: "12px 28px", fontSize: "0.95rem", backgroundColor: "#2563eb" }}>
                  Login to Dashboard <FiArrowRight size={18} />
                </PrimaryButton>
              </motion.div>
            </CTABox>
          </Container>
        </CTASection>
      </ScrollReveal>

      {/* FOOTER */}
      <ScrollReveal delay={0}>
        <Footer id="contact">
          <Container>
            <FooterGrid>
              <FooterCol>
                <LogoGroup onClick={() => navigate("/")}>
                  <LogoIcon style={{ background: "#2563eb" }}>C</LogoIcon>
                  <LogoText>
                    <span style={{ color: "#ffffff" }}>Contractor</span>
                    <small style={{ color: "#9ca3af" }}>Worker Management System</small>
                  </LogoText>
                </LogoGroup>
                <p>
                  Enterprise SaaS platform designed for contractors, construction firms, and site supervisors to streamline workforce management, attendance, and payroll.
                </p>
                <SocialRow>
                  <a href="#github" aria-label="Github"><FiGithub /></a>
                  <a href="#linkedin" aria-label="LinkedIn"><FiLinkedin /></a>
                  <a href="#twitter" aria-label="Twitter"><FiTwitter /></a>
                </SocialRow>
              </FooterCol>

              <FooterCol>
                <h5>Quick Links</h5>
                <ul>
                  <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection("features"); }}>Features</a></li>
                  <li><a href="#modules" onClick={(e) => { e.preventDefault(); scrollToSection("modules"); }}>Modules</a></li>
                  <li><a href="#workflow" onClick={(e) => { e.preventDefault(); scrollToSection("workflow"); }}>Workflow</a></li>
                  <li><a href="#why-choose-us" onClick={(e) => { e.preventDefault(); scrollToSection("why-choose-us"); }}>Why Choose Us</a></li>
                </ul>
              </FooterCol>

              <FooterCol>
                <h5>Core Modules</h5>
                <ul>
                  <li><a href="/login">Worker Profiles</a></li>
                  <li><a href="/login">Site Management</a></li>
                  <li><a href="/login">Attendance Logging</a></li>
                  <li><a href="/login">Payroll & Wages</a></li>
                </ul>
              </FooterCol>

              <FooterCol>
                <h5>Contact & Access</h5>
                <ul>
                  <li style={{ color: "#cbd5e1", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: 8 }}>
                    <FiMail /> support@contractor-cms.com
                  </li>
                  <li style={{ color: "#cbd5e1", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                    <FiPhone /> +91 (800) 123-4567
                  </li>
                  <li style={{ marginTop: 16 }}>
                    <PrimaryButton onClick={handleLoginClick} style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                      Login Portal
                    </PrimaryButton>
                  </li>
                </ul>
              </FooterCol>
            </FooterGrid>

            <FooterBottom>
              <div>© {new Date().getFullYear()} Contractor Worker Management System. All rights reserved.</div>
              <div>Built for High Performance Site Operations</div>
            </FooterBottom>
          </Container>
        </Footer>
      </ScrollReveal>
    </PageWrapper>
  );
};

export default LandingPage;
