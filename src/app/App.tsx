import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "motion/react";
import {
  Menu, X, Mail, Phone, Github, Linkedin, ExternalLink,
  ArrowRight, ArrowUpRight, ChevronDown, Code2,
  Zap, ShoppingCart, Layout, Rocket, Globe,
  Wrench, Search, Settings, TrendingUp,
} from "lucide-react";

// ── Keyframe CSS ────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-18px); }
  }
  @keyframes floatSlow {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-12px) rotate(2deg); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes scrollLine {
    0% { transform: translateY(-100%); opacity: 1; }
    100% { transform: translateY(200%); opacity: 0; }
  }
  @keyframes ripple {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(4); opacity: 0; }
  }
  @keyframes rotateRing {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes pulseGlow {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .font-display { font-family: 'Outfit', sans-serif; }
  .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }
  * { scrollbar-width: none; }
  *::-webkit-scrollbar { display: none; }
  html { scroll-behavior: smooth; }
`;

// ── Hooks ──────────────────────────────────────────────────────────
function useCounter(end: number, duration: number, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let startTime: number | null = null;
    const tick = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [end, duration, trigger]);
  return count;
}

function useTypingEffect(text: string, speed = 90) {
  const [displayed, setDisplayed] = useState("");
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (idx >= text.length) return;
    const t = setTimeout(() => {
      setDisplayed((p) => p + text[idx]);
      setIdx((p) => p + 1);
    }, speed);
    return () => clearTimeout(t);
  }, [idx, text, speed]);
  return displayed;
}

// ── Data ────────────────────────────────────────────────────────────
const NAV_LINKS = ["Home", "About", "Services", "Skills", "Projects", "Contact"];

const SERVICES = [
  { icon: Code2, title: "WordPress Website Design", desc: "Custom, pixel-perfect WordPress websites engineered to elevate your brand and convert visitors into loyal customers." },
  { icon: Zap, title: "Elementor Development", desc: "Advanced Elementor builds featuring custom widgets, dynamic content, and cinematic animations for maximum impact." },
  { icon: ShoppingCart, title: "WooCommerce Store Setup", desc: "Full-featured eCommerce stores with seamless checkout flows, payment gateways, and smart inventory management." },
  { icon: Layout, title: "Landing Page Design", desc: "High-converting landing pages architected to capture qualified leads and deliver measurable ROI for your business." },
  { icon: TrendingUp, title: "Website Speed Optimization", desc: "Deep performance audits and surgical optimizations to achieve 90+ PageSpeed scores across all device types." },
  { icon: Globe, title: "Website Migration", desc: "Seamless migrations between hosts or CMS platforms with zero data loss, minimal downtime, and full testing." },
  { icon: Wrench, title: "Website Maintenance", desc: "Comprehensive maintenance retainers covering updates, daily backups, security monitoring, and priority support." },
  { icon: Search, title: "SEO Optimization", desc: "Technical and on-page SEO strategies that drive sustainable organic growth and outrank your competitors." },
  { icon: Settings, title: "Plugin Configuration", desc: "Expert configuration and customization of WordPress plugins to extend your site's capabilities without bloat." },
];

const SKILLS = [
  { name: "WordPress", level: 95 },
  { name: "Elementor", level: 92 },
  { name: "WooCommerce", level: 88 },
  { name: "Responsive Design", level: 90 },
  { name: "Theme Customization", level: 93 },
  { name: "Plugin Config", level: 85 },
  { name: "Landing Pages", level: 91 },
  { name: "Site Migration", level: 87 },
  { name: "Speed Optimization", level: 89 },
  { name: "SEO", level: 86 },
];

const STATS = [
  { label: "Projects Completed", value: 50, suffix: "+" },
  { label: "Happy Clients", value: 30, suffix: "+" },
  { label: "Years Learning", value: 3, suffix: "+" },
  { label: "Websites Built", value: 45, suffix: "+" },
];

// ── Pre-computed particles (avoid Math.random in render) ────────────
const CARD_PARTICLES = [
  { w: 3, top: "12%", left: "15%", dur: "4s", delay: "0s" },
  { w: 2, top: "35%", left: "82%", dur: "6s", delay: "1s" },
  { w: 4, top: "58%", left: "25%", dur: "5s", delay: "0.5s" },
  { w: 2, top: "22%", left: "68%", dur: "7s", delay: "1.5s" },
  { w: 3, top: "75%", left: "55%", dur: "4.5s", delay: "0.8s" },
  { w: 2, top: "48%", left: "10%", dur: "5.5s", delay: "0.3s" },
];

// ── SectionHeader ───────────────────────────────────────────────────
function SectionHeader({ label, title, highlight, sub }: {
  label: string; title: string; highlight: string; sub?: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-3 mb-5">
        <div className="h-px w-8" style={{ background: "#3B82F6", boxShadow: "0 0 8px #3B82F6" }} />
        <span className="text-xs font-semibold tracking-[0.35em] uppercase" style={{ color: "#3B82F6" }}>{label}</span>
        <div className="h-px w-8" style={{ background: "#3B82F6", boxShadow: "0 0 8px #3B82F6" }} />
      </div>
      <h2 className="font-display font-black text-white leading-[1.05] tracking-tight"
        style={{ fontSize: "clamp(2.2rem, 5vw, 3.75rem)" }}>
        {title}{" "}
        <span style={{
          background: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 50%, #93C5FD 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "shimmer 4s linear infinite",
        }}>
          {highlight}
        </span>
      </h2>
      {sub && (
        <p className="mt-4 max-w-xl mx-auto text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

// ── Navbar ──────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = NAV_LINKS.map((l) => l.toLowerCase());
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActive(id);
    setMenuOpen(false);
  };

  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
      style={{
        padding: scrolled ? "12px 0" : "22px 0",
        background: scrolled ? "rgba(11,11,11,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(59,130,246,0.12)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <motion.button
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => scrollTo("home")}
          className="font-display text-lg font-black tracking-[0.2em] uppercase"
        >
          <span className="text-white">TAHA</span>
          <span style={{ color: "#3B82F6", textShadow: "0 0 20px rgba(59,130,246,0.6)" }}> BALOCH</span>
        </motion.button>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link, i) => {
            const id = link.toLowerCase();
            const isActive = active === id;
            return (
              <motion.button
                key={link}
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                onClick={() => scrollTo(id)}
                className="relative text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-300 group"
                style={{ color: isActive ? "#3B82F6" : "rgba(255,255,255,0.55)" }}
              >
                {link}
                <span
                  className="absolute -bottom-1.5 left-0 h-px transition-all duration-300 group-hover:w-full"
                  style={{ width: isActive ? "100%" : "0", background: "#3B82F6", boxShadow: "0 0 8px #3B82F6" }}
                />
              </motion.button>
            );
          })}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-colors duration-200"
          style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={18} color="#3B82F6" /> : <Menu size={18} color="#3B82F6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
          className="md:hidden overflow-hidden"
          style={{ background: "rgba(11,11,11,0.97)", backdropFilter: "blur(24px)", borderTop: "1px solid rgba(59,130,246,0.1)" }}
        >
          <div className="px-6 py-6 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link.toLowerCase())}
                className="text-left py-3 px-4 rounded-xl text-sm font-medium tracking-[0.15em] uppercase transition-all duration-200"
                style={{
                  color: active === link.toLowerCase() ? "#3B82F6" : "rgba(255,255,255,0.65)",
                  background: active === link.toLowerCase() ? "rgba(59,130,246,0.08)" : "transparent",
                }}
              >
                {link}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}

// ── Hero ────────────────────────────────────────────────────────────
function Hero() {
  const typedName = useTypingEffect("TAHA BALOCH", 75);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const onCardMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left - rect.width / 2) / (rect.width / 2),
      y: (e.clientY - rect.top - rect.height / 2) / (rect.height / 2),
    });
  }, []);

  const fireRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((p) => [...p, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((p) => p.filter((r) => r.id !== id)), 700);
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0" style={{ background: "#0B0B0B" }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 60% at 15% 50%, rgba(59,130,246,0.09) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 85% 25%, rgba(96,165,250,0.06) 0%, transparent 60%)",
      }} />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }} />

      {/* Floating orbs */}
      <div className="absolute pointer-events-none" style={{ top: "15%", left: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)", filter: "blur(40px)", animation: "pulseGlow 5s ease-in-out infinite" }} />
      <div className="absolute pointer-events-none" style={{ bottom: "20%", right: "10%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(29,78,216,0.08) 0%, transparent 70%)", filter: "blur(30px)", animation: "pulseGlow 7s ease-in-out infinite 2s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left ── */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            <div className="flex items-center gap-3 mb-7">
              <div className="h-px w-10" style={{ background: "linear-gradient(90deg, #3B82F6, #60A5FA)", boxShadow: "0 0 10px #3B82F6" }} />
              <span className="text-xs font-semibold tracking-[0.4em] uppercase" style={{ color: "#60A5FA" }}>Hello, I'm</span>
            </div>

            <h1 className="font-display font-black leading-none tracking-tight mb-5" style={{ fontSize: "clamp(3.2rem, 9vw, 7.5rem)" }}>
              <span style={{
                background: "linear-gradient(135deg, #ffffff 0%, #ffffff 55%, #93C5FD 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                {typedName}
              </span>
              <span className="inline-block animate-pulse ml-1" style={{ color: "#3B82F6", textShadow: "0 0 20px #3B82F6", WebkitTextFillColor: "#3B82F6" }}>|</span>
            </h1>

            <p className="font-display text-lg md:text-2xl font-medium mb-6 tracking-wide" style={{ color: "rgba(255,255,255,0.55)" }}>
              WordPress Web Designer &{" "}
              <span style={{ color: "#3B82F6", textShadow: "0 0 15px rgba(59,130,246,0.4)" }}>SEO Specialist</span>
            </p>

            <p className="text-base md:text-lg leading-relaxed mb-10 max-w-lg" style={{ color: "rgba(255,255,255,0.42)", lineHeight: 1.8 }}>
              Passionate about creating modern, responsive, and user-friendly websites. I help businesses build a strong online presence with professional WordPress solutions and effective SEO strategies.
            </p>

            <div className="flex flex-wrap gap-4">
              {/* Primary CTA */}
              <button
                onClick={fireRipple}
                className="relative overflow-hidden px-8 py-4 rounded-full font-display font-bold text-sm tracking-[0.15em] uppercase text-white transition-all duration-300 group"
                style={{
                  background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                  boxShadow: "0 0 30px rgba(59,130,246,0.45), 0 0 60px rgba(59,130,246,0.15)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 50px rgba(59,130,246,0.7), 0 0 100px rgba(59,130,246,0.25)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px) scale(1.02)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(59,130,246,0.45), 0 0 60px rgba(59,130,246,0.15)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(1)"; }}
                onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(0.98)"; }}
                onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px) scale(1.02)"; }}
              >
                {ripples.map((r) => (
                  <span key={r.id} className="absolute rounded-full pointer-events-none"
                    style={{ left: r.x - 30, top: r.y - 30, width: 60, height: 60, background: "rgba(255,255,255,0.25)", animation: "ripple 0.7s ease-out forwards" }} />
                ))}
                <span className="relative z-10 flex items-center gap-2">
                  Hire Me <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>

              {/* Secondary CTA */}
              <button
                className="px-8 py-4 rounded-full font-display font-bold text-sm tracking-[0.15em] uppercase transition-all duration-300 group"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(59,130,246,0.35)",
                  color: "rgba(255,255,255,0.75)",
                  boxShadow: "inset 0 0 25px rgba(59,130,246,0.05)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#3B82F6"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(59,130,246,0.2), inset 0 0 25px rgba(59,130,246,0.1)"; (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.35)"; (e.currentTarget as HTMLElement).style.boxShadow = "inset 0 0 25px rgba(59,130,246,0.05)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              >
                <span className="flex items-center gap-2">
                  View My Work <ChevronDown size={15} className="transition-transform duration-300 group-hover:translate-y-0.5" />
                </span>
              </button>
            </div>
          </motion.div>

          {/* ── Right: 3D Card ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div
              ref={cardRef}
              onMouseMove={onCardMouseMove}
              onMouseEnter={() => setIsHoveringCard(true)}
              onMouseLeave={() => { setIsHoveringCard(false); setMousePos({ x: 0, y: 0 }); }}
              style={{
                perspective: "1200px",
                transform: isHoveringCard
                  ? `rotateX(${-mousePos.y * 14}deg) rotateY(${mousePos.x * 14}deg) scale(1.03)`
                  : "rotateX(0deg) rotateY(0deg) scale(1)",
                transition: isHoveringCard ? "transform 0.08s ease" : "transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                animation: !isHoveringCard ? "floatSlow 7s ease-in-out infinite" : "none",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Outer glow */}
              <div className="absolute -inset-8 rounded-[2rem] pointer-events-none" style={{
                background: "radial-gradient(ellipse at center, rgba(59,130,246,0.25) 0%, transparent 70%)",
                filter: "blur(30px)",
                animation: "pulseGlow 4s ease-in-out infinite",
              }} />

              {/* Card shell */}
              <div className="relative rounded-[1.75rem] overflow-hidden"
                style={{
                  width: 300,
                  height: 400,
                  background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                  backdropFilter: "blur(30px)",
                  border: "1px solid rgba(59,130,246,0.35)",
                  boxShadow: "0 30px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}>

                {/* Animated top bar */}
                <div className="absolute top-0 inset-x-0 h-[2px]" style={{
                  background: "linear-gradient(90deg, transparent 0%, #3B82F6 30%, #60A5FA 50%, #3B82F6 70%, transparent 100%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2.5s linear infinite",
                }} />

                {/* Avatar area */}
                <div className="relative h-64 flex items-center justify-center overflow-hidden"
                  style={{ background: "linear-gradient(160deg, #0d1829 0%, #0B0B0B 50%, #0d1020 100%)" }}>

                  {/* Blueprint grid */}
                  <div className="absolute inset-0 opacity-[0.06]" style={{
                    backgroundImage: "linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }} />

                  {/* Central avatar */}
                  <div className="relative z-10">
                    <div className="w-28 h-28 rounded-full flex items-center justify-center font-display font-black text-5xl text-white"
                      style={{
                        background: "linear-gradient(135deg, #1D4ED8 0%, #3B82F6 50%, #60A5FA 100%)",
                        boxShadow: "0 0 50px rgba(59,130,246,0.6), 0 0 100px rgba(59,130,246,0.2)",
                      }}>
                      TB
                    </div>
                    {/* Orbit ring */}
                    <div className="absolute -inset-5 rounded-full border border-dashed pointer-events-none"
                      style={{ borderColor: "rgba(59,130,246,0.35)", animation: "rotateRing 12s linear infinite" }} />
                    <div className="absolute -inset-9 rounded-full border pointer-events-none"
                      style={{ borderColor: "rgba(59,130,246,0.12)" }} />
                    {/* Orbit dot */}
                    <div className="absolute w-2.5 h-2.5 rounded-full -top-5 left-1/2 -translate-x-1/2"
                      style={{ background: "#3B82F6", boxShadow: "0 0 12px #3B82F6" }} />
                  </div>

                  {/* Floating particles */}
                  {CARD_PARTICLES.map((p, i) => (
                    <div key={i} className="absolute rounded-full pointer-events-none"
                      style={{
                        width: p.w, height: p.w,
                        top: p.top, left: p.left,
                        background: "#60A5FA",
                        boxShadow: "0 0 6px #3B82F6",
                        animation: `float ${p.dur} ease-in-out infinite`,
                        animationDelay: p.delay,
                        opacity: 0.7,
                      }} />
                  ))}

                  {/* Bottom gradient fade */}
                  <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
                    style={{ background: "linear-gradient(to top, rgba(17,17,24,1), transparent)" }} />
                </div>

                {/* Info panel */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: "#22C55E", boxShadow: "0 0 8px #22C55E", animation: "pulseGlow 2s ease-in-out infinite" }} />
                    <span className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: "#22C55E" }}>Available for work</span>
                  </div>
                  <h3 className="font-display font-black text-white text-xl leading-tight">Taha Baloch</h3>
                  <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                    WordPress Designer · SEO Specialist
                  </p>
                  <div className="mt-4 flex gap-2">
                    {["WordPress", "SEO", "UI"].map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide"
                        style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", color: "#60A5FA" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Shine overlay */}
                <div className="absolute inset-0 pointer-events-none rounded-[1.75rem]" style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%, transparent 100%)",
                }} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[10px] tracking-[0.35em] uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>Scroll</span>
        <div className="w-px h-10 overflow-hidden relative" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="absolute inset-x-0 h-1/2" style={{ background: "#3B82F6", animation: "scrollLine 2s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}

// ── About ──────────────────────────────────────────────────────────
function CounterCard({ label, value, suffix, delay, trigger }: {
  label: string; value: number; suffix: string; delay: number; trigger: boolean;
}) {
  const count = useCounter(value, 2200, trigger);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }} animate={trigger ? { opacity: 1, scale: 1 } : {}} transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="p-5 rounded-2xl text-center"
      style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}
    >
      <div className="font-display font-black text-4xl mb-1.5" style={{ color: "#3B82F6", textShadow: "0 0 20px rgba(59,130,246,0.4)" }}>
        {count}{suffix}
      </div>
      <div className="text-xs tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</div>
    </motion.div>
  );
}

function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} id="about" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 80% 50%, rgba(59,130,246,0.05) 0%, transparent 60%), #0B0B0B" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionHeader label="About Me" title="Crafting Digital" highlight="Experiences" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-20">
          {/* Left: image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center"
          >
            <div className="relative" style={{ animation: "float 7s ease-in-out infinite" }}>
              <div className="absolute -inset-6 rounded-3xl pointer-events-none" style={{
                background: "linear-gradient(135deg, rgba(59,130,246,0.12), transparent)",
                filter: "blur(25px)",
              }} />
              <div className="relative rounded-3xl overflow-hidden"
                style={{
                  width: 360,
                  height: 460,
                  border: "1px solid rgba(59,130,246,0.2)",
                  boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
                }}>
                <img
                  src="https://images.unsplash.com/photo-1547658719-da2b51169166?w=720&h=920&fit=crop&auto=format"
                  alt="Professional web design workspace"
                  className="w-full h-full object-cover"
                  style={{ background: "#111118" }}
                />
                <div className="absolute inset-0" style={{
                  background: "linear-gradient(180deg, transparent 40%, rgba(11,11,11,0.8) 100%), linear-gradient(135deg, rgba(59,130,246,0.07) 0%, transparent 60%)",
                }} />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -right-5 px-5 py-4 rounded-2xl"
                style={{ background: "rgba(17,17,24,0.9)", backdropFilter: "blur(20px)", border: "1px solid rgba(59,130,246,0.3)", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
                <div className="text-center">
                  <div className="font-display font-black text-3xl" style={{ color: "#3B82F6", textShadow: "0 0 15px rgba(59,130,246,0.5)" }}>3+</div>
                  <div className="text-[10px] tracking-[0.2em] uppercase mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>Years Exp.</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="p-8 md:p-10 rounded-3xl"
              style={{
                background: "rgba(255,255,255,0.02)",
                backdropFilter: "blur(30px)",
                border: "1px solid rgba(59,130,246,0.14)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}>
              <h3 className="font-display font-black text-2xl md:text-3xl text-white mb-5 leading-tight">
                WordPress Expert &{" "}
                <span style={{ color: "#3B82F6" }}>SEO Strategist</span>
              </h3>
              <p className="leading-relaxed mb-4 text-base" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.85 }}>
                I'm a passionate WordPress Web Designer and SEO Specialist with a deep commitment to crafting digital experiences that don't just look stunning — they perform exceptionally.
              </p>
              <p className="leading-relaxed mb-10 text-base" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.85 }}>
                From custom WordPress builds and WooCommerce stores to comprehensive SEO audits and speed optimizations, I deliver end-to-end solutions that grow your business online.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {STATS.map((s, i) => (
                  <CounterCard key={s.label} {...s} delay={i * 0.12} trigger={inView} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Services ────────────────────────────────────────────────────────
function ServiceCard({ icon: Icon, title, desc, delay, trigger }: {
  icon: React.ElementType; title: string; desc: string; delay: number; trigger: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={trigger ? { opacity: 1, y: 0 } : {}} transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="relative p-7 rounded-2xl cursor-default overflow-hidden group"
      style={{
        background: hovered ? "rgba(59,130,246,0.07)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? "rgba(59,130,246,0.45)" : "rgba(255,255,255,0.06)"}`,
        boxShadow: hovered ? "0 20px 60px rgba(59,130,246,0.12), 0 0 0 1px rgba(59,130,246,0.08)" : "none",
        transform: hovered ? "translateY(-8px) rotateX(2deg)" : "translateY(0) rotateX(0)",
        transformStyle: "preserve-3d",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Top edge glow */}
      <div className="absolute top-0 inset-x-0 h-px pointer-events-none transition-opacity duration-500"
        style={{ background: "linear-gradient(90deg, transparent, #3B82F6, transparent)", opacity: hovered ? 1 : 0 }} />

      {/* Icon */}
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-400"
        style={{
          background: hovered ? "rgba(59,130,246,0.18)" : "rgba(59,130,246,0.07)",
          border: `1px solid ${hovered ? "rgba(59,130,246,0.55)" : "rgba(59,130,246,0.18)"}`,
          boxShadow: hovered ? "0 0 25px rgba(59,130,246,0.35)" : "none",
        }}>
        <Icon size={20} style={{ color: "#3B82F6" }} />
      </div>

      <h3 className="font-display font-bold text-white text-base mb-3 leading-tight">{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.75 }}>{desc}</p>

      <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-300"
        style={{ color: "#3B82F6", opacity: hovered ? 1 : 0, transform: hovered ? "translateX(0)" : "translateX(-8px)" }}>
        Explore <ArrowRight size={11} />
      </div>
    </motion.div>
  );
}

