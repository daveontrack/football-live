// Centralized app configuration
// External streaming URLs
export const LIVE_STREAM_URL = "https://live.epicsports.in/";
export const REPLAY_URL = "https://www.dotsport.site/home_2";

// League filter options for Standings
export const LEAGUE_OPTIONS = [
  { code: "PL", name: "Premier League", country: "England" },
  { code: "PD", name: "La Liga", country: "Spain" },
  { code: "BL1", name: "Bundesliga", country: "Germany" },
  { code: "SA", name: "Serie A", country: "Italy" },
  { code: "FL1", name: "Ligue 1", country: "France" },
  { code: "CL", name: "Champions League", country: "Europe" },
  { code: "DED", name: "Eredivisie", country: "Netherlands" },
  { code: "PPL", name: "Primeira Liga", country: "Portugal" },
  { code: "BSA", name: "Brasileirão", country: "Brazil" },
];

// External link helper
export function openExternal(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}
