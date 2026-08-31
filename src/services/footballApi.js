/**
 * Centralized Football API Service
 * Primary: football-data.org via Vite proxy
 * Features: fast rate limiter, aggressive caching, lazy per-league loading
 * No mock data — real API only.
 */

const FD_BASE = "/api/fd";
const HAS_KEY = true;

function getHeaders() {
  return {};
}

// ─── RATE LIMITER ──────────────────────────────────────────
const timestamps = [];
const queue = [];
let processing = false;
const MIN_GAP = 700;

function waitMs() {
  const now = Date.now();
  while (timestamps.length && timestamps[0] <= now - 60000) timestamps.shift();
  if (timestamps.length < 10) {
    if (timestamps.length > 0) {
      const elapsed = now - timestamps[timestamps.length - 1];
      if (elapsed < MIN_GAP) return MIN_GAP - elapsed;
    }
    return 0;
  }
  return timestamps[0] + 60500 - now;
}

async function processQueue() {
  if (processing) return;
  processing = true;
  while (queue.length) {
    const { fn, resolve, reject } = queue[0];
    const delay = waitMs();
    if (delay > 0) await new Promise((r) => setTimeout(r, delay));
    timestamps.push(Date.now());
    queue.shift();
    try { resolve(await fn()); } catch (e) { reject(e); }
    if (queue.length) await new Promise((r) => setTimeout(r, 100));
  }
  processing = false;
}

function enqueue(fn) {
  return new Promise((resolve, reject) => {
    queue.push({ fn, resolve, reject });
    processQueue();
  });
}

// ─── CACHE ─────────────────────────────────────────────────
const cache = new Map();
const MAX_CACHE = 200;

function ttlKey(ep) {
  if (ep.includes("/matches") && !ep.includes("dateFrom")) return 30000;
  if (ep.includes("/matches")) return 300000;
  if (ep.includes("/standings")) return 600000;
  if (ep.includes("/teams")) return 600000;
  if (ep.includes("/scorers")) return 600000;
  return 120000;
}

function getCached(ep) {
  const e = cache.get(ep);
  if (!e || Date.now() > e.t) { cache.delete(ep); return null; }
  return e.d;
}

function setCache(ep, d) {
  if (cache.size > MAX_CACHE) cache.delete(cache.keys().next().value);
  cache.set(ep, { d, t: Date.now() + ttlKey(ep) });
}