function Services() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} id="services" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "#080808" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionHeader
          label="What I Do"
          title="Premium"
          highlight="Services"
          sub="Comprehensive WordPress and SEO solutions tailored to elevate your digital presence and drive measurable business results."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-16">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.title} {...s} delay={i * 0.07} trigger={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Skills ──────────────────────────────────────────────────────────
function SkillCircle({ name, level, delay, trigger }: { name: string; level: number; delay: number; trigger: boolean }) {
  const [animated, setAnimated] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    const t = setTimeout(() => setAnimated(true), delay * 1000 + 300);
    return () => clearTimeout(t);
  }, [trigger, delay]);

  const size = 108;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (animated ? (level / 100) * circ : circ);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }} animate={trigger ? { opacity: 1, scale: 1 } : {}} transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="flex flex-col items-center gap-3 p-4 rounded-2xl cursor-default transition-all duration-400"
      style={{
        background: hovered ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.05)"}`,
        boxShadow: hovered ? "0 10px 40px rgba(59,130,246,0.15)" : "none",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
      }}
    >
      <div className="relative">
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke}
            stroke="rgba(255,255,255,0.05)" />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke}
            stroke="#3B82F6" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(0.16, 1, 0.3, 1)", filter: hovered ? "drop-shadow(0 0 6px #3B82F6)" : "none" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display font-black text-base" style={{ color: "#3B82F6" }}>
            {animated ? level : 0}%
          </span>
        </div>
      </div>
      <span className="text-xs font-medium text-center leading-tight" style={{ color: "rgba(255,255,255,0.6)" }}>{name}</span>
    </motion.div>
  );
}

