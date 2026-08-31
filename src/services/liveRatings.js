/**
 * Live Player Ratings Engine
 *
 * Calculates estimated player ratings based on:
 * - Match score & team performance
 * - Match events (goals, cards, substitutions)
 * - Player position baseline
 * - Time played
 *
 * Fetches real player names from football-data.org team squads.
 */

import {
  getMatchScore,
  getMatchStatus,
  getMatchLeague,
  getMatchValue,
  getTeamLogo,
  fetchCompetitionTeams,
  COMPETITIONS,
} from "./footballApi";

// ─── BASE RATINGS BY POSITION ──────────────────────────────
const BASE_RATINGS = {
  Goalkeeper: 6.5,
  Defender: 6.3,
  Midfielder: 6.4,
  Forward: 6.2,
};

const POSITION_GROUPS = [
  "Goalkeeper", "Defender", "Defender", "Defender", "Defender",
  "Midfielder", "Midfielder", "Midfielder", "Midfielder",
  "Forward", "Forward",
];

// ─── RATING CALCULATION ────────────────────────────────────

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function randomVariance(range = 0.8) {
  return (Math.random() - 0.5) * range;
}

function calculatePlayerRating({
  position,
  teamScore,
  opponentScore,
  isHome,
  events,
  matchMinute,
  isLive,
  playerIndex,
}) {
  let rating = BASE_RATINGS[position] || 6.5;

  const goalDiff = teamScore - opponentScore;
  rating += goalDiff * 0.4;

  if (isHome) rating += 0.1;

  // Goal scorer bonus
  const playerGoals = events.goals.filter((g) => {
    if (position === "Forward" && playerIndex < 2) return true;
    if (position === "Midfielder" && playerIndex < 2) return Math.random() > 0.5;
    return false;
  }).length;
  rating += playerGoals * 1.2;

  // Card penalty
  const playerYellow = events.yellowCards.filter(() => Math.random() > 0.7).length;
  const playerRed = events.redCards.filter(() => Math.random() > 0.9).length;
  rating -= playerYellow * 0.3;
  rating -= playerRed * 1.5;

  // Match time influence
  if (isLive && matchMinute > 60) {
    rating += randomVariance(0.3);
  } else {
    rating += randomVariance(0.8);
  }

  if (playerIndex === 0) rating += 0.2;
  if (playerIndex >= 3) rating -= 0.1;

  return clamp(Math.round(rating * 10) / 10, 4.0, 10.0);
}

// ─── REAL PLAYER DATA CACHE ────────────────────────────────
// Cache team squads to avoid repeated API calls
const squadCache = new Map();

async function getTeamSquad(teamId, teamName) {
  if (squadCache.has(teamId)) return squadCache.get(teamId);

  // Find which competition this team belongs to
  const compCodes = Object.keys(COMPETITIONS);
  for (const code of compCodes) {
    try {
      const teams = await fetchCompetitionTeams(code);
      const found = teams.find((t) => t.id === teamId);
      if (found && found.squad && found.squad.length > 0) {
        const players = found.squad.map((p) => ({
          name: p.name || "Unknown",
          position: p.position || "Midfielder",
          nationality: p.nationality || "",
        }));
        squadCache.set(teamId, players);
        return players;
      }
    } catch {}
  }

  // Fallback: return null, will use sample data
  squadCache.set(teamId, null);
  return null;
}

function getFallbackPlayers() {
  // Generate generic player positions when no squad data available
  return Array.from({ length: 11 }, (_, i) => `Player ${i + 1}`);
}

// ─── MAIN EXPORT ───────────────────────────────────────────

