import { useState, useEffect } from "react";
import {
  Play,
  Clock,
  Eye,
  Search,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { highlightsStyles as s } from "../assets/dummyStyles";
import {
  fetchTodayMatches,
  fetchMatchesByDate,
  buildHighlightFromMatch,
} from "../services/footballApi";

function HighlightCard({ highlight, onPlay }) {
  return (
    <div className={s.highlightCard}>
      <div className={s.thumbnailWrapper} onClick={() => onPlay(highlight)}>
        <img src={highlight.thumbnail} alt={highlight.title} className={s.thumbnail} />
        <div className={s.thumbnailOverlay}>
          <div className={s.playButton}>
            <Play size={24} fill="currentColor" />
          </div>
        </div>
        {highlight.score && (
          <div className={s.durationBadge}>{highlight.score}</div>
        )}
      </div>
      <div className={s.highlightInfo}>
        <div className={s.highlightHeader}>
          <span className={s.highlightLeague}>{highlight.league}</span>
          <span className={s.highlightDate}>{highlight.date}</span>
        </div>
        <h3 className={s.highlightTitle}>{highlight.title}</h3>
        <div className={s.highlightMeta}>
          {highlight.status && (
            <span className={s.metaItem}>
              <span className="inline-block size-1.5 rounded-full bg-red-500" />
              {highlight.status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function VideoModal({ highlight, onClose }) {
  if (!highlight) return null;

  return (
    <div className={s.modalBackdrop} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.modalHeader}>
          <h3 className={s.modalTitle}>{highlight.title}</h3>
          <button onClick={onClose} className={s.closeButton}>✕</button>
        </div>
        <div className={s.videoWrapper}>
          <div className={s.videoPlaceholder}>
            <Play size={48} fill="currentColor" className={s.videoPlaceholderIcon} />
            <p className={s.videoPlaceholderText}>Search for highlights on YouTube</p>
            <p className={s.videoPlaceholderSub}>{highlight.title}</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3">
          <a
            href={highlight.youtubeSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-red-500/30 transition hover:bg-red-400"
          >
            <ExternalLink size={14} />
            Watch on YouTube
          </a>
        </div>
        <div className={s.modalMeta}>
          <span>{highlight.league}</span>
          {highlight.score && <span>{highlight.score}</span>}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass-card animate-pulse overflow-hidden rounded-2xl sm:rounded-3xl">
      <div className="h-40 animate-pulse bg-white/5 sm:h-48" />
      <div className="space-y-3 p-4 sm:p-5">
        <div className="h-2 w-1/3 animate-pulse rounded bg-white/10" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
        <div className="h-2 w-1/2 animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}

export default function Highlights() {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLeague, setActiveLeague] = useState("All");
  const [selectedHighlight, setSelectedHighlight] = useState(null);

  const loadHighlights = async () => {
    setLoading(true);
    setError(null);
    try {
      const allMatches = [];

      // 1. Use cached today's matches (no extra API call if already cached)
      try {
        const today = await fetchTodayMatches();
        allMatches.push(...today);
      } catch {}

      // 2. Try yesterday (only 1 extra API call, skip if rate limit hit)
      try {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        const yesterday = d.toISOString().split("T")[0];
        const yesterdayMatches = await fetchMatchesByDate(yesterday);
        allMatches.push(...yesterdayMatches);
      } catch {}

      // Deduplicate and build highlights
      const seen = new Set();
      const built = allMatches
        .filter((m) => {
          const id = m.id;
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        })
        .map(buildHighlightFromMatch);

      setHighlights(built);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHighlights();
  }, []);

  const STATIC_LEAGUES = ["All", "Premier League", "La Liga", "Bundesliga", "Serie A", "Ligue 1", "Champions League"];
  const leagues = STATIC_LEAGUES;

  const filteredHighlights =
    activeLeague === "All"
      ? highlights
      : highlights.filter((h) => h.league === activeLeague);

  return (
    <section id="highlights" className={s.section}>
      <div className={s.sectionHeader}>
        <span className={s.sectionLabel}>
          <Play size={12} />
          Highlights
        </span>
        <h2 className={s.sectionTitle}>Match Highlights & Videos</h2>
        <p className={s.sectionDescription}>
          Find highlights for recent matches. Click to search YouTube.
        </p>
        <button
          onClick={loadHighlights}
          disabled={loading}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold text-white/50 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-300">
          {error}
        </div>
      )}

      <div className={s.leagueFilter}>
        {leagues.map((league) => (
          <button
            key={league}
            onClick={() => setActiveLeague(league)}
            className={`${s.leagueButton} ${activeLeague === league ? s.leagueButtonActive : ""}`}
          >
            {league}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={s.highlightsGrid}>
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className={s.highlightsGrid}>
          {filteredHighlights.map((h) => (
            <HighlightCard key={h.id} highlight={h} onPlay={setSelectedHighlight} />
          ))}
        </div>
      )}

      {filteredHighlights.length === 0 && !loading && (
        <div className={s.emptyState}>
          {highlights.length === 0
            ? "No recent matches found."
            : "No highlights available for this league."}
        </div>
      )}

      <VideoModal highlight={selectedHighlight} onClose={() => setSelectedHighlight(null)} />
    </section>
  );
}
