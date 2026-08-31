import { useState, useEffect } from "react";
import {
  BarChart3,
  Shirt,
  Star,
  Target,
  TrendingUp,
  Search,
  RefreshCw,
} from "lucide-react";
import { playerStyles as s } from "../assets/dummyStyles";
import { fetchTopScorers, COMPETITIONS } from "../services/footballApi";

const LEAGUE_TABS = ["PL", "PD", "BL1", "SA", "FL1"];
const positions = ["All", "Forward", "Midfielder", "Defender", "Goalkeeper"];

function StatBar({ label, value, max = 100, color = "red" }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className={s.statBarRow}>
      <span className={s.statBarLabel}>{label}</span>
      <div className={s.statBarTrack}>
        <div
          className={`${s.statBarFill} ${color === "green" ? s.statBarGreen : color === "yellow" ? s.statBarYellow : s.statBarRed}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={s.statBarValue}>{value}</span>
    </div>
  );
}

function PlayerCard({ player, onClick }) {
  return (
    <div className={s.playerCard} onClick={() => onClick(player)}>
      <div className={s.playerImageWrapper}>
        {player.teamLogo ? (
          <img src={player.teamLogo} alt={player.team} className={s.playerImage} />
        ) : (
          <div className="flex size-full items-center justify-center bg-white/5 text-2xl font-black text-white/20">
            {player.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className={s.playerNumber}>#{player.position === "Goalkeeper" ? 1 : player.goals > 10 ? 9 : 8}</div>
      </div>
      <div className={s.playerInfo}>
        <h3 className={s.playerName}>{player.name}</h3>
        <p className={s.playerTeam}>{player.team}</p>
        <div className={s.playerTags}>
          <span className={s.positionTag}>{player.position || "Forward"}</span>
          <span className={s.nationalityTag}>{player.nationality}</span>
        </div>
        <div className={s.quickStats}>
          <div className={s.quickStat}>
            <span className={s.quickStatValue}>{player.goals}</span>
            <span className={s.quickStatLabel}>Goals</span>
          </div>
          <div className={s.quickStat}>
            <span className={s.quickStatValue}>{player.assists}</span>
            <span className={s.quickStatLabel}>Assists</span>
          </div>
          <div className={s.quickStat}>
            <span className={s.quickStatValue}>{player.playedMatches}</span>
            <span className={s.quickStatLabel}>Matches</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerDetail({ player, onClose }) {
  if (!player) return null;
  return (
    <div className={s.detailBackdrop} onClick={onClose}>
      <div className={s.detailPanel} onClick={(e) => e.stopPropagation()}>
        <div className={s.detailHeader}>
          <div className={s.detailPlayerInfo}>
            {player.teamLogo ? (
              <img src={player.teamLogo} alt={player.team} className={s.detailImage} />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-full border-2 border-white/10 bg-white/10 text-xl font-black text-white/30 sm:size-20">
                {player.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className={s.detailName}>{player.name}</h2>
              <p className={s.detailTeam}>{player.team}</p>
              <div className={s.detailTags}>
                <span className={s.detailPosition}>{player.position || "Forward"}</span>
                <span className={s.detailNationality}>{player.nationality}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className={s.closeButton}>✕</button>
        </div>

        <div className={s.statsGrid}>
          {[
            [Target, player.goals, "Goals"],
            [TrendingUp, player.assists, "Assists"],
            [Shirt, player.playedMatches, "Matches"],
            [Star, player.penalties, "Penalties"],
          ].map(([Icon, val, label]) => (
            <div key={label} className={s.statCard}>
              <Icon size={20} className={s.statIcon} />
              <span className={s.statValue}>{val}</span>
              <span className={s.statLabel}>{label}</span>
            </div>
          ))}
        </div>

        <div className={s.detailStatsSection}>
          <h3 className={s.detailStatsTitle}>Performance Breakdown</h3>
          <StatBar label="Goals" value={player.goals} max={40} color="red" />
          <StatBar label="Assists" value={player.assists} max={20} color="green" />
          <StatBar label="Matches" value={player.playedMatches} max={40} color="yellow" />
          <StatBar label="Yellow Cards" value={player.yellowCards} max={10} color="yellow" />
          <StatBar label="Red Cards" value={player.redCards} max={5} color="red" />
          <StatBar label="Penalties" value={player.penalties} max={10} color="green" />
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
        <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
        <div className="h-2 w-1/2 animate-pulse rounded bg-white/10" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-10 animate-pulse rounded bg-white/10" />
          <div className="h-10 animate-pulse rounded bg-white/10" />
          <div className="h-10 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export default function PlayerStats() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLeague, setActiveLeague] = useState("PL");
  const [selectedPosition, setSelectedPosition] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Load players for a SINGLE league (fast — 1 API call)
  const loadPlayers = async (league = activeLeague) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTopScorers(league);
      setPlayers(data);
    } catch (err) {
      setError(err.message);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers(activeLeague);
  }, [activeLeague]);

  const filteredPlayers = players.filter((p) => {
    const matchesPosition = selectedPosition === "All" || (p.position || "").includes(selectedPosition);
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.team.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPosition && matchesSearch;
  });

  return (
    <section id="players" className={s.section}>
      <div className={s.sectionHeader}>
        <span className={s.sectionLabel}>
          <BarChart3 size={12} />
          Player Hub
        </span>
        <h2 className={s.sectionTitle}>Player Stats & Profiles</h2>
        <p className={s.sectionDescription}>
          Real-time top scorers from Europe&apos;s top leagues.
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
            className={`rounded-full px-3 py-1.5 text-[10px] font-bold transition sm:text-xs ${
              activeLeague === code
                ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg"
                : "text-white/50 hover:bg-white/10 hover:text-white"
            }`}
          >
            {COMPETITIONS[code]?.name || code}
          </button>
        ))}
        <button
          onClick={() => loadPlayers(activeLeague)}
          disabled={loading}
          className="ml-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold text-white/50 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
        >
          <RefreshCw size={10} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className={s.controls}>
        <div className={s.positionFilter}>
          {positions.map((pos) => (
            <button
              key={pos}
              onClick={() => setSelectedPosition(pos)}
              className={`${s.positionButton} ${selectedPosition === pos ? s.positionButtonActive : ""}`}
            >
              {pos}
            </button>
          ))}
        </div>
        <div className={s.searchWrapper}>
          <Search size={16} className={s.searchIcon} />
          <input
            type="text"
            placeholder="Search players or teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={s.searchInput}
          />
        </div>
      </div>

      {loading ? (
        <div className={s.playersGrid}>
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className={s.playersGrid}>
          {filteredPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} onClick={setSelectedPlayer} />
          ))}
        </div>
      )}

      {!loading && filteredPlayers.length === 0 && (
        <div className={s.emptyState}>
          {players.length === 0
            ? "No player data available for this league."
            : "No players found matching your criteria."}
        </div>
      )}

      <PlayerDetail player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
    </section>
  );
}
