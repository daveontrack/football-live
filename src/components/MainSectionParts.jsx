import { useState } from "react";
import {
  BarChart3,
  CalendarDays,
  Clock,
  Eye,
  Heart,
  ExternalLink,
  MapPin,
  Radio,
  Search,
  Shield,
  Trophy,
  X,
  Tv,
} from "lucide-react";
import LiveScoreCard from "./LiveScoreCard";
import {
  getMatchEventId,
  getMatchLeague,
  getMatchScore,
  getMatchStatus,
  getMatchValue,
  getTeamLogo,
  COMPETITIONS,
} from "../services/footballApi";
import { getTeams, timingPaths } from "./MainSectionUtils";
import { mainSectionStyles as s } from "../assets/dummyStyles";
import { useFavorites } from "../context/FavoritesContext";

const LIVE_STREAM_URL = "https://live.epicsports.in/";
const REPLAY_URL = "https://www.dotsport.site/home_2";

const statusChecks = {
  live: ["live", "in_play", "paused", "1H", "2H", "HT", "ET"],
  finished: ["FINISHED", "FT", "AET", "PEN"],
};

function getStatusKind(match) {
  const status = getMatchStatus(match).toUpperCase();
  if (statusChecks.live.some((w) => status.includes(w))) return "live";
  if (statusChecks.finished.some((w) => status.includes(w))) return "finished";
  return "upcoming";
}

function getScheduleStatus(match, offset) {
  return getMatchStatus(match, "") || (offset < 0 ? "Result pending" : "Scheduled");
}

function getSummary(matches) {
  return matches.reduce((counts, match) => {
    counts[getStatusKind(match)] += 1;
    return counts;
  }, { live: 0, finished: 0, upcoming: 0 });
}

function SectionTitle({ label, title, icon: Icon }) {
  return (
    <div className={s.sectionTitleWrapper}>
      <span className={s.sectionTitleLabel}>
        {Icon && <Icon size={12} />}
        {label}
      </span>
      <h2 className={s.sectionTitleH2}>{title}</h2>
    </div>
  );
}

function TeamBadge({ logo, name, size = "md" }) {
  const sizeClass = {
    sm: s.teamBadgeSizeSm,
    md: s.teamBadgeSizeMd,
    lg: s.teamBadgeSizeLg,
  }[size];

  return (
    <div className={`${s.teamBadgeBase} ${sizeClass}`}>
      {logo ? (
        <img src={logo} alt={`${name} logo`} className={s.teamBadgeImg} />
      ) : (
        name.slice(0, 3).toUpperCase()
      )}
    </div>
  );
}

function TeamColumn({ match, side, name, badgeSize, className, nameClass, nameTag: Name = "span" }) {
  return (
    <div className={className}>
      <TeamBadge logo={getTeamLogo(match, side)} name={name} size={badgeSize} />
      <Name className={nameClass}>{name}</Name>
    </div>
  );
}

function MatchTeams({
  match,
  badgeSize = "md",
  centerClass = "flex justify-center",
  columnClass,
  gridClass,
  nameTag,
  scoreClass,
  teamClass,
  vsClass,
}) {
  const teams = getTeams(match);
  const score = getMatchScore(match);

  return (
    <div className={gridClass}>
      <TeamColumn
        match={match}
        side="home"
        name={teams.home}
        badgeSize={badgeSize}
        className={columnClass}
        nameClass={teamClass}
        nameTag={nameTag}
      />
      <div className={centerClass}>
        <span className={score.hasScore ? scoreClass : vsClass}>{score.display}</span>
      </div>
      <TeamColumn
        match={match}
        side="away"
        name={teams.away}
        badgeSize={badgeSize}
        className={columnClass}
        nameClass={teamClass}
        nameTag={nameTag}
      />
    </div>
  );
}

