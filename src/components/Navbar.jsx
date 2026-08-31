import { useState, useEffect, useRef } from "react";
import { Menu, X, Moon, Sun, Tv, ChevronDown } from "lucide-react";
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
  const moreRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    }
    if (moreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [moreOpen]);

  // Close dropdown on Escape
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") setMoreOpen(false);
    }
    if (moreOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [moreOpen]);

  return (
    <nav className={s.nav}>
      <div className={s.innerContainer}>
        {/* Logo */}
        <a href="/" className={s.logo}>
          ⚽ ዳዊት football
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          {mainLinks.map((link) => (
            <a key={link.label} href={link.href} className={s.desktopNavLink}>
              {link.label}
            </a>
          ))}

          {/* More dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreOpen((prev) => !prev)}
              className={`inline-flex items-center gap-1 transition ${
                moreOpen ? "text-white" : "text-white/70 hover:text-white"
              }`}
            >
              More
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
              />
            </button>

            {moreOpen && (
              <div className="absolute left-1/2 top-full z-50 mt-2 w-48 -translate-x-1/2 overflow-hidden rounded-xl border border-white/10 bg-[#111] shadow-2xl shadow-black/50 backdrop-blur-xl animate-fade-in-scale">
                <div className="p-1.5">
                  {moreLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[11px] font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
                    >
                      <span className="text-xs">{link.icon}</span>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Theme toggle */}
        <button type="button" onClick={toggleTheme} className={s.hamburgerButton} aria-label="Toggle theme">
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Watch Live button */}
        <a
          href="/watch-live"
          className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-2 text-[10px] font-black uppercase text-white shadow-lg shadow-red-500/30 transition animate-press hover:bg-red-500 hover:shadow-red-500/50 min-[380px]:px-4 min-[380px]:text-[11px] animate-border-glow"
        >
          <Tv size={12} />
          <span className="hidden min-[380px]:inline">Watch Live</span>
          <span className="min-[380px]:hidden">Live</span>
        </a>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={s.hamburgerButton}
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={s.mobileMenu}>
          {mainLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={s.mobileMenuLink}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}

          {/* Divider */}
          <div className="my-1 border-t border-white/10" />

          {/* More section */}
          <p className="px-4 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white/30">More</p>
          {moreLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              <span>{link.icon}</span>
              {link.label}
            </a>
          ))}

          {/* Divider */}
          <div className="my-1 border-t border-white/10" />

          {/* Watch Live */}
          <a
            href="/watch-live"
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-red-400 transition hover:bg-white/10 hover:text-red-300"
            onClick={() => setMobileOpen(false)}
          >
            <Tv size={14} /> Watch Live
          </a>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={() => {
              toggleTheme();
              setMobileOpen(false);
            }}
            className="w-full rounded-xl px-4 py-3 text-left text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      )}
    </nav>
  );
}