// ─── CORE FETCH ────────────────────────────────────────────
async function rawFetch(ep) {
  const res = await fetch(`${FD_BASE}${ep}`, { headers: getHeaders() });
  if (res.status === 429) {
    await new Promise((r) => setTimeout(r, 8000));
    const r2 = await fetch(`${FD_BASE}${ep}`, { headers: getHeaders() });
    if (!r2.ok) throw new Error(`API ${r2.status}`);
    return r2.json();
  }
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

async function apiFetch(ep) {
  if (!HAS_KEY) throw new Error("No API key configured. Add VITE_FOOTBALL_API_KEY to .env");
  const c = getCached(ep);
  if (c) return c;
  const d = await enqueue(() => rawFetch(ep));
  setCache(ep, d);
  return d;
}

async function apiFetchFresh(ep) {
  if (!HAS_KEY) throw new Error("No API key configured. Add VITE_FOOTBALL_API_KEY to .env");
  const d = await enqueue(() => rawFetch(ep));
  setCache(ep, d);
  return d;
}

// ─── COMPETITIONS ──────────────────────────────────────────
export const COMPETITIONS = {
  PL: { id: "PL", name: "Premier League", country: "England" },
  PD: { id: "PD", name: "La Liga", country: "Spain" },
  BL1: { id: "BL1", name: "Bundesliga", country: "Germany" },
  SA: { id: "SA", name: "Serie A", country: "Italy" },
  FL1: { id: "FL1", name: "Ligue 1", country: "France" },
  CL: { id: "CL", name: "Champions League", country: "Europe" },
};

// ─── MATCHES ───────────────────────────────────────────────
export async function fetchTodayMatches() {
  const d = await apiFetch("/matches");
  return d.matches || [];
}

export async function fetchTodayMatchesFresh() {
  const d = await apiFetchFresh("/matches");
  return d.matches || [];
}

export async function fetchMatchesByDate(dateStr) {
  const d = await apiFetch(`/matches?dateFrom=${dateStr}&dateTo=${dateStr}`);
  return d.matches || [];
}

// ─── STANDINGS ─────────────────────────────────────────────
export async function fetchStandings(code = "PL") {
  const d = await apiFetch(`/competitions/${code}/standings`);
  return d.standings?.[0]?.table || [];
}

// ─── TEAMS ─────────────────────────────────────────────────
export async function fetchCompetitionTeams(code = "PL") {
  const d = await apiFetch(`/competitions/${code}/teams`);
  return (d.teams || []).map((t) => ({
    ...t,
    competitionCode: code,
    competitionName: COMPETITIONS[code]?.name || code,
    country: COMPETITIONS[code]?.country || "",
  }));
}

let _allTeamsCache = null;
let _allTeamsPromise = null;

export async function fetchAllTeams() {
  if (_allTeamsCache) return _allTeamsCache;
  if (_allTeamsPromise) return _allTeamsPromise;

  _allTeamsPromise = (async () => {
    const codes = Object.keys(COMPETITIONS);
    const all = [];
    for (const code of codes) {
      try {
        const teams = await fetchCompetitionTeams(code);
        all.push(...teams);
      } catch {}
    }
    _allTeamsCache = all;
    _allTeamsPromise = null;
    return _allTeamsCache;
  })();

  return _allTeamsPromise;
}

// ─── SCORERS ───────────────────────────────────────────────
export async function fetchTopScorers(code = "PL") {
  const d = await apiFetch(`/competitions/${code}/scorers?limit=20`);
  return (d.scorers || []).map((s) => ({
    id: s.player?.id || Math.random(),
    name: s.player?.name || "Unknown",
    nationality: s.player?.nationality || "",
    position: s.player?.position || "Forward",
    team: s.team?.name || "",
    teamId: s.team?.id,
    teamLogo: s.team?.crest || "",
    goals: s.goals || 0,
    assists: s.assists || 0,
    penalties: s.penalties || 0,
    playedMatches: s.playedMatches || 0,
    yellowCards: s.yellowCards || 0,
    redCards: s.redCards || 0,
  }));
}

let _allScorersCache = null;
let _allScorersPromise = null;

export async function fetchAllTopScorers() {
  if (_allScorersCache) return _allScorersCache;
  if (_allScorersPromise) return _allScorersPromise;

  _allScorersPromise = (async () => {
    const codes = ["PL", "PD", "BL1", "SA", "FL1"];
    const all = [];
    for (const c of codes) {
      try { all.push(...await fetchTopScorers(c)); } catch {}
    }
    all.sort((a, b) => b.goals - a.goals);
    _allScorersCache = all;
    _allScorersPromise = null;
    return _allScorersCache;
  })();

  return _allScorersPromise;
}

// ─── CACHE CLEAR ───────────────────────────────────────────
export function clearCache() {
  cache.clear();
  _allTeamsCache = null;
  _allScorersCache = null;
}

// ─── UTILITIES ─────────────────────────────────────────────
export function getMatchValue(obj, paths, fb = "Unknown") {
  if (!obj || typeof obj !== "object") return fb;
  for (const p of paths) {
    const v = p.split(".").reduce((a, k) => (a != null ? a[k] : undefined), obj);
    if (v != null && v !== "") return v;
  }
  return fb;
}

export function getMatchStatus(m, fb = "Scheduled") {
  const raw = getMatchValue(m, ["status", "status.long", "status.description", "matchStatus", "state"], fb);
  if (/timed/i.test(raw)) return "Scheduled";
  if (/ns/i.test(raw)) return "Scheduled";
  if (/tbd/i.test(raw)) return "TBD";
  return raw;
}

export function getMatchLeague(m) {
  return getMatchValue(m, ["league.name", "competition.name", "tournament.name"], "Unknown League");
}

const sp = {
  home: ["score.fullTime.home", "scores.home", "score.home", "goals.home", "homeScore"],
  away: ["score.fullTime.away", "scores.away", "score.away", "goals.away", "awayScore"],
};

export function getMatchScore(m) {
  const h = String(getMatchValue(m, sp.home, ""));
  const a = String(getMatchValue(m, sp.away, ""));
  const has = h !== "" && a !== "" && h !== "null" && a !== "null";
  return { home: h, away: a, display: has ? `${h} – ${a}` : "vs", hasScore: has };
}

export const getMatchEventId = (m) => getMatchValue(m, ["id", "eventId", "fixture.id", "matchId"], "");

export const getTeamLogo = (m, side) => {
  const paths = [
    `${side}Team.crest`, `${side}Team.logo`,
    `${side}.crest`, `${side}.logo`, `${side}.image`,
  ];
  for (const p of paths) {
    const v = p.split(".").reduce((a, k) => (a != null ? a[k] : undefined), m);
    if (typeof v === "string" && v.startsWith("http")) return v;
  }
  const id = getMatchValue(m, [`${side}Team.id`, `${side}.id`]);
  if (id && id !== "TBD") return `https://images.fotmob.com/image_resources/logo/teamlogo/${id}.png`;
  return "";
};

export function buildHighlightFromMatch(match) {
  const home = getMatchValue(match, ["homeTeam.name", "home.name"]);
  const away = getMatchValue(match, ["awayTeam.name", "away.name"]);
  const league = getMatchLeague(match);
  const score = getMatchScore(match);
  const date = getMatchValue(match, ["utcDate", "date"], "");
  const id = getMatchValue(match, ["id"]);
  return {
    id: id || `hl-${Date.now()}`,
    title: `${home} ${score.hasScore ? score.display : ""} ${away} | ${league}`,
    league,
    date: date ? fmtDate(date) : "Recent",
    thumbnail: getTeamLogo(match, "home"),
    youtubeSearchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(home + " " + away + " " + league + " highlights")}`,
    homeTeam: home, awayTeam: away,
    score: score.hasScore ? score.display : "",
    status: getMatchStatus(match),
  };
}

export async function fetchMatchLocation() { return null; }

function fmtDate(s) {
  try {
    const d = new Date(s), diff = Date.now() - d;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(diff / 3600000);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(diff / 86400000);
    return days < 7 ? `${days}d ago` : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch { return "Recent"; }
}