function FeaturedMatch({ match, loading, summary, onViewMatch }) {
  if (!match) {
    return (
      <div className="py-12 text-center">
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <p className="text-sm text-white/40">Loading match center...</p>
          </div>
        ) : (
          <p className="text-sm text-white/40">No match data available.</p>
        )}
      </div>
    );
  }

  const status = getMatchStatus(match);
  const statusKind = getStatusKind(match);
  const summaryText = summary.live
    ? `${summary.live} live now`
    : `${summary.finished} final, ${summary.upcoming} upcoming`;

  return (
    <div className="relative">
      <div className={s.featuredTopline}>
        <div className={s.featuredStatus}>
          {statusKind === "live" && <div className={s.featuredLiveDot} />}
          <p className={s.featuredStatusText}>{status}</p>
        </div>
        {/* View button - opens external streaming site */}
        <a
          href={statusKind === "live" ? LIVE_STREAM_URL : REPLAY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={s.featuredViewButton}
        >
          <Tv size={14} />
          {statusKind === "live" ? "Watch Live" : statusKind === "finished" ? "Watch Replay" : "View"}
          <ExternalLink size={10} />
        </a>
      </div>

      <MatchTeams
        match={match}
        badgeSize="lg"
        centerClass="flex flex-col items-center gap-1"
        columnClass={s.featuredTeamColumn}
        gridClass={s.featuredTeamsGrid}
        nameTag="p"
        scoreClass={s.featuredScore}
        teamClass={s.featuredTeamName}
        vsClass={s.featuredVs}
      />

      <div className={s.featuredInsightGrid}>
        {[
          [Trophy, getMatchLeague(match)],
          [Clock, getMatchValue(match, timingPaths, "Kickoff TBC")],
          [BarChart3, summaryText],
        ].map(([Icon, text]) => (
          <div key={text} className={s.featuredInsightItem}>
            <Icon size={15} />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchCenterStats({ matches, summary }) {
  return (
    <div className={s.matchCenterStatsGrid}>
      {[
        ["Tracked", matches.length],
        ["Live", summary.live],
        ["Finals", summary.finished],
        ["Upcoming", summary.upcoming],
      ].map(([label, value]) => (
        <div key={label} className={s.matchCenterStatCard}>
          <span className={s.matchCenterStatValue}>{value}</span>
          <span className={s.matchCenterStatLabel}>{label}</span>
        </div>
      ))}
    </div>
  );
}

function SideMatchCard({ match, onViewMatch }) {
  const teams = getTeams(match);
  const score = getMatchScore(match);
  const statusKind = getStatusKind(match);

  return (
    <div className={s.sideMatchCard}>
      <div className={s.sideMatchBadges}>
        {["home", "away"].map((side) => (
          <TeamBadge key={side} logo={getTeamLogo(match, side)} name={teams[side]} size="sm" />
        ))}
      </div>
      <div className={s.sideMatchInfo}>
        <p className={s.sideMatchTitle}>
          {teams.home} vs {teams.away}
        </p>
        <p className={s.sideMatchLeague}>{getMatchLeague(match)}</p>
      </div>
      {statusKind === "live" ? (
        <a
          href={LIVE_STREAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-1 text-[9px] font-bold text-red-400 transition hover:bg-red-500/30"
        >
          <Tv size={10} /> Live
        </a>
      ) : (
        <button type="button" className={s.sideMatchStatus} onClick={() => onViewMatch(match, getMatchStatus(match))}>
          {score.hasScore ? score.display : getMatchStatus(match)}
        </button>
      )}
    </div>
  );
}

export function MatchCenter({ matches, loading, onViewMatch }) {
  const summary = getSummary(matches);

  return (
    <section id="match-center" className={s.matchCenterSection}>
      <SectionTitle label="Featured" title="Match Center" icon={Shield} />
      <div className={s.matchCenterGrid}>
        <div className={s.featuredCard}>
          <div className={s.featuredCardGlow1} />
          <div className={s.featuredCardGlow2} />
          <FeaturedMatch match={matches[0]} loading={loading} summary={summary} onViewMatch={onViewMatch} />
        </div>

        <div className={s.sideMatchesGrid}>
          <MatchCenterStats matches={matches} summary={summary} />
          {loading && !matches.length ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="glass-card animate-pulse rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 animate-pulse rounded-full bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
                    <div className="h-2 w-1/2 animate-pulse rounded bg-white/10" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            matches.slice(1, 5).map((match, index) => (
              <SideMatchCard key={match.id || index} match={match} onViewMatch={onViewMatch} />
            ))
          )}
          {!matches.length && !loading && (
            <div className={s.sideEmpty}>No matches available.</div>
          )}
        </div>
      </div>
    </section>
  );
}

export function MatchDetailsPanel({ selection, location, onClose }) {
  if (!selection?.match) return null;

  const { match, statusLabel } = selection;
  const teams = getTeams(match);
  const score = getMatchScore(match);
  const eventId = getMatchEventId(match);
  const statusKind = getStatusKind(match);

  return (
    <div className={s.matchDialogBackdrop} role="dialog" aria-modal="true">
      <div className={s.matchDialog}>
        <div className={s.matchDialogHeader}>
          <div>
            <p className={s.matchDialogKicker}>{getMatchLeague(match)}</p>
            <h3 className={s.matchDialogTitle}>
              {teams.home} vs {teams.away}
            </h3>
          </div>
          <HeartButton match={selection.match} size={16} />
          <button type="button" className={s.matchDialogClose} onClick={onClose} aria-label="Close match details">
            <X size={18} />
          </button>
        </div>

        <div className={s.matchDialogScoreGrid}>
          <TeamColumn match={match} side="home" name={teams.home} badgeSize="lg" className={s.matchDialogTeam} />
          <div className={s.matchDialogScore}>
            <span>{score.display}</span>
            <small>{statusLabel || getMatchStatus(match)}</small>
          </div>
          <TeamColumn match={match} side="away" name={teams.away} badgeSize="lg" className={s.matchDialogTeam} />
        </div>

        <div className={s.matchDialogFacts}>
          {[
            [MapPin, location],
            [Clock, getMatchValue(match, timingPaths, "Kickoff TBC")],
            eventId && [Eye, `Event ${eventId}`],
          ].filter(Boolean).map(([Icon, text]) => (
            <div key={text} className={s.matchDialogFact}>
              <Icon size={16} />
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* External redirect buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          {statusKind === "live" ? (
            <a
              href={LIVE_STREAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-red-500/30 transition hover:shadow-red-500/50"
            >
              <Tv size={14} /> Live Stream <ExternalLink size={10} />
            </a>
          ) : statusKind === "finished" ? (
            <a
              href={REPLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-blue-500/50"
            >
              <Tv size={14} /> Watch Replay <ExternalLink size={10} />
            </a>
          ) : null}
          <a
            href={LIVE_STREAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-purple-600/20 px-3 py-1.5 text-[10px] font-bold text-purple-400 transition hover:bg-purple-600/30"
          >
            <ExternalLink size={12} /> EpicSports
          </a>
          <a
            href={REPLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/20 px-3 py-1.5 text-[10px] font-bold text-blue-400 transition hover:bg-blue-600/30"
          >
            <ExternalLink size={12} /> Dotsport
          </a>
        </div>
      </div>
    </div>
  );
}

export function LiveScores({ matches, loading, empty }) {
  return (
    <section id="live-scores" className={s.liveSection}>
      <SectionTitle label="Live Now" title="Live Scores" icon={Radio} />
      <div className={s.liveGrid}>
        {loading && !matches.length ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="glass-card animate-pulse rounded-3xl p-6">
              <div className="mb-4 h-3 w-1/3 animate-pulse rounded bg-white/10" />
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <div className="flex flex-col items-center gap-2"><div className="size-12 animate-pulse rounded-full bg-white/10" /><div className="h-2 w-14 animate-pulse rounded bg-white/10" /></div>
                <div className="h-10 w-20 animate-pulse rounded-xl bg-white/10" />
                <div className="flex flex-col items-center gap-2"><div className="size-12 animate-pulse rounded-full bg-white/10" /><div className="h-2 w-14 animate-pulse rounded bg-white/10" /></div>
              </div>
            </div>
          ))
        ) : matches.length ? (
          matches.slice(0, 6).map((match, index) => (
            <LiveScoreCard key={match.id || index} match={match} />
          ))
        ) : (
          empty("No live matches right now.", loading)
        )}
      </div>
    </section>
  );
}

// ─── STANDINGS with league selector ────────────────────────
const STANDINGS_LEAGUES = [
  { id: "PL", name: "Premier League" },
  { id: "PD", name: "La Liga" },
  { id: "BL1", name: "Bundesliga" },
  { id: "SA", name: "Serie A" },
  { id: "FL1", name: "Ligue 1" },
  { id: "CL", name: "Champions League" },
];

function StandingsRow({ row, index }) {
  const teamName = getMatchValue(row, ["team.name", "team.shortName", "name"]);
  const teamCrest = getMatchValue(row, ["team.crest", "team.logo"]);
  const played = row.playedGames || row.played || 0;
  const won = row.won || 0;
  const draw = row.draw || 0;
  const lost = row.lost || 0;
  const points = row.points || 0;
  const gf = row.goalsFor || row.goals?.for || 0;
  const ga = row.goalsAgainst || row.goals?.against || 0;
  const gd = row.goalDifference || (gf - ga);

  // Dynamic Google search URL
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(teamName)}`;

  // Highlight zones
  const isTop = index < 4;
  const isBottom = index >= 17;

  return (
    <div className={`${s.standingsRow} ${isTop ? "bg-green-500/5" : ""} ${isBottom ? "bg-red-500/5" : ""}`}>
      <span className={`${s.standingsRank} ${isTop ? "text-green-400" : ""} ${isBottom ? "text-red-400" : ""}`}>
        {index + 1}
      </span>
      <div className={s.standingsTeamInfo}>
        <div className="flex items-center gap-2">
          {/* Clickable team logo */}
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/logo flex size-6 shrink-0 items-center justify-center rounded-full transition hover:scale-110 hover:ring-2 hover:ring-red-500/30"
            title={`Search ${teamName} on Google`}
          >
            {teamCrest ? (
              <img src={teamCrest} alt={`${teamName} logo`} className="size-5 rounded-full" />
            ) : (
              <span className="flex size-5 items-center justify-center rounded-full bg-white/10 text-[8px] font-bold text-white/50">
                {teamName.slice(0, 2).toUpperCase()}
              </span>
            )}
          </a>
          {/* Clickable team name */}
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/name inline-flex items-center gap-1 transition hover:text-red-400"
            title={`Search ${teamName} on Google`}
          >
            <p className={`${s.standingsTeamName} transition group-hover/name:text-red-400`}>{teamName}</p>
            <svg className="size-3 shrink-0 text-white/0 transition group-hover/name:text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
        <p className={s.standingsTeamMeta}>{won}W {draw}D {lost}L · GF {gf} · GA {ga} · GD {gd > 0 ? "+" : ""}{gd}</p>
      </div>
      <div className="flex items-center gap-4 text-center">
        <span className="w-6 text-xs font-semibold text-white/60">{played}</span>
        <span className="w-6 text-xs font-semibold text-green-400">{won}</span>
        <span className="w-6 text-xs font-semibold text-yellow-400">{draw}</span>
        <span className="w-6 text-xs font-semibold text-red-400">{lost}</span>
        <span className="w-8 text-xs font-bold text-white/70">{gd > 0 ? "+" : ""}{gd}</span>
        <span className="w-8 text-sm font-black text-white">{points}</span>
      </div>
    </div>
  );
}

export function Standings({ standings, loading, empty, activeLeague, setActiveLeague }) {
  return (
    <section id="standings" className={s.standingsSection}>
      <SectionTitle label="Standings" title="League Standings" icon={Trophy} />

      {/* League selector */}
      <div className="mb-6 flex flex-wrap justify-center gap-1">
        {STANDINGS_LEAGUES.map((league) => (
          <button
            key={league.id}
            onClick={() => setActiveLeague(league.id)}
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

      <div className={s.standingsCard}>
        {loading ? (
          [...Array(10)].map((_, i) => (
            <div key={i} className="grid grid-cols-[48px_1fr_auto] items-center gap-4 border-b border-white/5 p-4 last:border-b-0">
              <div className="h-5 w-5 animate-pulse rounded bg-white/10" />
              <div className="space-y-1">
                <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
                <div className="h-2 w-20 animate-pulse rounded bg-white/10" />
              </div>
              <div className="h-5 w-8 animate-pulse rounded bg-white/10" />
            </div>
          ))
        ) : standings && standings.length ? (
          <>
            {/* Header row */}
            <div className="grid grid-cols-[48px_1fr_auto] items-center gap-4 border-b border-white/10 px-4 py-2 text-[9px] font-bold uppercase tracking-wider text-white/40">
              <span className="text-center">#</span>
              <span>Club</span>
              <div className="flex items-center gap-4 text-center">
                <span className="w-6">P</span>
                <span className="w-6">W</span>
                <span className="w-6">D</span>
                <span className="w-6">L</span>
                <span className="w-8">GD</span>
                <span className="w-8">Pts</span>
              </div>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 border-b border-white/5 px-4 py-2 text-[9px] text-white/30">
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-green-400" /> Champions League</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-red-400" /> Relegation</span>
            </div>
            {standings.slice(0, 20).map((row, index) => (
              <StandingsRow key={row.team?.id || index} row={row} index={index} />
            ))}
          </>
        ) : (
          empty("No league table data available.", loading)
        )}
      </div>
    </section>
  );
}

const FIXTURES_LEAGUES = [
  { id: "all", name: "All Leagues" },
  ...Object.values(COMPETITIONS).map((c) => ({ id: c.id, name: c.name })),
];

function FixtureCard({ match, dateOffset, onViewMatch }) {
  const status = getScheduleStatus(match, dateOffset);
  const statusKind = getStatusKind(match);

  return (
    <div className={s.fixtureCard}>
      <MatchTeams
        match={match}
        columnClass={s.fixtureTeamColumn}
        gridClass={s.fixtureTeamsGrid}
        scoreClass={s.fixtureScore}
        teamClass={s.fixtureTeamName}
        vsClass={s.fixtureVs}
      />
      <div className={s.fixtureInfo}>
        <p className={s.fixtureLeague}>{getMatchLeague(match)}</p>
        <p className={s.fixtureDate}>{status}</p>
      </div>
      <div className="flex items-center justify-between">
        <HeartButton match={match} />
        {statusKind === "live" ? (
          <a
            href={LIVE_STREAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-3 py-2 text-[10px] font-bold text-white shadow-lg shadow-red-500/20 transition hover:shadow-red-500/40 sm:text-xs"
          >
            <Tv size={12} /> Live <ExternalLink size={8} />
          </a>
        ) : statusKind === "finished" ? (
          <a
            href={REPLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={s.ticketButton}
          >
            <Tv size={12} /> Replay <ExternalLink size={8} />
          </a>
        ) : (
          <button type="button" className={s.ticketButton} onClick={() => onViewMatch(match, status)}>
            <Eye size={13} /> View
          </button>
        )}
      </div>
    </div>
  );
}

export function Fixtures({
  dateOffset,
  fixtures,
  loading,
  searchQuery,
  fixturesLeague,
  setDateOffset,
  setSearchQuery,
  setFixturesLeague,
  onViewMatch,
  empty,
}) {
  const noMatchesText = searchQuery
    ? `No teams matching "${searchQuery}" found on this date.`
    : "No matches found.";

  return (
    <section id="fixtures" className={s.fixturesSection}>
      <SectionTitle label="Schedule" title="Match Schedule" icon={CalendarDays} />
      <div className={s.fixturesControls}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Date pills */}
          <div className={s.datePills}>
          {[["Yesterday", -1], ["Today", 0], ["Tomorrow", 1]].map(([label, val]) => (
            <button
              key={val}
              type="button"
              onClick={() => setDateOffset(val)}
              disabled={loading}
              className={`${s.dateButtonBase} ${dateOffset === val ? s.dateButtonActive : s.dateButtonInactive}`}
            >
              {label}
            </button>
          )          )}
          </div>

          {/* League filter */}
          <div className="flex flex-wrap gap-1">
            {FIXTURES_LEAGUES.map((league) => (
              <button
                key={league.id}
                onClick={() => setFixturesLeague(league.id)}
                className={`rounded-full px-2.5 py-1 text-[9px] font-bold transition sm:px-3 sm:text-[10px] ${
                  fixturesLeague === league.id
                    ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg"
                    : "text-white/50 hover:bg-white/10 hover:text-white"
                }`}
              >
                {league.name}
              </button>
            ))}
          </div>
        </div>

        <div className={s.searchWrapper}>
          <div className={s.searchIcon}>
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className={s.searchInput}
          />
        </div>
      </div>

      {loading
        ? (
          <div className={s.fixturesGrid}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card animate-pulse rounded-3xl p-6">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <div className="flex flex-col items-center gap-2"><div className="size-11 animate-pulse rounded-full bg-white/10" /><div className="h-2 w-14 animate-pulse rounded bg-white/10" /></div>
                  <div className="h-8 w-14 animate-pulse rounded bg-white/10" />
                  <div className="flex flex-col items-center gap-2"><div className="size-11 animate-pulse rounded-full bg-white/10" /><div className="h-2 w-14 animate-pulse rounded bg-white/10" /></div>
                </div>
              </div>
            ))}
          </div>
        )
        : (
          <div className={s.fixturesGrid}>
            {fixtures.length
              ? fixtures.slice(0, 12).map((match, index) => (
                  <FixtureCard key={match.id || index} match={match} dateOffset={dateOffset} onViewMatch={onViewMatch} />
                ))
              : (
                <div className={s.emptyBase}>
                  {noMatchesText}
                </div>
              )}
          </div>
        )}
    </section>
  );
}

function HeartButton({ match, size = 14 }) {
  const { isMatchFavorited, toggleMatch } = useFavorites();
  const matchId = getMatchEventId(match) || `${getTeams(match).home}-${getTeams(match).away}`;
  const favorited = isMatchFavorited(matchId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggleMatch(matchId);
      }}
      className="grid size-8 shrink-0 place-items-center rounded-full transition hover:bg-white/20"
      style={{ background: favorited ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.1)" }}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        size={size}
        className={favorited ? "text-red-400" : "text-white/50"}
        fill={favorited ? "currentColor" : "none"}
      />
    </button>
  );
}
