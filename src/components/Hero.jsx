import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { heroStyles as s } from "../assets/dummyStyles";
import { getMatchValue, getMatchScore, getMatchStatus, getTeamLogo, fetchTodayMatches } from "../services/footballApi";
import { AnimateOnScroll } from "../hooks/useInView.jsx";
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

function StatBlock({ value, label, delay = 0 }) {
  return (
    <AnimateOnScroll animation="fade-in-up" delay={delay}>
      <div>
        <p className={s.statValue}>{value}</p>
        <p className={s.statLabel}>{label}</p>
      </div>
    </AnimateOnScroll>
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
          className={`${s.heroVideo} animate-hero-drift`}
          style={{ objectFit: "cover" }}
        />
        <div className={s.overlayGradient} />

        <div className={s.gridContainer}>
          {/* Left – stats */}
          <aside className={s.statsAside}>
            <StatBlock value={matches.length} label="Matches" delay={200} />
            <StatBlock value={loading ? "—" : "Live"} label="Status" delay={350} />
            <StatBlock value="24/7" label="Coverage" delay={500} />
          </aside>

          {/* Center – heading */}
          <div className={s.headingWrapper}>
            <AnimateOnScroll animation="fade-in-up" delay={100}>
              <h1 className={`${s.heading} animate-gradient-shift`} style={{
                background: "linear-gradient(135deg, #ffffff 0%, #ff6b6b 25%, #ffffff 50%, #ff4444 75%, #ffffff 100%)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
              }}>
                Football
                <br />
                Live
              </h1>
            </AnimateOnScroll>
          </div>

          {/* Right – featured match */}
          <div className={s.rightPanel}>
            <AnimateOnScroll animation="fade-in-right" delay={300}>
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
                </div>                  {matches.length > 1 && (
                  <>
                    <AnimateOnScroll animation="fade-in-up" delay={100}>
                    <div className={s.moreMatchesRow}>
                      <span className={s.moreMatchesLabel}>More Matches</span>
                    </div>
                    <div className={s.remainingMatchesGrid}>
                      {matches.slice(1, 4).map((m, i) => (
                        <MatchRow key={m.id || i} match={m} />
                      ))}
                    </div>
                    </AnimateOnScroll>
                  </>
                )}
              </>
            ) : (
              <div className={s.emptyState}>No matches available.</div>
            )}
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
