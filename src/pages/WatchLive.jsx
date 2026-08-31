import { useState, useEffect, useCallback, useRef } from "react";
import {
  RefreshCw,
  Search,
  ExternalLink,
  Radio,
  Clock,
  Trophy,
  Calendar,
  Filter,
  Tv,
  AlertCircle,
} from "lucide-react";
import { watchLiveStyles as s } from "../assets/dummyStyles";
import {
  fetchTodayMatches,
  fetchTodayMatchesFresh,
  getMatchScore,
  getMatchStatus,
  getMatchLeague,
  getTeamLogo,
  getMatchValue,
  COMPETITIONS,
} from "../services/footballApi";

const LIVE_STREAM_URL = "https://live.epicsports.in/";
const REPLAY_URL = "https://www.dotsport.site/home_2";

const STATUS_FILTERS = [
  { id: "all", label: "All", icon: Filter },
  { id: "live", label: "Live", icon: Radio },
  { id: "upcoming", label: "Upcoming", icon: Clock },
  { id: "finished", label: "Finished", icon: Trophy },
];

function isLive(m) {
  return /live|in_play|paused|1H|2H|HT|ET/i.test(getMatchStatus(m));
}
function isUpcoming(m) {
  const st = getMatchStatus(m);
  return /timed|scheduled|tbd|ns/i.test(st) && !isLive(m);
}
function isFinished(m) {
  return /finished|ft|full_time/i.test(getMatchStatus(m));
}

function getStatusType(m) {
  if (isLive(m)) return "live";
  if (isFinished(m)) return "finished";
  return "upcoming";
}

