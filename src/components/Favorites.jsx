import { useState, useEffect } from "react";
import {
  Heart,
  Trash2,
  Bell,
  BellOff,
  Search,
  Shield,
  RefreshCw,
  Tv,
  ExternalLink,
} from "lucide-react";
import { favoritesStyles as s } from "../assets/dummyStyles";
import { useFavorites } from "../context/FavoritesContext";
import {
  fetchTodayMatches,
  getMatchScore,
  getMatchStatus,
  getMatchLeague,
  getTeamLogo,
  getMatchValue,
} from "../services/footballApi";

const LIVE_STREAM_URL = "https://live.epicsports.in/";
const REPLAY_URL = "https://www.dotsport.site/home_2";

const teamNamePaths = {
  home: ["homeTeam.name", "home.name", "teams.home.name"],
  away: ["awayTeam.name", "away.name", "teams.away.name"],
};

function extractMatchData(match) {
  const home = getMatchValue(match, teamNamePaths.home);
  const away = getMatchValue(match, teamNamePaths.away);
  const score = getMatchScore(match);
  const status = getMatchStatus(match);
  const league = getMatchLeague(match);
  const homeLogo = getTeamLogo(match, "home");
  const awayLogo = getTeamLogo(match, "away");
  const matchId = getMatchValue(match, ["id", "eventId", "fixture.id"]) || `${home}-${away}`;
  const isLive = /live|in_play|paused|1H|2H|HT|ET/i.test(status);

  return { matchId, home, away, score, status, league, homeLogo, awayLogo, isLive };
}

