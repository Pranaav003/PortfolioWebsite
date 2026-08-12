/* ============================================================================
 * content.js — Single source of truth for every variant.
 * Reconciled with the live main (927eddc): IBM RAS Intern role, updated
 * experience copy, real project links (incl. the IEEE paper DOI), résumé
 * (Pranaav_Iyer_CV.pdf), custom domain pranaaviyer.com, corrected Purdue GPA
 * (3.5), and coursework. Nothing invented — everything mirrors the live site.
 * Exposed as window.PORTFOLIO so vanilla variant pages can consume it.
 * ==========================================================================*/
(function (root) {
  "use strict";

  const PORTFOLIO = {
    identity: {
      name: "Pranaav Iyer",
      firstName: "Pranaav",
      lastName: "Iyer",
      role: "Engineer",
      tagline: ["ML Engineer", "Full Stack Developer", "CS @ NYU"],
      blurb:
        "M.S. Computer Science at NYU. I build intelligent systems that bridge raw data and real-world impact — real-time ASL translation, trading engines, and AI agents.",
      coords: { lat: "37.5°N", lon: "122.0°W", place: "Fremont, CA" },
      status: "RAS Intern @ IBM · open to full-time '27",
      site: "https://pranaaviyer.com/",
    },

    // Verbatim from the live "About" section.
    about: {
      lead: [
        { t: "I build " },
        { t: "intelligent systems", accent: true },
        { t: " that bridge the gap between " },
        { t: "raw data", accent: true },
        { t: " and " },
        { t: "real-world impact", accent: true },
        { t: " — from real-time ASL translation to automated trading engines." },
      ],
      details: [
        { label: "Location", value: "Fremont, CA" },
        { label: "Education", value: "M.S. Computer Science, NYU · 4.0 GPA" },
        { label: "Languages", value: "Python · React.js · SQL · C/C++ · Java" },
        { label: "Status", value: "RAS Intern @ IBM · open to full-time '27", highlight: true },
      ],
    },

    // Honest metrics — each already stated in the live project/experience copy.
    metrics: [
      { value: 150, prefix: "<", suffix: "ms", label: "ASL inference latency", note: "real-time on commodity hardware" },
      { value: 15, prefix: "+", suffix: "%", label: "OCR model accuracy", note: "targeted data profiling @ Avyay" },
      { value: 40, prefix: "+", suffix: "%", label: "perf test coverage", note: "automated benchmarking tools" },
      { value: 2, prefix: "", suffix: "", label: "research papers", note: "submitted to IEEE & JMAI" },
      { value: 4.0, prefix: "", suffix: "", label: "GPA @ NYU", note: "M.S. Computer Science", decimals: 1 },
      { value: 6, prefix: "", suffix: "+", label: "projects shipped", note: "CV · trading · AI agents" },
    ],

    skills: [
      { n: "01", name: "Programming", detail: "Python · React.js · SQL · C/C++ · Java · JS · CSS · HTML", level: 92 },
      { n: "02", name: "AI / Machine Learning", detail: "TensorFlow · PyTorch · NLP · OCR · Automation", level: 88 },
      { n: "03", name: "Development Tools", detail: "Docker · Flask · Jupyter Notebook · OpenCV", level: 85 },
      { n: "04", name: "Computer Vision", detail: "OpenCV · MediaPipe · Pose Estimation · Real-time Inference", level: 90 },
      { n: "05", name: "Research & Writing", detail: "IEEE Publications · Technical Documentation · EDA", level: 82 },
      { n: "06", name: "Leadership", detail: "Team Direction · Mentorship · Project Management", level: 78 },
    ],

    // Three roles, matching the live site (newest first).
    experience: [
      {
        year: "May 2026 — Present",
        company: "IBM",
        role: "RAS Intern",
        desc:
          "Building and shipping production software at IBM as a RAS Intern, working alongside their engineering teams.",
        tags: ["IBM", "RAS", "Internship"],
      },
      {
        year: "May 2022 — Aug 2022",
        company: "Avyay Solutions",
        role: "Machine Learning Intern",
        desc:
          "Improved OCR model accuracy by ~15% through targeted data profiling, outlier reduction, and redesigned preprocessing pipelines. Partnered with Google engineers on Image AI (OCR) solutions that cut customer issue-resolution time by 20%, and authored an onboarding whitepaper that sped up how new hires ramped on the OCR stack.",
        tags: ["OCR", "Python", "Pandas", "NumPy", "Google OCR"],
      },
      {
        year: "May 2019 — Aug 2020",
        company: "Krypt, Inc.",
        role: "Documentation Intern",
        desc:
          "Produced and streamlined 20+ pages of AI/ML technical documentation, improving onboarding speed and documentation accuracy by 25%. Interviewed senior engineers to capture workflows into standardized references adopted by engineering and QA, and contributed to a harmonized classification plan projected to strengthen compliance efforts by 20%.",
        tags: ["Technical Writing", "AI/ML", "Compliance", "Documentation"],
      },
    ],

    // Content kept as-is per the brief. `image` maps to files in /public.
    // `links` are the real repo/paper links from the live site.
    projects: [
      {
        num: "001",
        title: "ASL Video Translator",
        desc:
          "Real-time ASL-to-English system using OpenCV, MediaPipe, TensorFlow, and ChatGPT achieving sub-150ms inference latency. Authored two research papers submitted to IEEE and JMAI.",
        detail:
          "A real-time American Sign Language to English pipeline. MediaPipe extracts hand and pose landmarks, a TensorFlow model classifies gestures, and a ChatGPT pass smooths the recognized tokens into natural English — all under 150ms of end-to-end latency so the conversation stays live. The work produced two research papers submitted to IEEE and JMAI.",
        tech: ["OpenCV", "MediaPipe", "TensorFlow", "ChatGPT"],
        image: "/public/Asl.jpg",
        links: [
          { label: "GitHub", href: "https://github.com/Pranaav003/ASLWebSite" },
          { label: "IEEE Paper", href: "https://doi.org/10.1109/ICDICI66477.2025.11135376" },
        ],
        tag: "Computer Vision · Research",
      },
      {
        num: "002",
        title: "Thinkorswim Trading Bot",
        desc:
          "Versatile trading bot harnessing AI, chart signals, and diverse indicators, enriched by a trader's market expertise. Built around ThinkorSwim APIs with rule-based execution frameworks.",
        detail:
          "An automated trading engine built on the ThinkorSwim APIs. It fuses AI-derived chart signals with a library of technical indicators and a rule-based execution framework, encoding a trader's market intuition into deterministic, backtestable logic.",
        tech: ["Python", "ThinkorSwim API", "AI", "Indicators"],
        image: "/public/TradingBotImg.png",
        links: [{ label: "GitHub", href: "https://github.com/Pranaav003/Thinkorswim-Trading-Bot" }],
        tag: "Automation · Finance",
      },
      {
        num: "003",
        title: "HearSay",
        desc:
          "App that translates ASL gestures into spoken audio in real-time for phone calls — bridging communication gaps with computer vision and NLP.",
        detail:
          "HearSay takes the ASL translation pipeline to the phone. It converts signed gestures into spoken audio during live phone calls, letting Deaf and hard-of-hearing users be heard on any voice line — computer vision on the front end, NLP and text-to-speech on the back.",
        tech: ["ASL", "Computer Vision", "Real-time", "NLP"],
        image: "/public/Voicely.jpg",
        links: [{ label: "GitHub", href: "https://github.com/Pranaav003/HearSay" }],
        tag: "Accessibility · Real-time",
      },
      {
        num: "004",
        title: "Debrief",
        desc:
          "Meeting debrief agent that gathers context from Zoom meetings and turns ideas into action. Automates the gap between conversation and execution.",
        detail:
          "Debrief is an AI agent that sits on your Zoom meetings, captures the context and decisions, and turns loose ideas into structured, assignable action — closing the gap between what a team says it will do and what actually gets done.",
        tech: ["AI Agent", "Zoom API", "NLP", "Automation"],
        image: null,
        links: [{ label: "GitHub", href: "https://github.com/Pranaav003/Debrief" }],
        tag: "AI Agent · Productivity",
      },
      {
        num: "005",
        title: "Signal",
        desc:
          "Lead monitoring tool for business owners looking for their niche. Tracks signals and surfaces opportunities automatically.",
        detail:
          "Signal watches the web for the moments that matter to a business owner hunting their niche — new leads, competitor moves, market openings — and surfaces the opportunities automatically through a lightweight data pipeline so the owner acts first.",
        tech: ["Python", "Monitoring", "Data Pipeline"],
        image: null,
        links: [{ label: "GitHub", href: "https://github.com/Pranaav003/Signal" }],
        tag: "Data Pipeline · Monitoring",
      },
      {
        num: "006",
        title: "Centra",
        desc:
          "Productivity app designed for the modern addiction — helping users reclaim focus and build healthier digital habits through intelligent tracking.",
        detail:
          "Centra is a productivity app aimed at the modern attention economy. It uses intelligent, behaviour-aware tracking to help users notice their patterns, reclaim focus, and build healthier digital habits — nudges over nags.",
        tech: ["Productivity", "Behavioral ML", "React"],
        image: null,
        links: [{ label: "GitHub", href: "https://github.com/Pranaav003/Centra" }],
        tag: "Behavioral ML · React",
      },
    ],

    education: [
      {
        badge: "Expected May 2027",
        school: "New York University",
        degree: "M.S. Computer Science — GPA 4.0/4.0",
        focus: "Courant Institute · Fundamental Algorithms · Artificial Intelligence · Machine Learning · Programming Languages · Operating Systems",
      },
      {
        badge: "Jul 2021 — May 2025",
        school: "Purdue University Fort Wayne",
        degree: "B.S. Computer Science — GPA 3.5/4.0",
        focus: "Minor: Mathematics & Business · Data Structures · Software Engineering · Computer Architecture · Computer Security · Computer Networks · Discrete Math · Calculus I–II",
      },
    ],

    marquee: [
      "Machine Learning", "Full Stack", "Computer Vision", "NLP",
      "React.js", "PyTorch", "TensorFlow",
    ],

    // Six links, matching the live Connect section (order: Email, Résumé, LinkedIn, GitHub, Website, Phone).
    contact: [
      { label: "Email", href: "mailto:pranaav.iyer@gmail.com", value: "pranaav.iyer@gmail.com", cmd: "email" },
      { label: "Résumé", href: "/Pranaav_Iyer_CV.pdf", value: "PDF", cmd: "cv" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/pranaav-iyer/", value: "in/pranaav-iyer", external: true, cmd: "linkedin" },
      { label: "GitHub", href: "https://github.com/Pranaav003", value: "@Pranaav003", external: true, cmd: "github" },
      { label: "Website", href: "https://pranaaviyer.com/", value: "pranaaviyer.com", external: true, cmd: "website" },
      { label: "Phone", href: "tel:+14088632110", value: "+1 408 863 2110", cmd: "phone" },
    ],

    resume: "/Pranaav_Iyer_CV.pdf",

    sections: [
      { id: "about", label: "About", n: "01" },
      { id: "skills", label: "Skills", n: "02" },
      { id: "work", label: "Work", n: "03" },
      { id: "projects", label: "Projects", n: "04" },
      { id: "education", label: "Education", n: "05" },
      { id: "contact", label: "Contact", n: "06" },
    ],
  };

  root.PORTFOLIO = PORTFOLIO;
  if (typeof module !== "undefined" && module.exports) module.exports = PORTFOLIO;
})(typeof window !== "undefined" ? window : globalThis);
