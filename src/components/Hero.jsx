import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { heroStyles as s } from "../assets/dummyStyles";
import { getMatchValue, getMatchScore, getMatchStatus, getTeamLogo, fetchTodayMatches } from "../services/footballApi";
import heroImage from "../assets/burno.jpg";

const LIVE_STREAM_URL = "https://live.epicsports.in/";
const REPLAY_URL = "https://www.dotsport.site/home_2";

const teamNamePaths = {
  home: ["home.name", "homeTeam.name", "teams.home.name", "homeTeam", "home"],
  away: ["away.name", "awayTeam.name", "teams.away.name", "awayTeam", "away"],
};

function RealTeamBadge({ logo, name, featured }) {
  return (
    <div className={`${s.badgeBase} ${featured ? s.badgeFeatured : s.badgeDefault}`}>
      {logo ? (
        <img src={logo} alt={`${name} logo`} className={s.badgeLogo} />
      ) : (
        <span className={featured ? s.badgeFallbackFeatured : s.badgeFallbackDefault}>
          {name.slice(0, 3).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function StatBlock({ value, label }) {
  return (
    <div>
      <p className={s.statValue}>{value}</p>
      <p className={s.statLabel}>{label}</p>
    </div>
  );
}

function MatchRow({ match, featured = false }) {
  const home = getMatchValue(match, teamNamePaths.home);
  const away = getMatchValue(match, teamNamePaths.away);
  const score = getMatchScore(match);
  const status = getMatchStatus(match);
  const homeLogo = getTeamLogo(match, "home");
  const awayLogo = getTeamLogo(match, "away");
  const isLive = /live|in_play|paused|1H|2H|HT|ET/i.test(status.toUpperCase());

  return (
    <div className={`${featured ? s.matchRowFeatured : s.matchRowDefault}`}>
      <p className={s.matchDate}>{status}</p>
      <div className="flex items-center gap-3">
        <div className={s.teamColumn}>
          <RealTeamBadge logo={homeLogo} name={home} featured={featured} />
          <span className={`${s.teamNameBase} ${featured ? s.teamNameFeatured : s.teamNameDefault}`}>
            {home}
          </span>
        </div>
        <span className={`${s.vsBase} ${featured ? s.vsFeatured : s.vsDefault}`}>
          {score.hasScore ? score.display : "vs"}
        </span>
        <div className={s.teamColumn}>
          <RealTeamBadge logo={awayLogo} name={away} featured={featured} />
          <span className={`${s.teamNameBase} ${featured ? s.teamNameFeatured : s.teamNameDefault}`}>
            {away}
          </span>
        </div>
        <a
          href={isLive ? LIVE_STREAM_URL : REPLAY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="grid size-8 shrink-0 place-items-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
          aria-label={isLive ? "Watch live" : "Watch replay"}
        >
          <Play size={14} fill="currentColor" />
        </a>
      </div>
    </div>
  );
}

export default function Hero() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await fetchTodayMatches();
        if (active) setMatches(data);
      } catch {}
      finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const featured = matches[0];

  return (
    <section className={s.section}>
      <div className={s.innerBg}>
        {/* Hero image background */}
        <img
          src={heroImage}
          alt="Football"
          className={s.heroVideo}
          style={{ objectFit: "cover" }}
        />
        <div className={s.overlayGradient} />

        <div className={s.gridContainer}>
          {/* Left – stats */}
          <aside className={s.statsAside}>
            <StatBlock value={matches.length} label="Matches" />
            <StatBlock value={loading ? "—" : "Live"} label="Status" />
            <StatBlock value="24/7" label="Coverage" />
          </aside>

          {/* Center – heading */}
          <div className={s.headingWrapper}>
            <h1 className={s.heading}>
              Football
              <br />
              Live
            </h1>
          </div>

          {/* Right – featured match */}
          <div className={s.rightPanel}>
            {loading && !featured ? (
              <div className={s.emptyState}>Loading matches…</div>
            ) : featured ? (
              <>
                <div className={s.featuredMatchCard}>
                  <div className={s.featuredMatchHeader}>
                    <p className={s.featuredMatchHeaderText}>
                      Featured Match
                    </p>
                    <a
                      href={/live|in_play|paused|1H|2H|HT|ET/i.test(getMatchStatus(featured).toUpperCase()) ? LIVE_STREAM_URL : REPLAY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={s.featuredMatchButton}
                      aria-label="Watch featured match"
                    >
                      <Play size={14} fill="currentColor" />
                    </a>
                  </div>
                  <MatchRow match={featured} featured />
                </div>

                {matches.length > 1 && (
                  <>
                    <div className={s.moreMatchesRow}>
                      <span className={s.moreMatchesLabel}>More Matches</span>
                    </div>
                    <div className={s.remainingMatchesGrid}>
                      {matches.slice(1, 4).map((m, i) => (
                        <MatchRow key={m.id || i} match={m} />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className={s.emptyState}>No matches available.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