function MatchFavoriteCard({ match, onRemove, onToggleNotify, notify }) {
  const { matchId, home, away, score, status, league, homeLogo, awayLogo, isLive } =
    extractMatchData(match);

  return (
    <div className={`${s.matchCard} card-glow-hover`}>
      <div className={s.matchCardHeader}>
        <span className={s.matchLeague}>{league}</span>
        <div className={s.matchActions}>
          <button
            onClick={() => onToggleNotify("match", matchId)}
            className={s.notifyButton}
            title={notify ? "Mute notifications" : "Get notified"}
          >
            {notify ? (
              <Bell size={14} className={s.bellActive} />
            ) : (
              <BellOff size={14} />
            )}
          </button>
          <button
            onClick={() => onRemove(matchId)}
            className={s.removeButton}
            title="Remove from favorites"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div className={s.matchTeams}>
        <div className={s.matchTeam}>
          {homeLogo ? (
            <img src={homeLogo} alt={home} className={s.teamLogo} />
          ) : (
            <div className={s.teamLogoFallback}>{home.slice(0, 3).toUpperCase()}</div>
          )}
          <span className={s.teamName}>{home}</span>
        </div>
        <div className={s.matchScore}>
          {isLive && <span className={s.liveDot} />}
          <span className={s.scoreText}>
            {score.hasScore ? score.display : status}
          </span>
        </div>
        <div className={s.matchTeam}>
          {awayLogo ? (
            <img src={awayLogo} alt={away} className={s.teamLogo} />
          ) : (
            <div className={s.teamLogoFallback}>{away.slice(0, 3).toUpperCase()}</div>
          )}
          <span className={s.teamName}>{away}</span>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className={s.matchDate}>{status}</p>
        {isLive ? (
          <a
            href={LIVE_STREAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-1 text-[9px] font-bold text-red-400 transition hover:bg-red-500/30"
          >
            <Tv size={10} /> Live <ExternalLink size={8} />
          </a>
        ) : (
          <a
            href={REPLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-2 py-1 text-[9px] font-bold text-blue-400 transition hover:bg-blue-500/25"
          >
            <Tv size={10} /> Replay <ExternalLink size={8} />
          </a>
        )}
      </div>
    </div>
  );
}function TeamFavoriteCard({ teamName, onRemove, onToggleNotify, notify, allMatches }) {
  const teamMatch = allMatches.find((m) => {
    const home = getMatchValue(m, teamNamePaths.home);
    const away = getMatchValue(m, teamNamePaths.away);
    return home === teamName || away === teamName;
  });

  const logo = teamMatch
    ? getTeamLogo(
        teamMatch,
        getMatchValue(teamMatch, teamNamePaths.home) === teamName ? "home" : "away"
      )
    : "";

  const matchCount = allMatches.filter((m) => {
    const home = getMatchValue(m, teamNamePaths.home);
    const away = getMatchValue(m, teamNamePaths.away);
    return home === teamName || away === teamName;
  }).length;

  return (
    <div className={`${s.teamCard} card-glow-hover`}>
      <div className={s.teamCardActions}>
        <button
          onClick={() => onToggleNotify("team", teamName)}
          className={s.notifyButton}
          title={notify ? "Mute" : "Notify"}
        >
          {notify ? <Bell size={14} className={s.bellActive} /> : <BellOff size={14} />}
        </button>
        <button onClick={() => onRemove(teamName)} className={s.removeButton} title="Remove">
          <Trash2 size={14} />
        </button>
      </div>
      {logo ? (
        <img src={logo} alt={teamName} className={s.teamCardLogo} />
      ) : (
        <div className={`${s.teamCardLogo} flex items-center justify-center bg-white/10 text-sm font-black text-white`}>
          {teamName.slice(0, 3).toUpperCase()}
        </div>
      )}
      <h4 className={s.teamCardName}>{teamName}</h4>
      <p className={s.teamCardLeague}>
        {matchCount > 0 ? `${matchCount} match${matchCount > 1 ? "es" : ""}` : "Following"}
      </p>
    </div>
  );
}

export default function Favorites() {
  const {
    favorites,
    toggleMatch,
    toggleTeam,
    isMatchFavorited,
    isTeamFavorited,
    toggleNotify,
    isNotified,
    removeMatch,
    removeTeam,
  } = useFavorites();

  const [activeTab, setActiveTab] = useState("matches");
  const [filterText, setFilterText] = useState("");
  const [allMatches, setAllMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  // Fetch matches using the centralized API (with rate limiter + cache)
  useEffect(() => {
    let active = true;
    async function load() {
      setLoadingMatches(true);
      try {
        const matches = await fetchTodayMatches();
        if (active) setAllMatches(matches);
      } catch {
        if (active) setAllMatches([]);
      } finally {
        if (active) setLoadingMatches(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  // Resolve favorite match IDs to full match objects
  const favoriteMatches = favorites.matchIds
    .map((id) => allMatches.find((m) => String(m.id || m.eventId) === String(id)))
    .filter(Boolean);

  const filteredMatches = favoriteMatches.filter((m) => {
    if (!filterText) return true;
    const q = filterText.toLowerCase();
    const home = getMatchValue(m, teamNamePaths.home).toLowerCase();
    const away = getMatchValue(m, teamNamePaths.away).toLowerCase();
    return home.includes(q) || away.includes(q);
  });

  const filteredTeams = favorites.teamNames.filter((name) =>
    !filterText || name.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalFavorites = favorites.matchIds.length + favorites.teamNames.length;

  return (
    <section id="favorites" className={s.section}>
      <div className={s.sectionHeader}>
        <span className={s.sectionLabel}>
          <Heart size={12} />
          My Favorites
        </span>
        <h2 className={s.sectionTitle}>Favorites & Watchlist</h2>
        <p className={s.sectionDescription}>
          {totalFavorites > 0
            ? `You're following ${favorites.matchIds.length} match${favorites.matchIds.length !== 1 ? "es" : ""} and ${favorites.teamNames.length} team${favorites.teamNames.length !== 1 ? "s" : ""}`
            : "Click the heart on any match or team to add it to your favorites."}
        </p>
      </div>

      {totalFavorites > 0 && (
        <div className={s.controls}>
          <div className={s.tabBar}>
            <button
              onClick={() => setActiveTab("matches")}
              className={`${s.tab} ${activeTab === "matches" ? s.tabActive : ""}`}
            >
              <Heart size={12} /> Matches ({favorites.matchIds.length})
            </button>
            <button
              onClick={() => setActiveTab("teams")}
              className={`${s.tab} ${activeTab === "teams" ? s.tabActive : ""}`}
            >
              <Shield size={12} /> Teams ({favorites.teamNames.length})
            </button>
          </div>
          <div className={s.searchWrapper}>
            <span className={s.searchIcon}><Search size={14} /></span>
            <input
              type="text"
              placeholder="Search favorites..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className={s.searchInput}
            />
          </div>
        </div>
      )}

      {totalFavorites === 0 ? (
        <div className={s.emptyState}>
          <Heart size={48} className={s.emptyIcon} />
          <p className="text-sm font-bold text-white/20">No favorite matches yet</p>
          <p className={s.emptyHint}>
            Click the ❤️ on any match in Match Center, Live Scores, or Fixtures to add it here.
          </p>
        </div>
      ) : activeTab === "matches" ? (
        filteredMatches.length > 0 ? (
          <div className={s.matchesGrid}>
            {filteredMatches.map((match) => {
              const { matchId } = extractMatchData(match);
              return (
                <MatchFavoriteCard
                  key={matchId}
                  match={match}
                  onRemove={removeMatch}
                  onToggleNotify={toggleNotify}
                  notify={isNotified("match", matchId)}
                />
              );
            })}
          </div>
        ) : (
          <div className={s.emptyState}>
            <p className="text-sm font-bold text-white/20">
              {filterText ? `No matches matching "${filterText}"` : "No favorite matches yet"}
            </p>
          </div>
        )
      ) : (
        filteredTeams.length > 0 ? (
          <div className={s.teamsGrid}>
            {filteredTeams.map((teamName) => (
              <TeamFavoriteCard
                key={teamName}
                teamName={teamName}
                onRemove={removeTeam}
                onToggleNotify={toggleNotify}
                notify={isNotified("team", teamName)}
                allMatches={allMatches}
              />
            ))}
          </div>
        ) : (
          <div className={s.emptyState}>
            <p className="text-sm font-bold text-white/20">
              {filterText ? `No teams matching "${filterText}"` : "No favorite teams yet"}
            </p>
          </div>
        )
      )}
    </section>
  );
}
