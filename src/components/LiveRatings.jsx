import { useState, useEffect, useCallback } from "react";
import {
  Star,
  TrendingUp,
  Users,
  RefreshCw,
  Clock,
  Zap,
  Shield,
} from "lucide-react";
import { generateLiveRatings, getRatingColor, getRatingLabel, getRatingBarColor } from "../services/liveRatings";
import { fetchTodayMatches, getMatchStatus, getMatchLeague, COMPETITIONS } from "../services/footballApi";

function PlayerRow({ player, showTeam }) {
  const barColor = getRatingBarColor(player.rating);
  const color = getRatingColor(player.rating);

  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2 transition hover:bg-white/8">
      {/* Number */}
      <span className="w-6 text-center text-xs font-bold text-white/30">#{player.number}</span>

      {/* Name + Position */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold text-white sm:text-sm">{player.name}</p>
        <p className="text-[10px] text-white/40">{player.position}</p>
      </div>

      {/* Rating bar */}
      <div className="hidden w-24 sm:block">
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700`}
            style={{ width: `${(player.rating / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Rating */}
      <div className="flex flex-col items-center">
        <span
          className="text-sm font-black sm:text-base"
          style={{ color }}
        >
          {player.rating.toFixed(1)}
        </span>
        <span className="text-[8px] text-white/30">{player.ratingLabel}</span>
      </div>
    </div>
  );
}

function TeamRatings({ title, logo, ratings, avgRating, isHome }) {
  return (
    <div className="flex-1">
      {/* Team header */}
      <div className="mb-3 flex items-center gap-2">
        {logo ? (
          <img src={logo} alt="" className="size-6 rounded-full" />
        ) : (
          <div className="flex size-6 items-center justify-center rounded-full bg-white/10 text-[8px] font-bold text-white/50">
            {title.slice(0, 2)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold text-white sm:text-sm">{title}</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1">
          <Star size={10} className="text-yellow-400" />
          <span className="text-xs font-black text-white">{avgRating}</span>
        </div>
      </div>

      {/* Player list */}
      <div className="space-y-1">
        {ratings.map((player) => (
          <PlayerRow key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}

function MatchRatingsCard({ matchRatings, isActive }) {
  return (
    <div className={`rounded-2xl border p-4 transition sm:rounded-3xl sm:p-5 ${
      isActive
        ? "border-red-500/30 bg-gradient-to-br from-red-900/20 to-[#111]"
        : "border-white/5 bg-white/5"
    }`}>
      {/* Match header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {matchRatings.isLive && (
            <span className="flex items-center gap-1.5 rounded-full bg-red-500/20 px-2 py-0.5 text-[9px] font-bold text-red-400">
              <span className="live-dot size-1.5 rounded-full bg-red-500" />
              {matchRatings.minute}'
            </span>
          )}
          <span className="text-[10px] font-bold uppercase text-white/40">{matchRatings.league}</span>
        </div>
        <span className="text-xs font-bold text-white/60">{matchRatings.score}</span>
      </div>

      {/* Teams + Average ratings */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex items-center gap-2">
          {matchRatings.homeLogo ? (
            <img src={matchRatings.homeLogo} alt="" className="size-8 rounded-full" />
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full bg-white/10 text-[9px] font-bold text-white/50">
              {matchRatings.homeTeam.slice(0, 2)}
            </div>
          )}
          <div>
            <p className="text-xs font-bold text-white">{matchRatings.homeTeam}</p>
            <p className="text-[10px] text-white/40">Avg: {matchRatings.avgHomeRating}</p>
          </div>
        </div>

        <div className="flex-1 text-center">
          <span className="text-lg font-black text-white/20">VS</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs font-bold text-white">{matchRatings.awayTeam}</p>
            <p className="text-[10px] text-white/40">Avg: {matchRatings.avgAwayRating}</p>
          </div>
          {matchRatings.awayLogo ? (
            <img src={matchRatings.awayLogo} alt="" className="size-8 rounded-full" />
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full bg-white/10 text-[9px] font-bold text-white/50">
              {matchRatings.awayTeam.slice(0, 2)}
            </div>
          )}
        </div>
      </div>

      {/* Player ratings by team */}
      <div className="grid gap-4 lg:grid-cols-2">
        <TeamRatings
          title={matchRatings.homeTeam}
          logo={matchRatings.homeLogo}
          ratings={matchRatings.homeRatings}
          avgRating={matchRatings.avgHomeRating}
          isHome
        />
        <TeamRatings
          title={matchRatings.awayTeam}
          logo={matchRatings.awayLogo}
          ratings={matchRatings.awayRatings}
          avgRating={matchRatings.avgAwayRating}
          isHome={false}
        />
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/5 bg-white/5 p-4 sm:rounded-3xl sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
        <div className="h-3 w-10 animate-pulse rounded bg-white/10" />
      </div>
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="size-8 animate-pulse rounded-full bg-white/10" />
          <div className="space-y-1"><div className="h-2 w-20 animate-pulse rounded bg-white/10" /><div className="h-1.5 w-12 animate-pulse rounded bg-white/10" /></div>
        </div>
        <div className="flex-1 text-center"><div className="mx-auto h-4 w-8 animate-pulse rounded bg-white/10" /></div>
        <div className="flex items-center gap-2">
          <div className="space-y-1 text-right"><div className="h-2 w-20 animate-pulse rounded bg-white/10" /><div className="h-1.5 w-12 animate-pulse rounded bg-white/10" /></div>
          <div className="size-8 animate-pulse rounded-full bg-white/10" />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {[0, 1].map((t) => (
          <div key={t} className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2">
                <div className="h-3 w-5 animate-pulse rounded bg-white/10" />
                <div className="h-3 flex-1 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-8 animate-pulse rounded bg-white/10" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const RATING_LEAGUES = [
  { id: "all", name: "All Leagues" },
  ...Object.values(COMPETITIONS).map((c) => ({ id: c.id, name: c.name })),
];

export default function LiveRatings() {
  const [matchRatingsList, setMatchRatingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMatchId, setActiveMatchId] = useState(null);
  const [activeLeague, setActiveLeague] = useState("all");
  const [lastUpdate, setLastUpdate] = useState(null);

  const loadRatings = useCallback(async () => {
    try {
      const matches = await fetchTodayMatches();
      const liveMatches = matches.filter((m) =>
        /live|in_play|paused|1H|2H|HT|ET/i.test(getMatchStatus(m))
      );

      if (liveMatches.length === 0) {
        // Show ratings for upcoming/recent matches if no live matches
        const featured = matches.slice(0, 3);
        const ratings = await Promise.all(featured.map((m) => generateLiveRatings(m)));
        setMatchRatingsList(ratings);
      } else {
        const ratings = await Promise.all(liveMatches.map((m) => generateLiveRatings(m)));
        setMatchRatingsList(ratings);
        if (!activeMatchId && ratings.length > 0) {
          setActiveMatchId(ratings[0].matchId);
        }
      }
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Failed to load ratings:", err);
    } finally {
      setLoading(false);
    }
  }, [activeMatchId]);

  useEffect(() => {
    loadRatings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh every 30s for live matches
  useEffect(() => {
    const hasLive = matchRatingsList.some((r) => r.isLive);
    if (hasLive) {
      const interval = setInterval(loadRatings, 30000);
      return () => clearInterval(interval);
    }
  }, [matchRatingsList, loadRatings]);

  return (
    <section id="live-ratings" className="mb-16 sm:mb-24">
      {/* Section header */}
      <div className="mb-8 flex flex-col items-center gap-3 text-center sm:mb-12">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-red-400 sm:px-4 sm:text-[11px]">
          <Zap size={12} /> Live Ratings
        </span>
        <h2 className="text-2xl font-black text-white sm:text-3xl lg:text-4xl">Player Ratings</h2>
        <p className="max-w-xl text-sm text-white/50 sm:text-base">
          Real-time player performance ratings during live matches
        </p>
        <div className="mt-2 flex items-center gap-3">
          <button
            onClick={loadRatings}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold text-white/50 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <RefreshCw size={10} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          {lastUpdate && (
            <span className="text-[10px] text-white/30">
              Updated {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* League filter */}
      <div className="mb-6 flex flex-wrap justify-center gap-1">
        {RATING_LEAGUES.map((league) => (
          <button
            key={league.id}
            onClick={() => {
              setActiveLeague(league.id);
              setActiveMatchId(null);
            }}
            className={`rounded-full px-3 py-1.5 text-[10px] font-bold transition sm:text-xs ${
              activeLeague === league.id
                ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg"
                : "text-white/50 hover:bg-white/10 hover:text-white"
            }`}
          >
            {league.name}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}



      {/* Filtered ratings */}
      {!loading && (() => {
        const filtered = matchRatingsList.filter((r) => {
          if (activeMatchId && r.matchId !== activeMatchId) return false;
          if (activeLeague !== "all") {
            const comp = Object.values(COMPETITIONS).find((c) => c.id === activeLeague);
            if (comp && !r.league.toLowerCase().includes(comp.name.toLowerCase())) return false;
          }
          return true;
        });

        return (
          <div className="space-y-4">
            {/* Match selector tabs */}
            {filtered.length > 1 && (
              <div className="mb-4 flex flex-wrap justify-center gap-2">
                {filtered.map((r) => (
                  <button
                    key={r.matchId}
                    onClick={() => setActiveMatchId(r.matchId)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold transition sm:text-xs ${
                      activeMatchId === r.matchId
                        ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg"
                        : "text-white/50 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {r.isLive && <span className="live-dot size-1.5 rounded-full bg-red-500" />}
                    {r.homeTeam} vs {r.awayTeam}
                  </button>
                ))}
              </div>
            )}

            {filtered.map((r) => (
              <MatchRatingsCard
                key={r.matchId}
                matchRatings={r}
                isActive={r.matchId === activeMatchId}
              />
            ))}

            {filtered.length === 0 && (
              <div className="rounded-2xl border border-white/5 bg-white/5 p-8 text-center">
                <Zap size={32} className="mx-auto mb-3 text-white/10" />
                <p className="text-sm font-bold text-white/20">No matches for this league</p>
              </div>
            )}
          </div>
        );
      })()}



      {/* Rating legend */}
      {!loading && matchRatingsList.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[10px] text-white/30">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-green-500" /> Excellent (8.0+)
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-blue-500" /> Good (7.0+)
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-yellow-500" /> Average (6.0+)
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-orange-500" /> Below Avg (5.0+)
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-red-500" /> Poor (&lt;5.0)
          </span>
        </div>
      )}
    </section>
  );
}
