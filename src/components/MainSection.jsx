import { useCallback, useEffect, useState, useRef } from "react";
import {
  MatchCenter,
  MatchDetailsPanel,
  Standings,
  Fixtures,
} from "./MainSectionParts";
import { getMatchLocation } from "./MainSectionUtils";
import { mainSectionStyles as s } from "../assets/dummyStyles";
import {
  fetchTodayMatches,
  fetchTodayMatchesFresh,
  fetchMatchesByDate,
  fetchStandings,
  getMatchLeague,
  COMPETITIONS,
} from "../services/footballApi";

function EmptyState({ message, loading }) {
  return (
    <div className={s.emptyBase}>
      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <div className="size-6 animate-spin rounded-full border-2 border-white/20 border-t-red-500" />
          <span className="text-white/40">{message}</span>
        </div>
      ) : message}
    </div>
  );
}

export default function MainSection() {
  // Matches state
  const [matches, setMatches] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [error, setError] = useState(null);

  // Standings state (independent)
  const [standings, setStandings] = useState([]);
  const [standingsLoading, setStandingsLoading] = useState(true);
  const [standingsLeague, setStandingsLeague] = useState("PL");

  // Fixtures state
  const [fixtures, setFixtures] = useState([]);
  const [fixturesLoading, setFixturesLoading] = useState(false);
  const [dateOffset, setDateOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [fixturesLeague, setFixturesLeague] = useState("all");

  // Match details
  const [selection, setSelection] = useState(null);
  const [location, setLocation] = useState("");

  const empty = useCallback(
    (msg, isLoading) => <EmptyState message={msg} loading={isLoading} />,
    [],
  );

  // ─── FETCH MATCHES (independent) ────────────────────────
  useEffect(() => {
    let active = true;
    async function load() {
      setMatchesLoading(true);
      setError(null);
      try {
        const todayMatches = await fetchTodayMatches();
        if (!active) return;
        setMatches(todayMatches);
        setLiveMatches(todayMatches.filter((m) =>
          /live|in_play|paused|1H|2H|HT|ET/i.test(getStatus(m))
        ));
      } catch (err) {
        if (active) setError(err.message || "Failed to load match data.");
      } finally {
        if (active) setMatchesLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  // ─── FETCH STANDINGS (independent, changes with league) ─
  useEffect(() => {
    let active = true;
    async function load() {
      setStandingsLoading(true);
      try {
        const data = await fetchStandings(standingsLeague);
        if (active) setStandings(data);
      } catch (err) {
        console.warn("Standings fetch failed:", err);
        if (active) setStandings([]);
      } finally {
        if (active) setStandingsLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [standingsLeague]);

  // ─── FETCH FIXTURES (on date change) ────────────────────
  useEffect(() => {
    let active = true;
    async function load() {
      setFixturesLoading(true);
      try {
        if (dateOffset !== 0) {
          const d = new Date();
          d.setDate(d.getDate() + dateOffset);
          const iso = d.toISOString().split("T")[0];
          const dateMatches = await fetchMatchesByDate(iso);
          if (active) setFixtures(dateMatches);
        } else {
          // Use cached matches for today
          if (matches.length) {
            setFixtures(matches);
          } else {
            const todayMatches = await fetchTodayMatches();
            if (active) setFixtures(todayMatches);
          }
        }
      } catch {
        if (active) setFixtures([]);
      } finally {
        if (active) setFixturesLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [dateOffset, matches]);

  // ─── AUTO-REFRESH LIVE SCORES ───────────────────────────
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const all = await fetchTodayMatchesFresh();
        setMatches(all);
        setLiveMatches(all.filter((m) => /live|in_play|paused/i.test(getStatus(m))));
      } catch {}
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Apply search + league filter
  const filteredFixtures = fixtures.filter((m) => {
    // League filter
    if (fixturesLeague !== "all") {
      const league = getMatchLeague(m);
      const comp = Object.values(COMPETITIONS).find((c) => c.id === fixturesLeague);
      if (comp && !league.toLowerCase().includes(comp.name.toLowerCase())) return false;
    }
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const home = getVal(m, ["homeTeam.name", "home.name", "teams.home.name"]);
      const away = getVal(m, ["awayTeam.name", "away.name", "teams.away.name"]);
      return home.toLowerCase().includes(q) || away.toLowerCase().includes(q);
    }
    return true;
  });

  function handleViewMatch(match, status) {
    setSelection({ match, statusLabel: status });
    setLocation("Loading venue…");
    const eventId = getVal(match, ["id", "eventId", "fixture.id"]);
    getMatchLocation(eventId, getVal(match, ["venue.name", "stadium.name", ""]), () => selection === null)
      .then((loc) => { if (loc) setLocation(loc); });
  }

  function handleCloseDetails() {
    setSelection(null);
    setLocation("");
  }

  return (
    <main className={s.mainContainer} id="live">
      <div className={s.glowLeft} />
      <div className={s.glowRight} />
      <div className={s.innerWrapper}>
        {!import.meta.env.VITE_FOOTBALL_API_KEY && (
          <div className="mb-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-xs font-semibold text-yellow-300 sm:mb-8 sm:text-sm">
            ⚡ Demo Mode — Using sample data. Add <code className="rounded bg-black/30 px-1.5 py-0.5 text-yellow-200">VITE_FOOTBALL_API_KEY</code> to your <code className="rounded bg-black/30 px-1.5 py-0.5 text-yellow-200">.env</code> for live data.
          </div>
        )}
        {error && <div className={s.errorBanner}>{error}</div>}

        {/* Each section loads independently */}
        <MatchCenter
          matches={matches}
          loading={matchesLoading}
          onViewMatch={handleViewMatch}
        />
        <Standings
          standings={standings}
          loading={standingsLoading}
          empty={empty}
          activeLeague={standingsLeague}
          setActiveLeague={setStandingsLeague}
        />
        <Fixtures
          dateOffset={dateOffset}
          fixtures={filteredFixtures}
          loading={fixturesLoading}
          searchQuery={searchQuery}
          fixturesLeague={fixturesLeague}
          setDateOffset={setDateOffset}
          setSearchQuery={setSearchQuery}
          setFixturesLeague={setFixturesLeague}
          onViewMatch={handleViewMatch}
          empty={empty}
        />
      </div>

      <MatchDetailsPanel
        selection={selection}
        location={location}
        onClose={handleCloseDetails}
      />
    </main>
  );
}

function getStatus(match) {
  return getVal(match, ["status.long", "status.description", "status", "state", ""], "");
}

function getVal(obj, paths, fallback = "") {
  if (!obj || typeof obj !== "object") return fallback;
  for (const p of paths) {
    const v = p.split(".").reduce((a, k) => (a != null ? a[k] : undefined), obj);
    if (v != null && v !== "") return v;
  }
  return fallback;
}
