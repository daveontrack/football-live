import { useState } from "react";
import { liveScoreCardStyles as s } from "../assets/dummyStyles";
import {
  getMatchLeague,
  getMatchScore,
  getMatchStatus,
  getMatchValue,
  getTeamLogo,
} from "../services/footballApi";
import { useFavorites } from "../context/FavoritesContext";
import { Heart, BarChart3 } from "lucide-react";
import MatchDetails from "./MatchDetails";

const teamNamePaths = {
  home: ["home.name", "homeTeam.name", "teams.home.name", "homeTeam", "home"],
  away: ["away.name", "awayTeam.name", "teams.away.name", "awayTeam", "away"],
};

function TeamLogo({ logo, name }) {
  return (
    <div className={s.teamLogoContainer}>
      {logo ? (
        <img src={logo} alt={`${name} logo`} className={s.teamLogoImg} />
      ) : (
        name.slice(0, 3).toUpperCase()
      )}
    </div>
  );
}

export default function LiveScoreCard({ match }) {
  const [showDetails, setShowDetails] = useState(false);
  const { isMatchFavorited, toggleMatch, isTeamFavorited, toggleTeam } = useFavorites();
  const matchId = getMatchValue(match, ["id", "eventId", "fixture.id"]) || `${getMatchValue(match, teamNamePaths.home)}-${getMatchValue(match, teamNamePaths.away)}`;
  const favorited = isMatchFavorited(matchId);

  const homeTeam = getMatchValue(match, teamNamePaths.home);
  const awayTeam = getMatchValue(match, teamNamePaths.away);
  const homeLogo = getTeamLogo(match, "home");
  const awayLogo = getTeamLogo(match, "away");
  const homeScore = getMatchScore(match).home;
  const awayScore = getMatchScore(match).away;
  const league = getMatchLeague(match);
  const matchTime = getMatchStatus(match);

  return (
    <article className={`${s.card} card-glow-hover`}>
      <div className={`${s.glowRed} transition-all duration-500 group-hover:bg-red-500/25`} />
      <div className={`${s.glowBlue} transition-all duration-500 group-hover:bg-blue-500/15`} />

      {/* Header */}
      <div className={s.header}>
        <p className={s.leagueText}>{league}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleMatch(matchId)}
            className={`grid size-7 place-items-center rounded-full transition animate-press ${favorited ? "animate-heart-beat" : ""}`}
            style={{ background: favorited ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.1)" }}
            title={favorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={12} className={favorited ? "text-red-400" : "text-white/40"} fill={favorited ? "currentColor" : "none"} />
          </button>
          <div className={`${s.liveBadge} animate-pulse-glow`}>
            <span className={s.liveDot} />
            <span className={s.liveText}>Live</span>
          </div>
        </div>
      </div>

      {/* Teams + Score */}
      <div className={s.teamsGrid}>
        <div className={s.teamColumn}>
          <TeamLogo logo={homeLogo} name={homeTeam} />
          <button
            type="button"
            onClick={() => toggleTeam(homeTeam)}
            className={`text-center transition hover:text-red-400 ${isTeamFavorited(homeTeam) ? "text-red-400" : ""}`}
            title={isTeamFavorited(homeTeam) ? "Unfollow team" : "Follow team"}
          >
            <span className={s.teamName}>{homeTeam}</span>
          </button>
        </div>

        <div className={s.scoreBox}>
          <p className={s.scoreText}>
            {homeScore}
            <span className={s.colon}>:</span>
            {awayScore}
          </p>
        </div>

        <div className={s.teamColumn}>
          <TeamLogo logo={awayLogo} name={awayTeam} />
          <button
            type="button"
            onClick={() => toggleTeam(awayTeam)}
            className={`text-center transition hover:text-red-400 ${isTeamFavorited(awayTeam) ? "text-red-400" : ""}`}
            title={isTeamFavorited(awayTeam) ? "Unfollow team" : "Follow team"}
          >
            <span className={s.teamName}>{awayTeam}</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className={s.divider} />
      <div className="mt-3 flex items-center justify-between">
        <p className={s.footerText}>{matchTime}</p>
        <button
          type="button"
          onClick={() => setShowDetails(true)}
          className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-[9px] font-bold text-white/40 transition hover:bg-white/10 hover:text-white"
        >
          <BarChart3 size={10} /> Details
        </button>
      </div>

      {showDetails && <MatchDetails match={match} onClose={() => setShowDetails(false)} />}
    </article>
  );
}