function Skills() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} id="skills" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 30% 50%, rgba(59,130,246,0.05) 0%, transparent 60%), #0B0B0B" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionHeader
          label="My Expertise"
          title="Technical"
          highlight="Skills"
          sub="Years of hands-on experience across the full WordPress ecosystem and every dimension of modern SEO."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 mt-16">
          {SKILLS.map((s, i) => (
            <SkillCircle key={s.name} {...s} delay={i * 0.07} trigger={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Projects ─────────────────────────────────────────────────────────
function Projects() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} id="projects" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "#080808" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionHeader
          label="My Work"
          title="Featured"
          highlight="Projects"
          sub="Premium WordPress solutions delivered for clients across the globe, built to perform and impress."
        />

        <motion.div
          initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 rounded-3xl overflow-hidden group"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(59,130,246,0.15)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image pane */}
            <div className="relative overflow-hidden" style={{ minHeight: 340 }}>
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=600&fit=crop&auto=format"
                alt="Malaysia Business Portal - WordPress project"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ background: "#111118" }}
              />
              <div className="absolute inset-0" style={{
                background: "linear-gradient(to right, rgba(8,8,8,0.2) 0%, transparent 50%, rgba(8,8,8,0.95) 100%), linear-gradient(to top, rgba(8,8,8,0.6) 0%, transparent 60%)",
              }} />
              {/* Floating label */}
              <div className="absolute top-6 left-6 px-4 py-2 rounded-full flex items-center gap-2"
                style={{ background: "rgba(11,11,11,0.7)", backdropFilter: "blur(20px)", border: "1px solid rgba(59,130,246,0.3)" }}>
                <span className="text-lg">🇲🇾</span>
                <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "#60A5FA" }}>Malaysia Project</span>
              </div>
            </div>

            {/* Details pane */}
            <div className="p-10 md:p-14 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full" style={{ background: "#22C55E", boxShadow: "0 0 10px #22C55E", animation: "pulseGlow 2s ease-in-out infinite" }} />
                <span className="text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: "#22C55E" }}>Live Project</span>
              </div>

              <h3 className="font-display font-black text-white leading-tight mb-5"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                Malaysia<br />
                <span style={{ color: "#3B82F6" }}>Business Portal</span>
              </h3>

              <p className="leading-relaxed mb-7 text-base" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.85 }}>
                A comprehensive WordPress business portal for a Malaysian enterprise — custom Elementor architecture, WooCommerce integration, multi-language support, and a full SEO overhaul that achieved 95+ PageSpeed scores and significant organic traffic growth.
              </p>

              <div className="flex flex-wrap gap-2 mb-9">
                {["WordPress", "Elementor", "WooCommerce", "On-Page SEO", "Multi-language", "Speed Opt."].map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(59,130,246,0.09)", border: "1px solid rgba(59,130,246,0.22)", color: "#60A5FA" }}>
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300"
                  style={{ background: "linear-gradient(135deg, #3B82F6, #1D4ED8)", color: "#fff", boxShadow: "0 0 25px rgba(59,130,246,0.45)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 50px rgba(59,130,246,0.7)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 25px rgba(59,130,246,0.45)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                >
                  <ExternalLink size={14} /> Live Demo
                </button>
                <button
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300"
                  style={{ background: "transparent", border: "1px solid rgba(59,130,246,0.3)", color: "rgba(255,255,255,0.75)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#3B82F6"; (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(59,130,246,0.2)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.3)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                >
                  <Code2 size={14} /> Case Study
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* More projects CTA */}
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.3)" }}>More projects available on request</p>
          <a
            href="mailto:tahabaloch.professional@gmail.com"
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider transition-colors duration-200"
            style={{ color: "#3B82F6" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#60A5FA"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#3B82F6"; }}
          >
            Request Portfolio <ArrowUpRight size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ── Contact ──────────────────────────────────────────────────────────
const CONTACTS = [
  { icon: Mail, label: "Email", value: "tahabaloch.professional@gmail.com", href: "mailto:tahabaloch.professional@gmail.com" },
  { icon: Phone, label: "Phone", value: "+92 330 4006675", href: "tel:+923304006675" },
  { icon: Github, label: "GitHub", value: "github.com/tahabaloch786", href: "https://github.com/tahabaloch786" },
  { icon: Linkedin, label: "LinkedIn", value: "Muhammad Taha Baloch", href: "https://www.linkedin.com/in/muhammad-taha-baloch-a4878b3b0/" },
];

function Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} id="contact" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 90%, rgba(59,130,246,0.07) 0%, transparent 60%), #0B0B0B" }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <SectionHeader
          label="Get In Touch"
          title="Let's Work"
          highlight="Together"
          sub="Ready to transform your online presence? Let's discuss your project and craft something extraordinary."
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-16 p-8 md:p-12 rounded-3xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(40px)",
            border: "1px solid rgba(59,130,246,0.18)",
            boxShadow: "0 50px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Top shine */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px" style={{
            background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.8), transparent)",
          }} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {CONTACTS.map((c, i) => (
              <motion.a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 + i * 0.1, duration: 0.6 }}
                className="flex items-center gap-4 p-5 rounded-2xl group no-underline transition-all duration-300"
                style={{ background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.1)" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(59,130,246,0.1)"; el.style.borderColor = "rgba(59,130,246,0.4)"; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 12px 35px rgba(59,130,246,0.15)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(59,130,246,0.04)"; el.style.borderColor = "rgba(59,130,246,0.1)"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>
                  <c.icon size={19} style={{ color: "#3B82F6" }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>{c.label}</div>
                  <div className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition-colors duration-200">{c.value}</div>
                </div>
                <ArrowUpRight size={15} className="flex-shrink-0 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0" style={{ color: "#3B82F6" }} />
              </motion.a>
            ))}
          </div>

          <div className="text-center">
            <p className="text-xs tracking-[0.2em] uppercase mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>Ready to start a project?</p>
            <a
              href="mailto:tahabaloch.professional@gmail.com"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-display font-bold text-sm tracking-[0.15em] uppercase text-white no-underline transition-all duration-300"
              style={{ background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)", boxShadow: "0 0 35px rgba(59,130,246,0.45)" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 0 65px rgba(59,130,246,0.7)"; el.style.transform = "translateY(-3px) scale(1.02)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 0 35px rgba(59,130,246,0.45)"; el.style.transform = "translateY(0) scale(1)"; }}
            >
              <Mail size={16} /> Send a Message
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────
function Footer() {
  const socials = [
    { icon: Github, href: "https://github.com/tahabaloch786", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/muhammad-taha-baloch-a4878b3b0/", label: "LinkedIn" },
    { icon: Mail, href: "mailto:tahabaloch.professional@gmail.com", label: "Email" },
  ];

  return (
    <footer className="relative py-8" style={{ background: "#060606", borderTop: "1px solid rgba(59,130,246,0.1)" }}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="font-display font-black text-base tracking-[0.2em] uppercase">
          <span className="text-white">TAHA</span>
          <span style={{ color: "#3B82F6" }}> BALOCH</span>
        </div>

        <p className="text-xs tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
          © 2026 TAHA BALOCH. All Rights Reserved.
        </p>

        <div className="flex items-center gap-3">
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 no-underline"
              style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(59,130,246,0.18)"; el.style.boxShadow = "0 0 20px rgba(59,130,246,0.35)"; el.style.borderColor = "rgba(59,130,246,0.45)"; el.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(59,130,246,0.06)"; el.style.boxShadow = "none"; el.style.borderColor = "rgba(59,130,246,0.15)"; el.style.transform = "translateY(0)"; }}
            >
              <Icon size={14} style={{ color: "#3B82F6" }} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen font-body" style={{ background: "#0B0B0B", color: "#F8FAFC" }}>
      <style>{GLOBAL_STYLES}</style>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}
