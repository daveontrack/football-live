import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Tv, Radio } from "lucide-react";
import { matchWatchStyles as s } from "../assets/dummyStyles";
import MatchDetails from "../components/MatchDetails";
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
  const [showDetails, setShowDetails] = useState(false);

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

      {/* Match header */}
      <div className="animate-fade-in-scale border-b border-white/5 bg-[#111] px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-red-400">{league}</p>

          <div className="flex items-center justify-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <TeamBadge src={homeLogo} name={homeName} size="md" />
              <span className="text-sm font-black text-white sm:text-base">{homeName}</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              {score?.hasScore ? (
                <div className="flex items-center gap-2 text-2xl font-black text-white sm:text-3xl">
                  {score.home}
                  <span className="text-red-500">-</span>
                  {score.away}
                </div>
              ) : (
                <span className="text-xl font-bold text-white/30">VS</span>
              )}
              {live && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-400">
                  <span className="live-dot size-1.5 rounded-full bg-red-500" /> LIVE
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-sm font-black text-white sm:text-base">{awayName}</span>
              <TeamBadge src={awayLogo} name={awayName} size="md" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center animate-slide-in-bottom">
            {live ? (
              <a
                href={LIVE_STREAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/30 transition animate-press hover:shadow-red-500/50"
              >
                <Radio size={16} /> Watch Live <ExternalLink size={12} />
              </a>
            ) : (
              <a
                href={REPLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white/60 transition animate-press hover:bg-white/10 hover:text-white"
              >
                <Tv size={16} /> Watch Replay <ExternalLink size={12} />
              </a>
            )}

            <button
              onClick={() => setShowDetails(true)}
              className="flex items-center justify-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-6 py-3 text-sm font-bold text-red-400 transition animate-press hover:bg-red-500/20"
            >
              Match Details & Stats
            </button>
          </div>

          <p className="mt-3 text-center text-[10px] text-white/20">
            Opens in a new tab · We do not host or scrape streams
          </p>
        </div>
      </div>

      {/* Match Details Modal */}
      {showDetails && match && (
        <MatchDetails match={match} onClose={() => setShowDetails(false)} />
      )}

      {/* While loading */}
      {loading && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="size-6 animate-spin rounded-full border-2 border-white/20 border-t-red-500" />
            <span className="text-sm text-white/40">Loading match...</span>
          </div>
        </div>
      )}
    </div>
  );
}
