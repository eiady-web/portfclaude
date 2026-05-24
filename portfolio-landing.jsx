import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Hls from "hls.js";

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// LOADING SCREEN
// ============================================================================
function LoadingScreen({ onComplete }) {
  const [count, setCount] = useState(0);
  const frameRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const rolesRef = useRef(["Design", "Create", "Inspire"]);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / 2700, 1);
      const newCount = Math.floor(progress * 100);
      setCount(newCount);

      if (newCount >= 100) {
        setTimeout(() => onComplete(), 400);
      } else {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [onComplete]);

  useEffect(() => {
    const roleTimer = setInterval(
      () => setRoleIndex((prev) => (prev + 1) % rolesRef.current.length),
      900
    );
    return () => clearInterval(roleTimer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-bg flex items-center justify-center overflow-hidden">
      {/* Top-left label */}
      <motion.div
        className="absolute top-8 left-6 text-xs text-muted uppercase tracking-[0.3em]"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Portfolio
      </motion.div>

      {/* Center rotating words */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={roleIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display italic text-text-primary/80"
          >
            {rolesRef.current[roleIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom-right counter */}
      <motion.div
        className="absolute bottom-12 right-8 text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {String(count).padStart(3, "0")}
      </motion.div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-stroke/50">
        <motion.div
          className="h-full accent-gradient"
          style={{
            scaleX: count / 100,
            boxShadow: "0 0 8px rgba(137, 170, 204, 0.35)",
            transformOrigin: "left",
          }}
          transition={{ duration: 0.05 }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// NAVBAR
// ============================================================================
function Navbar() {
  const [scrollY, setScrollY] = useState(0);
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Home", "Work", "Resume"];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4">
      <div
        className={`inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface px-2 py-2 transition-shadow duration-300 ${
          scrollY > 100 ? "shadow-md shadow-black/10" : ""
        }`}
      >
        {/* Logo */}
        <motion.div
          className="w-9 h-9 rounded-full bg-gradient-to-r from-[#89AACC] to-[#4E85BF] p-[2px] cursor-pointer flex-shrink-0"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-full h-full rounded-full bg-bg flex items-center justify-center">
            <span className="font-display italic text-[13px] text-text-primary">JA</span>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="w-px h-5 bg-stroke mx-2 hidden md:block" />

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <motion.button
              key={link}
              className={`text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-colors ${
                activeNav === link.toLowerCase()
                  ? "text-text-primary bg-stroke/50"
                  : "text-muted hover:text-text-primary hover:bg-stroke/50"
              }`}
              onClick={() => setActiveNav(link.toLowerCase())}
              whileHover={{ scale: 1.05 }}
            >
              {link}
            </motion.button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-stroke mx-2" />

        {/* Say Hi Button */}
        <motion.button
          className="relative text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-text-primary overflow-hidden group"
          whileHover="hover"
        >
          <motion.div
            className="absolute inset-0 -inset-[2px] bg-gradient-to-r from-[#89AACC] to-[#4E85BF] rounded-full opacity-0 group-hover:opacity-100 -z-10"
            variants={{
              hover: { opacity: 1 },
            }}
            transition={{ duration: 0.3 }}
          />
          <div className="relative bg-surface rounded-full px-2 py-1 backdrop-blur-md flex items-center gap-2">
            Say hi <span className="text-[10px]">↗</span>
          </div>
        </motion.button>
      </div>
    </nav>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================
function Hero() {
  const videoRef = useRef(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const roles = ["Creative", "Fullstack", "Founder", "Scholar"];

  useEffect(() => {
    // Setup HLS video
    if (videoRef.current) {
      const videoUrl =
        "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = videoUrl;
      }
    }

    // Role cycling
    const roleTimer = setInterval(
      () => setRoleIndex((prev) => (prev + 1) % roles.length),
      2000
    );
    return () => clearInterval(roleTimer);
  }, []);

  useEffect(() => {
    // GSAP entrance animations
    const tl = gsap.timeline();

    tl.to(
      ".name-reveal",
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
      0.1
    ).to(
      ".blur-in",
      {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      },
      0.3
    );
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center pt-20">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full"
        style={{ left: "50%", top: "50%" }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <motion.div
          className="blur-in text-xs text-muted uppercase tracking-[0.3em] mb-8"
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        >
          COLLECTION '26
        </motion.div>

        {/* Name */}
        <motion.h1
          className="name-reveal text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-text-primary mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Michael Smith
        </motion.h1>

        {/* Role Line */}
        <motion.p className="blur-in text-lg md:text-xl text-text-primary mb-8">
          A{" "}
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIndex}
              className="font-display italic text-text-primary inline-block"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {roles[roleIndex]}
            </motion.span>
          </AnimatePresence>{" "}
          lives in Chicago.
        </motion.p>

        {/* Description */}
        <motion.p
          className="blur-in text-sm md:text-base text-muted max-w-md mx-auto mb-12"
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        >
          Designing seamless digital interactions by focusing on the unique
          nuances which bring systems to life.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="blur-in flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        >
          <motion.button
            className="rounded-full text-sm px-7 py-3.5 bg-text-primary text-bg font-medium hover:scale-105 transition-transform"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(137, 170, 204, 0.3)",
            }}
          >
            See Works
          </motion.button>
          <motion.button
            className="relative rounded-full text-sm px-7 py-3.5 border-2 border-stroke bg-bg text-text-primary font-medium hover:scale-105 transition-all group overflow-hidden"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="absolute inset-0 -inset-[2px] bg-gradient-to-r from-[#89AACC] to-[#4E85BF] rounded-full opacity-0 group-hover:opacity-100 -z-10"
              transition={{ duration: 0.3 }}
            />
            Reach out... ↗
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs text-muted uppercase tracking-[0.2em]">
          SCROLL
        </span>
        <div className="w-px h-10 bg-stroke/50" />
      </motion.div>
    </section>
  );
}

// ============================================================================
// SELECTED WORKS SECTION
// ============================================================================
function SelectedWorks() {
  const projects = [
    {
      title: "Automotive Motion",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      span: "col-span-1 md:col-span-7",
    },
    {
      title: "Urban Architecture",
      image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
      span: "col-span-1 md:col-span-5",
    },
    {
      title: "Human Perspective",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
      span: "col-span-1 md:col-span-5",
    },
    {
      title: "Brand Identity",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      span: "col-span-1 md:col-span-7",
    },
  ];

  return (
    <section className="bg-bg py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.3em]">
              Selected Work
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display italic mb-4">
            Featured <span className="font-display italic">projects</span>
          </h2>
          <p className="text-muted max-w-xl">
            A selection of projects I've worked on, from concept to launch.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
                delay: idx * 0.1,
              }}
              viewport={{ once: true, margin: "-50px" }}
              className={`${project.span} group relative rounded-3xl overflow-hidden bg-surface border border-stroke aspect-[4/3] cursor-pointer`}
            >
              {/* Background Image */}
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Halftone Overlay */}
              <div
                className="absolute inset-0 opacity-20 mix-blend-multiply"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #000 1px, transparent 1px)",
                  backgroundSize: "4px 4px",
                }}
              />

              {/* Hover Overlay */}
              <motion.div
                className="absolute inset-0 bg-bg/70 backdrop-blur-lg flex items-center justify-center"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="relative rounded-full bg-text-primary text-bg px-6 py-3 text-sm font-medium flex items-center gap-2"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  View — <span className="font-display italic">{project.title}</span>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// JOURNAL SECTION
// ============================================================================
function Journal() {
  const entries = [
    {
      title: "Design Systems at Scale",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
      readTime: "5 min read",
      date: "May 22, 2026",
    },
    {
      title: "Future of Digital Interaction",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80",
      readTime: "8 min read",
      date: "May 18, 2026",
    },
    {
      title: "Creative Code in Motion",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
      readTime: "6 min read",
      date: "May 12, 2026",
    },
    {
      title: "Building Meaningful Experiences",
      image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80",
      readTime: "7 min read",
      date: "May 8, 2026",
    },
  ];

  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.3em]">
              Recent Thoughts
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display italic mb-4">
            Recent <span className="font-display italic">thoughts</span>
          </h2>
        </motion.div>

        {/* Journal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entries.map((entry, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: idx * 0.1,
              }}
              viewport={{ once: true, margin: "-50px" }}
              className="group flex items-center gap-4 p-4 bg-surface/30 hover:bg-surface border border-stroke rounded-[40px] sm:rounded-full cursor-pointer transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={entry.image}
                alt={entry.title}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-text-primary truncate">
                  {entry.title}
                </h3>
                <p className="text-xs text-muted">
                  {entry.readTime} • {entry.date}
                </p>
              </div>
              <span className="text-xs text-muted">→</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STATS SECTION
// ============================================================================
function Stats() {
  const stats = [
    { number: "20+", label: "Years Experience" },
    { number: "95+", label: "Projects Done" },
    { number: "200%", label: "Satisfied Clients" },
  ];

  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: idx * 0.1,
              }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-center"
            >
              <motion.div
                className="text-5xl md:text-7xl font-display italic text-text-primary mb-2"
                whileInView={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              >
                {stat.number}
              </motion.div>
              <p className="text-muted text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CONTACT & FOOTER
// ============================================================================
function Contact() {
  const videoRef = useRef(null);
  const marqueeRef = useRef(null);

  useEffect(() => {
    // Setup HLS video
    if (videoRef.current) {
      const videoUrl =
        "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = videoUrl;
      }
    }
  }, []);

  useEffect(() => {
    // GSAP Marquee animation
    if (marqueeRef.current) {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        duration: 40,
        ease: "none",
        repeat: -1,
      });
    }
  }, []);

  return (
    <section className="relative min-h-[60vh] w-full overflow-hidden flex flex-col items-center justify-center pt-16 md:pt-20 pb-8 md:pb-12">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: "scaleY(-1)" }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Marquee */}
      <div className="relative z-10 w-full overflow-hidden mb-16">
        <motion.div
          ref={marqueeRef}
          className="flex whitespace-nowrap text-4xl md:text-6xl font-display italic text-text-primary"
        >
          {Array(10)
            .fill(0)
            .map((_, idx) => (
              <span key={idx} className="mx-8">
                BUILDING THE FUTURE •
              </span>
            ))}
        </motion.div>
      </div>

      {/* CTA */}
      <motion.a
        href="mailto:hello@michaelsmith.com"
        className="relative z-10 rounded-full text-lg px-10 py-4 bg-text-primary text-bg font-medium hover:scale-105 transition-transform group overflow-hidden mb-8"
        whileHover={{ scale: 1.05 }}
      >
        <motion.div
          className="absolute inset-0 -inset-[3px] bg-gradient-to-r from-[#89AACC] to-[#4E85BF] rounded-full opacity-0 group-hover:opacity-100 -z-10"
          transition={{ duration: 0.3 }}
        />
        Get In Touch
      </motion.a>

      {/* Footer Bar */}
      <div className="relative z-10 flex items-center gap-8 text-xs text-muted">
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="hover:text-text-primary transition-colors"
          >
            Twitter
          </a>
          <a
            href="#"
            className="hover:text-text-primary transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="#"
            className="hover:text-text-primary transition-colors"
          >
            Dribbble
          </a>
          <a
            href="#"
            className="hover:text-text-primary transition-colors"
          >
            GitHub
          </a>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>Available for projects</span>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN APP
// ============================================================================
export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="bg-bg text-text-primary min-h-screen scroll-smooth">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');

        :root {
          --bg: 0 0% 4%;
          --surface: 0 0% 8%;
          --text: 0 0% 96%;
          --muted: 0 0% 53%;
          --stroke: 0 0% 12%;
          --accent: 0 0% 96%;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          background-color: hsl(var(--bg));
          color: hsl(var(--text));
        }

        .font-body {
          font-family: 'Inter', sans-serif;
        }

        .font-display {
          font-family: 'Instrument Serif', serif;
        }

        .bg-bg {
          background-color: hsl(var(--bg));
        }

        .bg-surface {
          background-color: hsl(var(--surface));
        }

        .text-text-primary {
          color: hsl(var(--text));
        }

        .text-muted {
          color: hsl(var(--muted));
        }

        .bg-stroke {
          background-color: hsl(var(--stroke));
        }

        .accent-gradient {
          background: linear-gradient(90deg, #89AACC 0%, #4E85BF 100%);
        }

        @keyframes scroll-down {
          0%, 100% {
            transform: translateY(-100%);
          }
          50% {
            transform: translateY(200%);
          }
        }

        .animate-scroll-down {
          animation: scroll-down 1.5s ease-in-out infinite;
        }

        @keyframes role-fade-in {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-role-fade-in {
          animation: role-fade-in 0.4s ease-out;
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 6s ease infinite;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      <Navbar />
      <Hero />
      <SelectedWorks />
      <Journal />
      <Stats />
      <Contact />
    </div>
  );
}
