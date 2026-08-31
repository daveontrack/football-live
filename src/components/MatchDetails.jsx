import { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  Clock,
  History,
  Shield,
  Loader2,
} from "lucide-react";
import {
  fetchMatchStatistics,
  fetchMatchLineups,
  fetchMatchTimeline,
  fetchHeadToHead,
  getMatchScore,
  getMatchStatus,
  getMatchLeague,
  getTeamLogo,
  getMatchValue,
} from "../services/footballApi";

// ─── TAB NAVIGATION ────────────────────────────────────────
const TABS = [
  { id: "stats", label: "Statistics", icon: BarChart3 },
  { id: "lineups", label: "Lineups", icon: Users },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "h2h", label: "Head-to-Head", icon: History },
];

function TabNav({ active, onChange }) {
  return (
    <div className="mb-6 flex gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/5 p-1 scrollbar-hide">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-[10px] font-bold transition sm:text-xs ${
              active === tab.id
                ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg"
                : "text-white/50 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon size={12} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── LOADING STATE ─────────────────────────────────────────
function LoadingState({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-8">
      <Loader2 size={24} className="animate-spin text-red-400" />
      <p className="text-xs font-bold text-white/40">{text}</p>
    </div>
  );
}

// ─── STATISTICS TAB ────────────────────────────────────────
function StatisticsTab({ matchId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchMatchStatistics(matchId)
      .then((d) => { if (active) setStats(d); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [matchId]);

  if (loading) return <LoadingState text="Loading statistics..." />;
  if (!stats || stats.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-white/5 p-8 text-center">
        <BarChart3 size={32} className="mx-auto mb-3 text-white/10" />
        <p className="text-sm font-bold text-white/30">No statistics available</p>
        <p className="mt-1 text-xs text-white/20">Statistics are available during and after live matches</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {stats.map((stat, i) => {
        const homeVal = stat.home ?? stat.homeTeam ?? "0";
        const awayVal = stat.away ?? stat.awayTeam ?? "0";
        const label = stat.name || stat.type || stat.group || "Unknown";
        const homeNum = parseFloat(homeVal) || 0;
        const awayNum = parseFloat(awayVal) || 0;
        const total = homeNum + awayNum;
        const homePct = total > 0 ? (homeNum / total) * 100 : 50;

        return (
          <div key={i} className="rounded-xl bg-white/5 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-white">{homeVal}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">{label}</span>
              <span className="text-sm font-bold text-white">{awayVal}</span>
            </div>
            <div className="flex gap-1">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-700"
                  style={{ width: `${homePct}%` }}
                />
              </div>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="ml-auto h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-700"
                  style={{ width: `${100 - homePct}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── LINEUPS TAB ───────────────────────────────────────────
function LineupsTab({ matchId }) {
  const [lineups, setLineups] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchMatchLineups(matchId)
      .then((d) => { if (active) setLineups(d); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [matchId]);

  if (loading) return <LoadingState text="Loading lineups..." />;
  if (!lineups) {
    return (
      <div className="rounded-2xl border border-white/5 bg-white/5 p-8 text-center">
        <Users size={32} className="mx-auto mb-3 text-white/10" />
        <p className="text-sm font-bold text-white/30">No lineup data available</p>
        <p className="mt-1 text-xs text-white/20">Lineups are typically announced 1 hour before kickoff</p>
      </div>
    );
  }

  const homeLineup = lineups.homeTeam || lineups[0];
  const awayLineup = lineups.awayTeam || lineups[1];

  return (
    <div className="space-y-6">
      {/* Home Team */}
      {homeLineup && (
        <LineupTeam
          team={homeLineup}
          side="home"
        />
      )}

      {/* Away Team */}
      {awayLineup && (
        <LineupTeam
          team={awayLineup}
          side="away"
        />
      )}
    </div>
  );
}

function LineupTeam({ team, side }) {
  const formation = team.formation || "4-3-3";
  const players = team.lineup || team.startEleven || [];

  // Group players by position for formation view
  const gk = players.filter((p) => (p.position || "").includes("Goalkeeper"));
  const defenders = players.filter((p) => (p.position || "").includes("Defender"));
  const midfielders = players.filter((p) => (p.position || "").includes("Midfield"));
  const forwards = players.filter((p) => (p.position || "").includes("Forward"));

  const rows = [gk, defenders, midfielders, forwards].filter((r) => r.length > 0);

  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-black text-white">{team.team?.name || team.name || "Team"}</h3>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white/60">{formation}</span>
      </div>

      {/* Pitch visualization */}
      <div className="relative mb-4 overflow-hidden rounded-xl border border-green-500/20 bg-gradient-to-b from-green-900/30 to-green-900/10 p-4">
        {/* Pitch lines */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-full w-px bg-white/5" />
          <div className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
        </div>

        {rows.map((row, rowIdx) => {
          return (
            <div key={rowIdx} className="relative mb-3 flex justify-center gap-2 last:mb-0">
              {row.map((player, pIdx) => (
                <div key={pIdx} className="flex flex-col items-center gap-1">
                  <div className={`grid size-8 place-items-center rounded-full text-[8px] font-black sm:size-10 sm:text-[9px] ${
                    side === "home" ? "bg-red-500/80 text-white" : "bg-blue-500/80 text-white"
                  }`}>
                    {player.shirtNumber || player.jerseyNumber || "?"}
                  </div>
                  <span className="max-w-[60px] truncate text-[8px] font-bold text-white/60 sm:text-[9px]">
                    {player.player?.name?.split(" ").pop() || player.name?.split(" ").pop() || "?"}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Bench */}
      {team.bench && team.bench.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-white/30">Substitutes ({team.bench.length})</p>
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
            {team.bench.map((player, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1.5">
                <span className="text-[9px] font-bold text-white/30">{player.shirtNumber || player.jerseyNumber || "?"}</span>
                <span className="truncate text-[10px] font-semibold text-white/60">{player.player?.name || player.name || "?"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coach */}
      {team.coach?.name && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
          <Shield size={12} className="text-white/30" />
          <span className="text-[10px] font-bold text-white/50">Coach: {team.coach.name}</span>
        </div>
      )}
    </div>
  );
}

// ─── TIMELINE TAB ──────────────────────────────────────────
function TimelineTab({ matchId, match }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchMatchTimeline(matchId)
      .then((d) => { if (active) setEvents(d || []); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [matchId]);

  if (loading) return <LoadingState text="Loading timeline..." />;

  // If no API events, generate from match score
  const displayEvents = events.length > 0 ? events : generateEventsFromMatch(match);

  if (displayEvents.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-white/5 p-8 text-center">
        <Clock size={32} className="mx-auto mb-3 text-white/10" />
        <p className="text-sm font-bold text-white/30">No events yet</p>
        <p className="mt-1 text-xs text-white/20">Events will appear as the match progresses</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10" />

      <div className="space-y-1">
        {displayEvents.map((event, i) => (
          <TimelineEvent key={i} event={event} index={i} />
        ))}
      </div>
    </div>
  );
}

function TimelineEvent({ event }) {
  const minute = event.minute || event.time?.elapsed || 0;
  const type = (event.type || event.detail || "").toLowerCase();
  const player = event.player?.name || event.playerName || "";
  const team = event.team?.name || event.teamName || "";

  const isGoal = type.includes("goal");
  const isYellow = type.includes("yellow");
  const isRed = type.includes("red");
  const isSub = type.includes("substitution");

  const icon = isGoal ? "⚽" : isYellow ? "🟨" : isRed ? "🟥" : isSub ? "🔄" : "📋";
  const color = isGoal ? "text-green-400" : isYellow ? "text-yellow-400" : isRed ? "text-red-400" : isSub ? "text-blue-400" : "text-white/40";

  return (
    <div className="relative flex items-start gap-3 pl-2 py-2">
      {/* Minute badge */}
      <div className="relative z-10 grid size-6 shrink-0 place-items-center rounded-full bg-[#0a0a0a] text-[9px] font-bold text-white/50 ring-1 ring-white/10">
        {minute}'
      </div>

      {/* Event content */}
      <div className="flex-1 rounded-xl bg-white/5 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className={`text-xs font-bold ${color}`}>{player}</span>
        </div>
        <p className="mt-0.5 text-[10px] text-white/30">{team}</p>
        {isSub && event.assist && (
          <p className="mt-0.5 text-[10px] text-white/20">↔ {event.assist?.name || ""}</p>
        )}
      </div>
    </div>
  );
}

function generateEventsFromMatch(match) {
  if (!match) return [];
  const score = getMatchScore(match);
  if (!score.hasScore) return [];

  const homeGoals = parseInt(score.home) || 0;
  const awayGoals = parseInt(score.away) || 0;
  const totalGoals = homeGoals + awayGoals;

  if (totalGoals === 0) return [];

  // Generate placeholder events
  const events = [];
  for (let i = 0; i < totalGoals; i++) {
    const isHome = i < homeGoals;
    events.push({
      minute: Math.floor(Math.random() * 80) + 10,
      type: "Goal",
      detail: "Goal",
      player: { name: `Goal ${i + 1}` },
      team: { name: isHome ? getMatchValue(match, ["homeTeam.name", "home.name"], "Home") : getMatchValue(match, ["awayTeam.name", "away.name"], "Away") },
    });
  }
  return events.sort((a, b) => a.minute - b.minute);
}

// ─── HEAD-TO-HEAD TAB ──────────────────────────────────────
function HeadToHeadTab({ match }) {
  const [h2h, setH2h] = useState([]);
  const [loading, setLoading] = useState(true);

  const homeId = getMatchValue(match, ["homeTeam.id"], null);
  const awayId = getMatchValue(match, ["awayTeam.id"], null);
  const homeName = getMatchValue(match, ["homeTeam.name", "home.name"], "Home");
  const awayName = getMatchValue(match, ["awayTeam.name", "away.name"], "Away");

  useEffect(() => {
    if (!homeId || !awayId) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    fetchHeadToHead(homeId, awayId)
      .then((d) => { if (active) setH2h(d || []); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [homeId, awayId]);

  if (loading) return <LoadingState text="Loading head-to-head..." />;

  if (h2h.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-white/5 p-8 text-center">
        <History size={32} className="mx-auto mb-3 text-white/10" />
        <p className="text-sm font-bold text-white/30">No head-to-head data</p>
        <p className="mt-1 text-xs text-white/20">Previous meetings between these teams will appear here</p>
      </div>
    );
  }

  // Calculate stats
  let homeWins = 0, awayWins = 0, draws = 0;
  h2h.forEach((m) => {
    const s = getMatchScore(m);
    if (!s.hasScore) return;
    const h = parseInt(s.home) || 0;
    const a = parseInt(s.away) || 0;
    const isHomeVenue = m.homeTeam?.id === homeId;
    if (h > a) isHomeVenue ? homeWins++ : awayWins++;
    else if (a > h) isHomeVenue ? awayWins++ : homeWins++;
    else draws++;
  });

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-red-500/10 p-3">
          <p className="text-xl font-black text-red-400">{homeWins}</p>
          <p className="text-[10px] font-bold text-white/40">{homeName}</p>
        </div>
        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-xl font-black text-white/60">{draws}</p>
          <p className="text-[10px] font-bold text-white/40">Draws</p>
        </div>
        <div className="rounded-xl bg-blue-500/10 p-3">
          <p className="text-xl font-black text-blue-400">{awayWins}</p>
          <p className="text-[10px] font-bold text-white/40">{awayName}</p>
        </div>
      </div>

      {/* Matches */}
      <div className="space-y-2">
        {h2h.map((m, i) => {
          const s = getMatchScore(m);
          const date = getMatchValue(m, ["utcDate", "date"], "");
          const formattedDate = date ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
          const league = getMatchLeague(m);

          return (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
              <span className="w-16 text-center text-[10px] font-bold text-white/30">{formattedDate}</span>
              <div className="flex flex-1 items-center justify-between gap-2">
                <span className="truncate text-xs font-bold text-white/70">
                  {getMatchValue(m, ["homeTeam.name", "home.name"], "Home")}
                </span>
                <span className="shrink-0 rounded-lg bg-white/10 px-2 py-1 text-xs font-black text-white">
                  {s.hasScore ? s.display : "vs"}
                </span>
                <span className="truncate text-right text-xs font-bold text-white/70">
                  {getMatchValue(m, ["awayTeam.name", "away.name"], "Away")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────
export default function MatchDetails({ match, onClose }) {
  const [activeTab, setActiveTab] = useState("stats");

  const matchId = getMatchValue(match, ["id", "eventId", "fixture.id"], "");
  const homeName = getMatchValue(match, ["homeTeam.name", "home.name"], "Home");
  const awayName = getMatchValue(match, ["awayTeam.name", "away.name"], "Away");
  const league = getMatchLeague(match);
  const score = getMatchScore(match);
  const status = getMatchStatus(match);
  const homeLogo = getTeamLogo(match, "home");
  const awayLogo = getTeamLogo(match, "away");

  if (!match) return null;

  return (
    <div className="animate-backdrop fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 py-6 backdrop-blur-sm" onClick={onClose}>
      <div className="animate-modal-enter max-h-[88svh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#111] text-white sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-white/5 bg-[#111]/90 px-5 py-4 backdrop-blur-xl sm:px-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-red-400">{league}</p>
            <button onClick={onClose} className="grid size-8 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 animate-press">✕</button>
          </div>

          {/* Match summary */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              {homeLogo && <img src={homeLogo} alt="" className="size-8 rounded-full" />}
              <span className="text-sm font-black">{homeName}</span>
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-1.5 text-sm font-black">
              {score.hasScore ? score.display : status}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black">{awayName}</span>
              {awayLogo && <img src={awayLogo} alt="" className="size-8 rounded-full" />}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <TabNav active={activeTab} onChange={setActiveTab} />

          {activeTab === "stats" && <StatisticsTab matchId={matchId} />}
          {activeTab === "lineups" && <LineupsTab matchId={matchId} />}
          {activeTab === "timeline" && <TimelineTab matchId={matchId} match={match} />}
          {activeTab === "h2h" && <HeadToHeadTab match={match} />}
        </div>
      </div>
    </div>
  );
}
