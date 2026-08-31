import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import MainSection from "./components/MainSection";
import Navbar from "./components/Navbar";
import NewsSection from "./components/NewsSection";
import PlayerStats from "./components/PlayerStats";
import TeamsDirectory from "./components/TeamsDirectory";
import Favorites from "./components/Favorites";
import Highlights from "./components/Highlights";
import LiveRatings from "./components/LiveRatings";
import WatchLive from "./pages/WatchLive";
import MatchWatch from "./pages/MatchWatch";
import { ThemeProvider } from "./context/ThemeContext";
import { FavoritesProvider } from "./context/FavoritesContext";

function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <Hero />
      <MainSection />
      <NewsSection />
      <PlayerStats />
      <TeamsDirectory />
      <Highlights />
      <LiveRatings />
      <Favorites />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/watch-live" element={<WatchLive />} />
            <Route path="/watch/:matchId" element={<MatchWatch />} />
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
