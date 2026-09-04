import { useState, useEffect, useCallback } from "react";
import { X, Moon, Sun, Tv, ChevronDown, Zap } from "lucide-react";
import { navbarStyles as s } from "../assets/dummyStyles";
import { useTheme } from "../context/ThemeContext";

const mainLinks = [
  { label: "Matches", href: "/#match-center" },
  { label: "Standings", href: "/#standings" },
  { label: "Fixtures", href: "/#fixtures" },
];

const moreLinks = [
  { label: "Live Ratings", href: "/#live-ratings", icon: "⭐" },
  { label: "News", href: "/#news", icon: "📰" },
  { label: "Players", href: "/#players", icon: "👤" },
  { label: "Teams", href: "/#teams", icon: "🛡️" },
  { label: "Highlights", href: "/#highlights", icon: "🎬" },
  { label: "Favorites", href: "/#favorites", icon: "❤️" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Track scroll for subtle background change
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Close dropdowns on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") {
        setMoreOpen(false);
        setMobileOpen(false);
      }
    }
    if (moreOpen || mobileOpen) {
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }
  }, [moreOpen, mobileOpen]);

  return (
    <nav className={`${s.nav} ${scrolled ? "bg-[#0a0a0a] shadow-lg shadow-black/30 border-white/[0.1]" : ""}`}>
      <div className={s.innerContainer}>
        {/* Logo */}
        <a href="/" className={s.logo}>
          ⚽ ዳዊት football
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {mainLinks.map((link) => (
            <a key={link.label} href={link.href} className={s.desktopNavLink}>
              {link.label}
            </a>
          ))}

          {/* More dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((p) => !p)}
              className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors duration-200 ${
                moreOpen ? "bg-white/[0.08] text-white" : "text-white/50 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              More
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
              />
            </button>

            {moreOpen && (
              <>
                {/* Invisible bridge to prevent mouse-away closing */}
                <div className="absolute -top-1 left-0 h-2 w-full" />
                <div className="absolute left-1/2 top-full z-50 mt-1 w-52 -translate-x-1/2 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1a1a1a]/95 shadow-2xl shadow-black/50 backdrop-blur-xl animate-fade-in-scale">
                  <div className="p-1.5">
                    {moreLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={() => setMoreOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[11px] font-bold text-white/60 transition-colors duration-150 hover:bg-white/[0.08] hover:text-white"
                      >
                        <span className="text-xs">{link.icon}</span>
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right side: theme + live + hamburger */}
        <div className="flex items-center gap-1">
          {/* Theme toggle — desktop */}
          <button
            type="button"
            onClick={toggleTheme}
            className={s.themeToggle}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Watch Live button */}
          <a
            href="/watch-live"
            className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-[10px] font-black uppercase text-white shadow-lg shadow-red-600/25 transition-all duration-200 hover:bg-red-500 hover:shadow-red-500/40 sm:px-4 sm:py-2 sm:text-xs"
          >
            <Tv size={12} />
            <span className="hidden min-[380px]:inline">Watch Live</span>
            <span className="min-[380px]:hidden">
              <Zap size={10} />
            </span>
          </a>

          {/* Mobile hamburger — animated */}
          <button
            type="button"
            className={s.hamburgerButton}
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col items-center justify-center gap-[5px]">
              <span
                className={`block h-[2px] w-5 rounded-full bg-white transition-all duration-300 ease-out ${
                  mobileOpen ? "translate-y-[3.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-5 rounded-full bg-white transition-all duration-300 ease-out ${
                  mobileOpen ? "scale-x-0" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-5 rounded-full bg-white transition-all duration-300 ease-out ${
                  mobileOpen ? "-translate-y-[3.5px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile: Backdrop overlay */}
      <div
        className={`${s.mobileOverlay} ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* Mobile: Slide-in drawer */}
      <div
        className={`${s.mobileMenu} ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer header */}
        <div className={s.mobileMenuHeader}>
          <span className="text-sm font-black uppercase tracking-tight text-white">
            ⚽ ዳዊት
          </span>
          <button
            type="button"
            className={s.mobileMenuClose}
            onClick={closeMobile}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer links */}
        <div className="flex-1 overflow-y-auto px-2 py-2">
          <p className={s.mobileMenuLabel}>Navigation</p>
          {mainLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={s.mobileMenuLink}
              onClick={closeMobile}
            >
              {link.label}
            </a>
          ))}

          <div className={s.mobileMenuDivider} />

          <p className={s.mobileMenuLabel}>More</p>
          {moreLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={s.mobileMenuLink}
              onClick={closeMobile}
            >
              <span className="text-sm">{link.icon}</span>
              {link.label}
            </a>
          ))}

          <div className={s.mobileMenuDivider} />

          {/* Watch Live */}
          <a
            href="/watch-live"
            className="mx-2 mt-2 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-400 transition-colors duration-200 hover:bg-red-500/20"
            onClick={closeMobile}
          >
            <Tv size={14} /> Watch Live
          </a>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={() => {
              toggleTheme();
              closeMobile();
            }}
            className={`${s.themeToggleMobile} mt-1 w-full`}
          >
            {theme === "dark" ? (
              <>
                <Sun size={16} />
                Light Mode
              </>
            ) : (
              <>
                <Moon size={16} />
                Dark Mode
              </>
            )}
          </button>
        </div>

        {/* Drawer footer */}
        <div className="border-t border-white/[0.06] px-4 py-3">
          <p className="text-center text-[10px] font-bold uppercase tracking-wider text-white/20">
            © 2026 ዳዊት Football
          </p>
        </div>
      </div>
    </nav>
  );
}