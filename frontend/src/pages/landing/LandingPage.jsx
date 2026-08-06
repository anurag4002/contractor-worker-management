import React from "react";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/fi";

import {
  PageWrapper,
  Container,
  AnnouncementBar,
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

import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *{
    margin:0;
    padding:0;
    box-sizing:border-box;
  }

  html{
    scroll-behavior:smooth;
  }

  body{
    font-family:'Inter',system-ui,-apple-system,sans-serif;
    background:#f8fafc;
    color:#111827;
  }

  a{
    text-decoration:none;
  }
`;
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

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
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
              <PrimaryButton onClick={handleLoginClick}>
                Login <FiArrowRight size={16} />
              </PrimaryButton>
            </NavActions>
          </NavInner>
        </Container>
      </StickyHeader>

      {/* HERO SECTION */}
      <HeroSection>
        <Container>
          <Badge>
            <FiShield size={14} /> Professional Contractor Management Platform
          </Badge>

          <HeroTitle>
            Manage Workers, Attendance, Sites & Payroll from One Dashboard
          </HeroTitle>

          <HeroDescription>
            A high-performance SaaS platform designed for contractors and site supervisors to streamline workforce registration, daily site attendance, and automated payroll operations.
          </HeroDescription>

          <HeroButtonGroup>
            <PrimaryButton onClick={handleLoginClick} style={{ padding: "12px 24px", fontSize: "0.95rem" }}>
              Login to Dashboard <FiArrowRight size={18} />
            </PrimaryButton>

            <SecondaryButton onClick={() => scrollToSection("features")} style={{ padding: "12px 24px", fontSize: "0.95rem" }}>
              Explore Features
            </SecondaryButton>
          </HeroButtonGroup>

          {/* REALISTIC DASHBOARD PREVIEW */}
          <DashboardMockWrapper>
            <MockHeader>
              <MockDots>
                <span />
                <span />
                <span />
              </MockDots>
              <MockTitle>CMS Admin Dashboard — System Overview</MockTitle>
              <div style={{ width: 40 }} />
            </MockHeader>

            <MockBody>
              <MockGrid>
                <MockCard>
                  <div className="meta">
                    <span>Total Workers</span>
                    <h4>148</h4>
                  </div>
                  <div className="icon-box" style={{ background: "#eff6ff", color: "#2563eb" }}>
                    <FiUsers />
                  </div>
                </MockCard>

                <MockCard>
                  <div className="meta">
                    <span>Present Today</span>
                    <h4>126</h4>
                  </div>
                  <div className="icon-box" style={{ background: "#dcfce7", color: "#16a34a" }}>
                    <FiCheckCircle />
                  </div>
                </MockCard>

                <MockCard>
                  <div className="meta">
                    <span>Active Sites</span>
                    <h4>12</h4>
                  </div>
                  <div className="icon-box" style={{ background: "#fef3c7", color: "#d97706" }}>
                    <FiMapPin />
                  </div>
                </MockCard>

                <MockCard>
                  <div className="meta">
                    <span>Pending Salary</span>
                    <h4>₹1,84,500</h4>
                  </div>
                  <div className="icon-box" style={{ background: "#f3e8ff", color: "#7c3aed" }}>
                    <FiDollarSign />
                  </div>
                </MockCard>
              </MockGrid>

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
                    <tr>
                      <td><strong>Metro Station Line 3</strong></td>
                      <td>Rajesh Kumar</td>
                      <td>45 Workers</td>
                      <td>42 Present</td>
                      <td><MockBadge type="active">Active</MockBadge></td>
                    </tr>
                    <tr>
                      <td><strong>Commercial Tower B</strong></td>
                      <td>Amit Sharma</td>
                      <td>32 Workers</td>
                      <td>29 Present</td>
                      <td><MockBadge type="active">Active</MockBadge></td>
                    </tr>
                    <tr>
                      <td><strong>Residential Complex Alpha</strong></td>
                      <td>Suresh Verma</td>
                      <td>28 Workers</td>
                      <td>25 Present</td>
                      <td><MockBadge type="present">In Progress</MockBadge></td>
                    </tr>
                  </tbody>
                </table>
              </MockTableCard>
            </MockBody>
          </DashboardMockWrapper>
        </Container>
      </HeroSection>

      {/* TRUST / STATS SECTION */}
      <TrustSection>
        <Container>
          <TrustGrid>
            <TrustCard>
              <h3>5,000+</h3>
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

      {/* FEATURES SECTION */}
      <FeaturesSection id="features">
        <Container>
          <SectionHeader>
            <h2>Comprehensive SaaS Features</h2>
            <p>Everything you need to eliminate paperwork, avoid wage disputes, and run site operations smoothly.</p>
          </SectionHeader>

          <FeaturesGrid>
            {features.map((item, idx) => (
              <FeatureCard key={idx}>
                <FeatureIconBox>{item.icon}</FeatureIconBox>
                <FeatureCardTitle>{item.title}</FeatureCardTitle>
                <FeatureCardDesc>{item.desc}</FeatureCardDesc>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </Container>
      </FeaturesSection>

      {/* MODULES SECTION */}
      <ModulesSection id="modules">
        <Container>
          <SectionHeader>
            <h2>Core System Modules</h2>
            <p>Built specifically around contractor workflow requirements and site management standards.</p>
          </SectionHeader>

          <ModulesGrid>
            {modules.map((item, idx) => (
              <ModuleCard key={idx}>
                <div className="top">
                  <div className="module-icon">{item.icon}</div>
                  <span className="tag">{item.tag}</span>
                </div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </ModuleCard>
            ))}
          </ModulesGrid>
        </Container>
      </ModulesSection>

      {/* WORKFLOW SECTION */}
      <WorkflowSection id="workflow">
        <Container>
          <SectionHeader>
            <h2>Simple 4-Step Site Workflow</h2>
            <p>Designed for rapid adoption by site managers with zero learning curve.</p>
          </SectionHeader>

          <WorkflowGrid>
            {workflowSteps.map((item, idx) => (
              <WorkflowStepCard key={idx}>
                <div className="step-num">{item.step}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </WorkflowStepCard>
            ))}
          </WorkflowGrid>
        </Container>
      </WorkflowSection>

      {/* WHY CHOOSE US / COMPARISON SECTION */}
      <ComparisonSection id="why-choose-us">
        <Container>
          <SectionHeader>
            <h2>Why Choose Contractor Worker Management?</h2>
            <p>See how digital automation transforms traditional site operations into an efficient enterprise workflow.</p>
          </SectionHeader>

          <ComparisonGrid>
            {/* TRADITIONAL METHOD */}
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

            {/* OUR SYSTEM */}
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
          </ComparisonGrid>
        </Container>
      </ComparisonSection>

      {/* CALL TO ACTION */}
      <CTASection>
        <Container>
          <CTABox>
            <h2>Ready to Digitize Your Workforce?</h2>
            <p>Access your contractor admin portal to manage site workers, log daily attendance, and process payroll with complete accuracy.</p>
            <PrimaryButton onClick={handleLoginClick} style={{ padding: "12px 28px", fontSize: "0.95rem", backgroundColor: "#2563eb" }}>
              Login to Dashboard <FiArrowRight size={18} />
            </PrimaryButton>
          </CTABox>
        </Container>
      </CTASection>

      {/* FOOTER */}
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
    </PageWrapper>
  );
};

export default LandingPage;