function formatKickoff(m) {
  const d = getMatchValue(m, ["utcDate", "date"], "");
  if (!d) return "";
  try {
    const dt = new Date(d);
    return dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function TeamBadge({ src, name, size = "md" }) {
  const sizes = { sm: "size-8", md: "size-11", lg: "size-14" };
  return (
    <div className={`${s.teamBadgeBase} ${sizes[size]}`}>
      {src ? (
        <img src={src} alt={name} className={s.teamBadgeImg} />
      ) : (
        <span className="text-[10px]">{(name || "?").slice(0, 2).toUpperCase()}</span>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className={s.skeletonCard}>
      <div className="mb-4 h-3 w-1/3 animate-pulse rounded bg-white/10" />
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex flex-col items-center gap-2">
          <div className="size-11 animate-pulse rounded-full bg-white/10" />
          <div className="h-2 w-16 animate-pulse rounded bg-white/10" />
        </div>
        <div className="h-8 w-16 animate-pulse rounded-xl bg-white/10" />
        <div className="flex flex-col items-center gap-2">
          <div className="size-11 animate-pulse rounded-full bg-white/10" />
          <div className="h-2 w-16 animate-pulse rounded bg-white/10" />
        </div>
      </div>
      <div className="mt-4 h-9 w-full animate-pulse rounded-full bg-white/10" />
    </div>
  );
}

function MatchCard({ match }) {
  const status = getMatchStatus(match);
  const league = getMatchLeague(match);
  const score = getMatchScore(match);
  const homeName = getMatchValue(match, ["homeTeam.name", "home.name", "home_team.name"], "Home");
  const awayName = getMatchValue(match, ["awayTeam.name", "away.name", "away_team.name"], "Away");
  const homeLogo = getTeamLogo(match, "home");
  const awayLogo = getTeamLogo(match, "away");
  const kickoff = formatKickoff(match);
  const type = getStatusType(match);

  return (
    <div className={s.matchCard}>
      {/* Live glow */}
      {type === "live" && <div className={s.liveGlow} />}

      {/* Header */}
      <div className={s.cardHeader}>
        <span className={s.leagueText}>{league}</span>
        {kickoff && type === "upcoming" && <span className={s.kickoffTime}>{kickoff}</span>}
        <span
          className={`${s.statusBadge} ${
            type === "live"
              ? s.statusBadgeLive
              : type === "finished"
              ? s.statusBadgeFinished
              : s.statusBadgeUpcoming
          }`}
        >
          {type === "live" && <span className="live-dot size-1.5 rounded-full bg-red-500" />}
          {type === "live" ? "LIVE" : type === "finished" ? "FT" : kickoff || "NS"}
        </span>
      </div>

      {/* Teams + Score */}
      <div className={s.teamsGrid}>
        <div className={s.teamColumn}>
          <TeamBadge src={homeLogo} name={homeName} size="md" />
          <span className={s.teamName}>{homeName}</span>
        </div>
        <div className={s.scoreBox}>
          {score.hasScore ? (
            <span className={s.scoreText}>
              {score.home}
              <span className={s.colon}> : </span>
              {score.away}
            </span>
          ) : (
            <span className={s.vsText}>VS</span>
          )}
        </div>
        <div className={s.teamColumn}>
          <TeamBadge src={awayLogo} name={awayName} size="md" />
          <span className={s.teamName}>{awayName}</span>
        </div>
      </div>

      {/* Card footer - only Live Stream and Watch Replay */}
      <div className={s.cardFooter}>
        {type === "live" ? (
          <a
            href={LIVE_STREAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={s.watchLiveButton}
          >
            <Tv size={14} />
            Live Stream
            <ExternalLink size={10} />
          </a>
        ) : type === "finished" ? (
          <a
            href={REPLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={s.watchReplayButton}
          >
            <Tv size={14} />
            Watch Replay
            <ExternalLink size={10} />
          </a>
        ) : null}

        {/* External links row */}
        <div className="mt-2 flex gap-2">
          <a
            href={LIVE_STREAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-600/15 px-2 py-1.5 text-[9px] font-bold text-blue-400 transition hover:bg-blue-600/25 sm:text-[10px]"
          >
            EpicSports <ExternalLink size={8} />
          </a>
          <a
            href={REPLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-purple-600/15 px-2 py-1.5 text-[9px] font-bold text-purple-400 transition hover:bg-purple-600/25 sm:text-[10px]"
          >
            Dotsport <ExternalLink size={8} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function WatchLive() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [leagueFilter, setLeagueFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastRefresh, setLastRefresh] = useState(null);
  const pollRef = useRef(null);

  const loadMatches = useCallback(async (fresh = false) => {
    try {
      const data = fresh ? await fetchTodayMatchesFresh() : await fetchTodayMatches();
      setMatches(data);
      setLastRefresh(new Date());
      setError(null);
    } catch (e) {
      console.error("Failed to load matches:", e);
      setError("Failed to load matches. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  // Auto-refresh every 30s if there are live matches
  useEffect(() => {
    const hasLive = matches.some((m) => isLive(m));
    if (hasLive) {
      pollRef.current = setInterval(() => loadMatches(true), 30000);
    }
    return () => clearInterval(pollRef.current);
  }, [matches, loadMatches]);

  const liveCount = matches.filter(isLive).length;
  const upcomingCount = matches.filter(isUpcoming).length;

  const filtered = matches.filter((m) => {
    if (statusFilter === "live" && !isLive(m)) return false;
    if (statusFilter === "upcoming" && !isUpcoming(m)) return false;
    if (statusFilter === "finished" && !isFinished(m)) return false;
    if (leagueFilter !== "all") {
      const league = getMatchLeague(m);
      const comp = Object.values(COMPETITIONS).find((c) => c.id === leagueFilter);
      if (comp && !league.toLowerCase().includes(comp.name.toLowerCase())) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const home = getMatchValue(m, ["homeTeam.name", "home.name"], "").toLowerCase();
      const away = getMatchValue(m, ["awayTeam.name", "away.name"], "").toLowerCase();
      const league = getMatchLeague(m).toLowerCase();
      if (!home.includes(q) && !away.includes(q) && !league.includes(q)) return false;
    }
    return true;
  });

  const leagueKeys = Object.keys(COMPETITIONS);

  return (
    <div className={s.page}>
      <div className={s.container}>
        {/* External links notice */}
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-blue-500/10 bg-blue-500/5 p-4">
          <AlertCircle size={16} className="shrink-0 text-blue-400" />
          <p className="text-[10px] text-white/40 sm:text-xs">
            External streaming links are third-party services. We do not host or scrape streams.{" "}
            <a href={LIVE_STREAM_URL} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              EpicSports
            </a>{" "}
            ·{" "}
            <a href={REPLAY_URL} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
              Dotsport
            </a>
          </p>
        </div>

        {/* Header */}
        <div className={s.header}>
          <div className={s.headerTop}>
            <div>
              <span className={s.headerLabel}>
                <Tv size={10} /> Watch Live
              </span>
              <h1 className={s.headerTitle}>Live Football Matches</h1>
              <p className={s.headerDescription}>
                Watch live football streams from leagues around the world
              </p>
            </div>
            <div className={s.headerStats}>
              {liveCount > 0 && (
                <span className={s.liveCountBadge}>
                  <span className="live-dot size-1.5 rounded-full bg-red-500" /> {liveCount} Live
                </span>
              )}
              {upcomingCount > 0 && (
                <span className={s.upcomingBadge}>{upcomingCount} Upcoming</span>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className={s.controls}>
          <div className="flex flex-wrap gap-3">
            {/* Status filter */}
            <div className={s.filterRow}>
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`${s.filterButton} ${statusFilter === f.id ? s.filterButtonActive : ""}`}
                >
                  <f.icon size={10} /> {f.label}
                  {f.id === "live" && liveCount > 0 && (
                    <span className="ml-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[8px] text-white">
                      {liveCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* League filter */}
            <div className={s.leagueFilterRow}>
              <button
                onClick={() => setLeagueFilter("all")}
                className={`${s.leagueButton} ${leagueFilter === "all" ? s.leagueButtonActive : ""}`}
              >
                All
              </button>
              {leagueKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => setLeagueFilter(key)}
                  className={`${s.leagueButton} ${leagueFilter === key ? s.leagueButtonActive : ""}`}
                >
                  {COMPETITIONS[key].name}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className={s.searchWrapper}>
            <span className={s.searchIcon}><Search size={14} /></span>
            <input
              type="text"
              placeholder="Search teams or leagues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={s.searchInput}
            />
          </div>
        </div>

        {/* Refresh row */}
        <div className={s.refreshRow}>
          <span className={s.matchCount}>
            {filtered.length} match{filtered.length !== 1 ? "es" : ""}
            {lastRefresh && ` · Updated ${lastRefresh.toLocaleTimeString()}`}
          </span>
          <button
            onClick={() => { setLoading(true); loadMatches(true); }}
            disabled={loading}
            className={s.refreshButton}
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && <div className={s.errorBanner}>{error}</div>}

        {/* Loading */}
        {loading && (
          <div className={s.loadingGrid}>
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Matches grid */}
        {!loading && (
          <>
            {filtered.length > 0 ? (
              <div className={s.matchesGrid}>
                {filtered.map((m, i) => (
                  <MatchCard key={getMatchValue(m, ["id"], i)} match={m} />
                ))}
              </div>
            ) : (
              <div className={s.emptyState}>
                <p className="text-lg font-bold text-white/20">No matches found</p>
                <p className="mt-1 text-sm text-white/30">
                  {searchQuery ? "Try a different search" : "No matches match your filters"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
