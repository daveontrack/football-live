               # ⚽ ዳዊት Football Live


[davefootball](https://davefootball-live.vercel.app/)

---

## ✨ Features

- **Live Matches** — Real-time scores with auto-refresh for ongoing games
- **League Standings** — Premier League, La Liga, Bundesliga, Serie A, Ligue 1, Champions League & more
- **Teams Directory** — Browse all teams across major competitions with squad details
- **Top Scorers** — Aggregated goal-scoring charts across all leagues
- **Live Player Ratings** — Estimated player performance ratings during live matches
- **Football News** — Latest headlines via NewsData.io with journalist & media source filtering
- **Favorites** — Save your favorite teams and players
- **Highlights** — Quick access to match highlights via YouTube search
- **Dark Theme** — Sleek, modern dark UI built with Tailwind CSS
- **Responsive** — Works on desktop, tablet, and mobile

## 🏟️ Supported Leagues

| League | Code | Country |
|--------|------|---------|
| Premier League | PL | 🏴󠁧󠁢󠁥󠁮󠁧󠁿 England |
| La Liga | PD | 🇪🇸 Spain |
| Bundesliga | BL1 | 🇩🇪 Germany |
| Serie A | SA | 🇮🇹 Italy |
| Ligue 1 | FL1 | 🇫🇷 France |
| Champions League | CL | 🇪🇺 Europe |
| Eredivisie | DED | 🇳🇱 Netherlands |
| Primeira Liga | PPL | 🇵🇹 Portugal |
| Brasileirão | BSA | 🇧🇷 Brazil |

## 🛠️ Tech Stack

- **Frontend:** React 19 + Vite 8
- **Styling:** Tailwind CSS 4
- **Routing:** React Router v7
- **Icons:** Lucide React
- **API:** football-data.org (matches, standings, teams, scorers)
- **News:** NewsData.io + RSS fallback (BBC Sport, Sky Sports)
- **Deployment:** Vercel (with serverless API proxy)

## 🚀 Getting Started

### Installation

```bash
# Clone the repo
git clone https://github.com/daveontrack/football-live.git
cd football-live

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```


For Vercel deployment, also add a server-side env var:

```
FOOTBALL_API_KEY=your_api_key_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
football-live/
├── api/
│   └── fd.js                  # Vercel serverless API proxy for football-data.org
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── dummyStyles.js     # Tailwind style utilities
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar
│   │   ├── Hero.jsx            # Hero section
│   │   ├── MainSection.jsx     # Main content section
│   │   ├── MainSectionParts.jsx
│   │   ├── MainSectionUtils.js
│   │   ├── LiveScoreCard.jsx   # Live match score cards
│   │   ├── LiveRatings.jsx     # Live player ratings
│   │   ├── PlayerStats.jsx     # Player statistics
│   │   ├── TeamsDirectory.jsx  # Teams browsing
│   │   ├── NewsSection.jsx     # Football news
│   │   ├── Highlights.jsx      # Match highlights
│   │   ├── Favorites.jsx       # User favorites
│   │   └── Footer.jsx          # Footer
│   ├── context/
│   │   ├── ThemeContext.jsx     # Dark/light theme
│   │   └── FavoritesContext.jsx # Favorites state
│   ├── pages/
│   │   ├── WatchLive.jsx       # Watch Live page
│   │   └── MatchWatch.jsx      # Individual match view
│   ├── services/
│   │   ├── footballApi.js      # football-data.org API client
│   │   ├── newsApi.js          # News API client
│   │   └── liveRatings.js      # Player ratings engine
│   ├── config.js               # App configuration
│   ├── main.jsx                # App entry point
│   └── index.css               # Global styles
├── vite.config.js              # Vite config with API proxy
├── vercel.json                 # Vercel deployment config
└── package.json
```

## 🔑 API Rate Limits

The free tier of football-data.org allows **10 requests per minute**. The app implements:

- Client-side rate limiting with request queuing
- Aggressive caching (30s for live matches, 5min for date queries, 10min for standings)
- Automatic retry on 429 (rate limit) responses

## 📝 License

This project is for educational purposes. Football data is provided by [football-data.org](https://www.football-data.org/).

---

Built with ❤️ using React, Vite & Tailwind CSS