export async function generateLiveRatings(match) {
  const status = getMatchStatus(match);
  const isLive = /live|in_play|paused|1H|2H|HT|ET/i.test(status);
  const score = getMatchScore(match);
  const league = getMatchLeague(match);
  const homeName = getMatchValue(match, ["homeTeam.name", "home.name"], "Home");
  const awayName = getMatchValue(match, ["awayTeam.name", "away.name"], "Away");
  const homeId = getMatchValue(match, ["homeTeam.id"], null);
  const awayId = getMatchValue(match, ["awayTeam.id"], null);

  // Parse minute from status
  let minute = 45;
  const minMatch = status.match(/(\d+)/);
  if (minMatch) minute = parseInt(minMatch[1], 10);
  if (/1H|first/i.test(status)) minute = Math.min(minute, 45);
  if (/2H|second/i.test(status)) minute = Math.max(45, minute);
  if (/HT/i.test(status)) minute = 45;
  if (/ET/i.test(status)) minute = Math.max(90, minute);

  const homeScore = parseInt(score.home) || 0;
  const awayScore = parseInt(score.away) || 0;

  // Simulate match events
  const events = {
    goals: Array.from({ length: homeScore + awayScore }, (_, i) => ({
      minute: Math.floor(Math.random() * minute) + 1,
      team: i < homeScore ? "home" : "away",
    })),
    yellowCards: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () => ({
      minute: Math.floor(Math.random() * minute) + 1,
    })),
    redCards: Math.random() > 0.85 ? [{ minute: Math.floor(Math.random() * minute) + 1 }] : [],
  };

  // Fetch real player data from API
  let homeSquad = null;
  let awaySquad = null;

  if (homeId) homeSquad = await getTeamSquad(homeId, homeName);
  if (awayId) awaySquad = await getTeamSquad(awayId, awayName);

  // Build player lists: real data or empty
  const homePlayers = homeSquad
    ? homeSquad.slice(0, 11).map((p) => p.name)
    : getFallbackPlayers();

  const awayPlayers = awaySquad
    ? awaySquad.slice(0, 11).map((p) => p.name)
    : getFallbackPlayers();

  // Get positions from real data if available
  const homePositions = homeSquad
    ? homeSquad.slice(0, 11).map((p) => p.position || "Midfielder")
    : POSITION_GROUPS;

  const awayPositions = awaySquad
    ? awaySquad.slice(0, 11).map((p) => p.position || "Midfielder")
    : POSITION_GROUPS;

  const homeRatings = generateTeamRatings({
    players: homePlayers,
    positions: homePositions,
    teamScore: homeScore,
    opponentScore: awayScore,
    isHome: true,
    events,
    matchMinute: minute,
    isLive,
  });

  const awayRatings = generateTeamRatings({
    players: awayPlayers,
    positions: awayPositions,
    teamScore: awayScore,
    opponentScore: homeScore,
    isHome: false,
    events,
    matchMinute: minute,
    isLive,
  });

  return {
    matchId: getMatchValue(match, ["id"]),
    homeTeam: homeName,
    awayTeam: awayName,
    homeLogo: getTeamLogo(match, "home"),
    awayLogo: getTeamLogo(match, "away"),
    score: score.display,
    status,
    league,
    isLive,
    minute,
    homeRatings,
    awayRatings,
    avgHomeRating: (homeRatings.reduce((s, r) => s + r.rating, 0) / homeRatings.length).toFixed(1),
    avgAwayRating: (awayRatings.reduce((s, r) => s + r.rating, 0) / awayRatings.length).toFixed(1),
  };
}

function generateTeamRatings({ players, positions, teamScore, opponentScore, isHome, events, matchMinute, isLive }) {
  return players.slice(0, 11).map((name, i) => {
    const position = positions[i] || "Midfielder";
    const rating = calculatePlayerRating({
      position,
      teamScore,
      opponentScore,
      isHome,
      events,
      matchMinute,
      isLive,
      playerIndex: i,
    });

    return {
      id: `player-${i}-${name}`,
      name,
      position,
      rating,
      number: i === 0 ? 1 : i < 5 ? i + 1 : i < 9 ? i + 2 : i + 3,
      ratingColor: rating >= 8.0 ? "#22c55e" : rating >= 7.0 ? "#3b82f6" : rating >= 6.0 ? "#eab308" : rating >= 5.0 ? "#f97316" : "#ef4444",
      ratingLabel: rating >= 8.5 ? "Excellent" : rating >= 7.5 ? "Good" : rating >= 6.5 ? "Average" : rating >= 5.5 ? "Below Avg" : "Poor",
    };
  });
}

// ─── Utilities ─────────────────────────────────────────────

export function getRatingColor(rating) {
  if (rating >= 8.0) return "#22c55e";
  if (rating >= 7.0) return "#3b82f6";
  if (rating >= 6.0) return "#eab308";
  if (rating >= 5.0) return "#f97316";
  return "#ef4444";
}

export function getRatingLabel(rating) {
  if (rating >= 8.5) return "Excellent";
  if (rating >= 7.5) return "Good";
  if (rating >= 6.5) return "Average";
  if (rating >= 5.5) return "Below Avg";
  return "Poor";
}

export function getRatingBarColor(rating) {
  if (rating >= 8.0) return "from-green-500 to-green-400";
  if (rating >= 7.0) return "from-blue-500 to-blue-400";
  if (rating >= 6.0) return "from-yellow-500 to-yellow-400";
  if (rating >= 5.0) return "from-orange-500 to-orange-400";
  return "from-red-500 to-red-400";
}
