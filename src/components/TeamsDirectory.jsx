import { useState, useEffect } from "react";
import {
  Globe,
  MapPin,
  Shield,
  Users,
  Star,
  Trophy,
  ChevronRight,
  Search,
  RefreshCw,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { teamsStyles as s } from "../assets/dummyStyles";
import { fetchCompetitionTeams, COMPETITIONS } from "../services/footballApi";

const LEAGUE_TABS = Object.keys(COMPETITIONS);

function TeamCard({ team, onClick }) {
  return (
    <div className={s.teamCard} onClick={() => onClick(team)}>
      <div className={s.cardHeader}>
        {team.crest ? (
          <img src={team.crest} alt={team.name} className={s.teamLogo} />
        ) : (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[10px] font-black text-white/30 sm:size-14">
            {team.shortName?.slice(0, 3).toUpperCase() || team.name.slice(0, 3).toUpperCase()}
          </div>
        )}
        <div className={s.cardHeaderInfo}>
          <h3 className={s.teamName}>{team.name}</h3>
          <p className={s.teamLeague}>{team.competitionName || team.country}</p>
        </div>
        <ChevronRight size={18} className={s.chevron} />
      </div>
      <div className={s.cardStats}>
        {team.founded && (
          <div className={s.cardStat}>
            <Calendar size={14} />
            <span>Est. {team.founded}</span>
          </div>
        )}
        {team.venue && (
          <div className={s.cardStat}>
            <MapPin size={14} />
            <span className="truncate">{team.venue}</span>
          </div>
        )}
        {team.squad && (
          <div className={s.cardStat}>
            <Users size={14} />
            <span>{team.squad.length} players</span>
          </div>
        )}
      </div>
      {team.coach?.name && (
        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-white/40">
          <Shield size={10} />
          <span>Coach: {team.coach.name}</span>
        </div>
      )}
    </div>
  );
}

function TeamDetail({ team, onClose }) {
  if (!team) return null;
  return (
    <div className={s.detailBackdrop} onClick={onClose}>
      <div className={s.detailPanel} onClick={(e) => e.stopPropagation()}>
        <div className={s.detailHeader}>
          <div className={s.detailTeamInfo}>
            {team.crest ? (
              <img src={team.crest} alt={team.name} className={s.detailLogo} />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-full border-2 border-white/10 bg-white/10 text-lg font-black text-white/30 sm:size-20">
                {team.shortName?.slice(0, 3).toUpperCase() || team.name.slice(0, 3).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className={s.detailName}>{team.name}</h2>
              <p className={s.detailLeague}>{team.competitionName || team.country}</p>
            </div>
          </div>
          <button onClick={onClose} className={s.closeButton}>✕</button>
        </div>

        <div className={s.infoGrid}>
          {[
            [MapPin, "Stadium", team.venue || "Unknown"],
            [Users, "Squad", `${team.squad?.length || 0} players`],
            [Calendar, "Founded", team.founded || "Unknown"],
            [Shield, "Coach", team.coach?.name || "Unknown"],
          ].map(([Icon, label, val]) => (
            <div key={label} className={s.infoCard}>
              <Icon size={18} className={s.infoIcon} />
              <span className={s.infoValue}>{val}</span>
              <span className={s.infoLabel}>{label}</span>
            </div>
          ))}
        </div>

        {team.squad && team.squad.length > 0 && (
          <div className="mt-6 rounded-2xl bg-white/5 p-4 sm:p-5">
            <h3 className={s.sectionSubtitle}>Squad ({team.squad.length})</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {team.squad.slice(0, 12).map((player) => (
                <div key={player.id || player.name} className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[9px] font-black text-white/50">
                    {player.position?.charAt(0) || "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-white">{player.name}</p>
                    <p className="text-[10px] text-white/40">{player.position || "Player"} · {player.nationality || ""}</p>
                  </div>
                </div>
              ))}
            </div>
            {team.squad.length > 12 && (
              <p className="mt-2 text-center text-[10px] text-white/30">
                + {team.squad.length - 12} more players
              </p>
            )}
          </div>
        )}

        {team.website && (
          <a
            href={team.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-xs font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <ExternalLink size={14} />
            Visit Official Website
          </a>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass-card animate-pulse overflow-hidden rounded-2xl p-5 sm:rounded-3xl sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="size-12 animate-pulse rounded-full bg-white/10 sm:size-14" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
          <div className="h-2 w-1/3 animate-pulse rounded bg-white/10" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-2 w-full animate-pulse rounded bg-white/10" />
        <div className="h-2 w-3/4 animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}

export default function TeamsDirectory() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLeague, setActiveLeague] = useState("PL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Load teams for a SINGLE league (fast — 1 API call)
  const loadTeams = async (league = activeLeague) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCompetitionTeams(league);
      setTeams(data);
    } catch (err) {
      setError(err.message);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams(activeLeague);
  }, [activeLeague]);

  const filteredTeams = teams.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.shortName || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <section id="teams" className={s.section}>
      <div className={s.sectionHeader}>
        <span className={s.sectionLabel}>
          <Shield size={12} />
          Teams
        </span>
        <h2 className={s.sectionTitle}>Teams Directory</h2>
        <p className={s.sectionDescription}>
          Browse teams from Europe&apos;s top leagues and Champions League.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-300">
          {error}
        </div>
      )}

      {/* League tabs — click to load that league (1 API call) */}
      <div className="mb-6 flex flex-wrap justify-center gap-1">
        {LEAGUE_TABS.map((code) => (
          <button
            key={code}
            onClick={() => setActiveLeague(code)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold transition sm:text-xs ${
              activeLeague === code
                ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg"
                : "text-white/50 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Shield size={10} />
            <span className="hidden min-[420px]:inline">{COMPETITIONS[code]?.name || code}</span>
            <span className="min-[420px]:hidden">{code}</span>
          </button>
        ))}
        <button
          onClick={() => loadTeams(activeLeague)}
          disabled={loading}
          className="ml-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold text-white/50 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
        >
          <RefreshCw size={10} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className={s.controls}>
        <div className={s.searchWrapper}>
          <Search size={16} className={s.searchIcon} />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={s.searchInput}
          />
        </div>
      </div>

      {loading ? (
        <div className={s.teamsGrid}>
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className={s.teamsGrid}>
          {filteredTeams.map((team) => (
            <TeamCard key={team.id} team={team} onClick={setSelectedTeam} />
          ))}
        </div>
      )}

      {!loading && filteredTeams.length === 0 && (
        <div className={s.emptyState}>
          {teams.length === 0
            ? "No team data available for this league."
            : "No teams found matching your search."}
        </div>
      )}

      <TeamDetail team={selectedTeam} onClose={() => setSelectedTeam(null)} />
    </section>
  );
}
