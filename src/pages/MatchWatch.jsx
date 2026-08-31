import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Tv, Radio } from "lucide-react";
import { matchWatchStyles as s } from "../assets/dummyStyles";
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

function isLive(m) {
  return /live|in_play|paused|1H|2H|HT|ET/i.test(getMatchStatus(m));
}

function TeamBadge({ src, name, size = "lg" }) {
  const sizes = { md: "size-11", lg: "size-14" };
  return (
    <div className={`${s.teamBadgeBase} ${sizes[size]}`}>
      {src ? (
        <img src={src} alt={name} className={s.teamBadgeImg} />
      ) : (
        <span className="text-sm">{(name || "?").slice(0, 2).toUpperCase()}</span>
      )}
    </div>
  );
}

export default function MatchWatch() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const matches = await fetchTodayMatches();
        const found = matches.find(
          (m) => String(getMatchValue(m, ["id"], "")) === String(matchId)
        );
        setMatch(found || null);
      } catch (e) {
        console.error("Failed to load match:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [matchId]);

  // If match found, redirect to external site; if not, just redirect
  useEffect(() => {
    if (!loading && match) {
      if (isLive(match)) {
        window.location.href = LIVE_STREAM_URL;
      } else {
        window.location.href = REPLAY_URL;
      }
    } else if (!loading && !match) {
      // No match found, redirect to live site
      window.location.href = LIVE_STREAM_URL;
    }
  }, [loading, match]);

  // While redirecting, show a brief screen
  const score = match ? getMatchScore(match) : null;
  const league = match ? getMatchLeague(match) : "";
  const homeName = match ? getMatchValue(match, ["homeTeam.name", "home.name"], "Home") : "Loading...";
  const awayName = match ? getMatchValue(match, ["awayTeam.name", "away.name"], "Away") : "";
  const homeLogo = match ? getTeamLogo(match, "home") : "";
  const awayLogo = match ? getTeamLogo(match, "away") : "";
  const live = match ? isLive(match) : false;

  return (
    <div className={s.page}>
      {/* Back bar */}
      <div className={s.backBar}>
        <button onClick={() => navigate(-1)} className={s.backButton}>
          <ArrowLeft size={14} /> Back
        </button>
        <span className={s.backTitle}>{league}</span>
      </div>

      {/* Redirecting screen */}
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center animate-fade-in-scale">
        {/* Team badges */}
        <div className="flex items-center gap-6 animate-float">
          <TeamBadge src={homeLogo} name={homeName} />
          <div className="flex flex-col items-center gap-2">
            {score?.hasScore ? (
              <div className="flex items-center gap-2 text-3xl font-black text-white">
                {score.home}
                <span className="text-red-500">-</span>
                {score.away}
              </div>
            ) : (
              <span className="text-2xl font-bold text-white/30">VS</span>
            )}
            {live && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-400">
                <span className="live-dot size-1.5 rounded-full bg-red-500" /> LIVE
              </span>
            )}
          </div>
          <TeamBadge src={awayLogo} name={awayName} />
        </div>

        {/* Team names */}
        <div className="flex items-center gap-4 text-sm font-bold text-white/60">
          <span>{homeName}</span>
          <span className="text-white/20">vs</span>
          <span>{awayName}</span>
        </div>

        {/* Redirecting message */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-white/40">
            <Tv size={16} />
            Redirecting to live stream...
          </div>
          <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-r from-red-500 to-red-400" />
          </div>
        </div>

        {/* Manual buttons if redirect is blocked */}
        <div className="flex flex-col gap-3 sm:flex-row animate-slide-in-bottom">
          <a
            href={LIVE_STREAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/30 transition animate-press hover:shadow-red-500/50"
          >
            <Radio size={16} /> Watch Live <ExternalLink size={12} />
          </a>
          <a
            href={REPLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <Tv size={16} /> Watch Replay <ExternalLink size={12} />
          </a>
        </div>

        <p className="max-w-sm text-[10px] text-white/20">
          Opens in a new tab · We do not host or scrape streams
        </p>
      </div>
    </div>
  );
}
