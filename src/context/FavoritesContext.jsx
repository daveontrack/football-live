import { createContext, useContext, useState, useEffect, useCallback } from "react";

const FavoritesContext = createContext();

const STORAGE_KEY = "footbuzz-favorites";

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { matchIds: [], teamNames: [], notifications: {} };
  } catch {
    return { matchIds: [], teamNames: [], notifications: {} };
  }
}

function saveToStorage(favs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(loadFromStorage);

  useEffect(() => {
    saveToStorage(favorites);
  }, [favorites]);

  // Toggle a match in/out of favorites
  const toggleMatch = useCallback((matchId) => {
    setFavorites((prev) => {
      const ids = prev.matchIds.includes(matchId)
        ? prev.matchIds.filter((id) => id !== matchId)
        : [...prev.matchIds, matchId];
      return { ...prev, matchIds: ids };
    });
  }, []);

  // Toggle a team name in/out of favorites
  const toggleTeam = useCallback((teamName) => {
    setFavorites((prev) => {
      const names = prev.teamNames.includes(teamName)
        ? prev.teamNames.filter((n) => n !== teamName)
        : [...prev.teamNames, teamName];
      return { ...prev, teamNames: names };
    });
  }, []);

  // Check if a match is favorited
  const isMatchFavorited = useCallback(
    (matchId) => favorites.matchIds.includes(matchId),
    [favorites.matchIds]
  );

  // Check if a team is favorited
  const isTeamFavorited = useCallback(
    (teamName) => favorites.teamNames.includes(teamName),
    [favorites.teamNames]
  );

  // Toggle notification for a match
  const toggleNotify = useCallback((type, id) => {
    setFavorites((prev) => {
      const key = `${type}_${id}`;
      const notifications = { ...prev.notifications };
      notifications[key] = !notifications[key];
      return { ...prev, notifications };
    });
  }, []);

  const isNotified = useCallback(
    (type, id) => favorites.notifications[`${type}_${id}`] || false,
    [favorites.notifications]
  );

  // Remove a match completely
  const removeMatch = useCallback((matchId) => {
    setFavorites((prev) => ({
      ...prev,
      matchIds: prev.matchIds.filter((id) => id !== matchId),
    }));
  }, []);

  // Remove a team completely
  const removeTeam = useCallback((teamName) => {
    setFavorites((prev) => ({
      ...prev,
      teamNames: prev.teamNames.filter((n) => n !== teamName),
    }));
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleMatch,
        toggleTeam,
        isMatchFavorited,
        isTeamFavorited,
        toggleNotify,
        isNotified,
        removeMatch,
        removeTeam,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
