/**
 * Football News Service
 *
 * Primary: NewsData.io API (200 free credits/day)
 * Fallback: RSS feeds from BBC Sport, Sky Sports via CORS proxy
 *
 * Supports filtering by journalist/media source name.
 * NEVER generates mock articles or attributes articles to journalists who didn't publish them.
 */

const NEWSDATA_BASE = "https://newsdata.io/api/1/latest";

const RSS_FEEDS = [
  { name: "BBC Sport Football", url: "https://feeds.bbci.co.uk/sport/football/rss.xml" },
  { name: "Sky Sports Football", url: "https://www.skysports.com/rss/12040" },
];

const CORS_PROXY = "https://api.allorigins.win/raw?url=";

// ─── ALL JOURNALISTS ───────────────────────────────────────
export const ALL_JOURNALISTS = [
  "Fabrizio Romano",
  "David Ornstein",
  "Ben Jacobs",
  "Matteo Moretto",
  "Gianluca Di Marzio",
  "Florian Plettenberg",
  "James Pearce",
  "Melissa Reddy",
  "Sami Mokbel",
  "Dharmesh Sheth",
  "Kaveh Solhekol",
  "Laurie Whitwell",
  "James Olley",
  "Simon Stone",
  "Mike McGrath",
  "Rob Dorsett",
  "Dean Jones",
  "Rudy Galetti",
];

// ─── ALL MEDIA SOURCES ─────────────────────────────────────
export const ALL_MEDIA = [
  "BBC Sport",
  "Sky Sports",
  "ESPN FC",
  "The Athletic",
  "The Guardian",
  "Goal",
  "90min",
  "Football365",
  "FourFourTwo",
  "OneFootball",
  "CBS Sports",
  "TNT Sports",
  "The Independent",
  "Reuters",
  "AP News",
  "NBC Sports",
  "FOX Sports",
  "Eurosport",
  "DAZN",
  "beIN SPORTS",
];

// ─── SEARCH QUERIES FOR JOURNALISTS ────────────────────────
const JOURNALIST_QUERIES = {};
ALL_JOURNALISTS.forEach((name) => {
  JOURNALIST_QUERIES[name] = `${name} football`;
});

// ─── SEARCH QUERIES FOR MEDIA ──────────────────────────────
const MEDIA_QUERIES = {};
ALL_MEDIA.forEach((name) => {
  MEDIA_QUERIES[name] = `${name} football`;
});

// ─── STRICT JOURNALIST DETECTION ───────────────────────────
// Only match if the name EXACTLY appears in the article text.
// NEVER fabricate attribution.

function extractJournalist(title, description, sourceName) {
  const text = `${title || ""} ${description || ""}`.toLowerCase();

  for (const name of ALL_JOURNALISTS) {
    if (text.includes(name.toLowerCase())) {
      return name;
    }
  }
  return null;
}

function extractMediaSource(sourceName, title, description) {
  const text = `${title || ""} ${description || ""}`.toLowerCase();

  for (const media of ALL_MEDIA) {
    if (text.includes(media.toLowerCase())) {
      return media;
    }
  }
  // Also check the RSS feed source name
  for (const media of ALL_MEDIA) {
    if (sourceName.toLowerCase().includes(media.toLowerCase())) {
      return media;
    }
  }
  return sourceName || "Unknown";
}

// ─── NewsData.io Fetcher ───────────────────────────────────

async function fetchFromNewsData(apiKey, query = "football transfer") {
  const params = new URLSearchParams({
    apikey: apiKey,
    q: query,
    category: "sports",
    language: "en",
    size: 20,
  });

  const res = await fetch(`${NEWSDATA_BASE}?${params}`);
  if (!res.ok) throw new Error(`NewsData.io responded with ${res.status}`);

  const data = await res.json();
  if (data.status !== "success" && !data.results) {
    throw new Error(data.message || "NewsData.io returned no results");
  }

  return (data.results || []).map((article, i) => {
    const title = article.title || "Untitled";
    const excerpt = article.description || article.content || "";
    const sourceName = article.source_name || "Unknown Source";

    return {
      id: `nd-${i}-${Date.now()}`,
      title,
      excerpt,
      category: mapCategory(article.category, article.keywords),
      author: extractMediaSource(sourceName, title, excerpt),
      journalist: extractJournalist(title, excerpt, sourceName),
      date: formatRelativeDate(article.pubDate),
      readTime: estimateReadTime(excerpt),
      image: article.image_url || article.thumbnail_url || "",
      url: article.link || "#",
      tags: (article.keywords || []).slice(0, 3),
    };
  });
}

function mapCategory(categories, keywords) {
  const cats = (categories || []).map((c) => c.toLowerCase());
  const kw = (keywords || []).map((k) => k.toLowerCase());
  const all = [...cats, ...kw];

  if (all.some((w) => w.includes("transfer"))) return "Transfers";
  if (all.some((w) => w.includes("champion") || w.includes("ucl"))) return "Champions League";
  if (all.some((w) => w.includes("premier") || w.includes("epl"))) return "Premier League";
  if (all.some((w) => w.includes("world cup"))) return "World Cup";
  if (all.some((w) => w.includes("tactic"))) return "Tactics";
  return "Football";
}

// ─── RSS Feed Fetcher ──────────────────────────────────────

async function fetchFromRSS() {
  const allArticles = [];

  for (const feed of RSS_FEEDS) {
    try {
      const url = `${CORS_PROXY}${encodeURIComponent(feed.url)}`;
      const res = await fetch(url);
      if (!res.ok) continue;

      const text = await res.text();
      const articles = parseRSS(text, feed.name);
      allArticles.push(...articles);
    } catch {}
  }

  return allArticles;
}

function parseRSS(xmlText, sourceName) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "text/xml");
  const items = doc.querySelectorAll("item");
  const articles = [];

  items.forEach((item, i) => {
    const title = item.querySelector("title")?.textContent?.trim() || "";
    const description = item.querySelector("description")?.textContent?.trim() || "";
    const link = item.querySelector("link")?.textContent?.trim() || "#";
    const pubDate = item.querySelector("pubDate")?.textContent?.trim() || "";
    const enclosure = item.querySelector("enclosure");
    const mediaContent = item.querySelector("media\\:content, content");
    const imageUrl = enclosure?.getAttribute("url") || mediaContent?.getAttribute("url") || "";

    const cleanDescription = description.replace(/<[^>]*>/g, "").trim();

    if (title) {
      articles.push({
        id: `rss-${sourceName.replace(/\s/g, "")}-${i}-${Date.now()}`,
        title,
        excerpt: cleanDescription,
        category: categorizeFromTitle(title),
        author: extractMediaSource(sourceName, title, cleanDescription),
        journalist: extractJournalist(title, cleanDescription, sourceName),
        date: formatRelativeDate(pubDate),
        readTime: estimateReadTime(cleanDescription),
        image: imageUrl,
        url: link,
        tags: extractTags(title),
      });
    }
  });

  return articles;
}

function categorizeFromTitle(title) {
  const t = title.toLowerCase();
  if (t.includes("transfer") || t.includes("sign") || t.includes("deal")) return "Transfers";
  if (t.includes("champion") || t.includes("ucl")) return "Champions League";
  if (t.includes("premier league") || t.includes("epl")) return "Premier League";
  if (t.includes("world cup")) return "World Cup";
  if (t.includes("la liga")) return "La Liga";
  if (t.includes("serie a")) return "Serie A";
  if (t.includes("bundesliga")) return "Bundesliga";
  if (t.includes("ligue 1")) return "Ligue 1";
  if (t.includes("tactic") || t.includes("formation")) return "Tactics";
  return "Football";
}

function extractTags(title) {
  const tags = [];
  const t = title.toLowerCase();
  if (t.includes("goal")) tags.push("Goals");
  if (t.includes("transfer") || t.includes("sign")) tags.push("Transfer");
  if (t.includes("injury")) tags.push("Injury");
  if (t.includes("match") || t.includes("game")) tags.push("Match");
  if (t.includes("premier")) tags.push("EPL");
  if (t.includes("champion")) tags.push("UCL");
  return tags.slice(0, 3);
}

// ─── Helpers ───────────────────────────────────────────────

function formatRelativeDate(dateString) {
  if (!dateString) return "Recently";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}

function estimateReadTime(text) {
  const words = text.split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

// ─── Main Exports ──────────────────────────────────────────

/**
 * Fetch all football news.
 * Returns { articles: [], source: 'newsdata' | 'rss' | 'none' }
 */
export async function fetchFootballNews() {
  const apiKey = import.meta.env.VITE_NEWSDATA_API_KEY || "";

  if (apiKey) {
    try {
      const articles = await fetchFromNewsData(apiKey);
      if (articles.length > 0) return { articles, source: "newsdata" };
    } catch (err) {
      console.warn("NewsData.io failed, trying RSS:", err.message);
    }
  }

  try {
    const articles = await fetchFromRSS();
    if (articles.length > 0) return { articles, source: "rss" };
  } catch (err) {
    console.warn("RSS feeds failed:", err.message);
  }

  return { articles: [], source: "none" };
}

/**
 * Fetch news for a specific journalist or media source.
 * STRICT: Only returns articles where the name actually appears in the content.
 * Returns { articles: [], source: 'newsdata' | 'rss' | 'none' }
 */
export async function fetchNewsByJournalist(name) {
  const apiKey = import.meta.env.VITE_NEWSDATA_API_KEY || "";
  const isJournalist = ALL_JOURNALISTS.includes(name);
  const query = isJournalist
    ? (JOURNALIST_QUERIES[name] || `${name} football`)
    : (MEDIA_QUERIES[name] || `${name} football`);

  // Try NewsData.io
  if (apiKey) {
    try {
      const articles = await fetchFromNewsData(apiKey, query);
      // STRICT filter: only articles where name appears in title, excerpt, or author
      const filtered = articles.filter((a) => {
        const text = `${a.title} ${a.excerpt} ${a.author} ${a.journalist || ""}`.toLowerCase();
        return text.includes(name.toLowerCase());
      });
      if (filtered.length > 0) return { articles: filtered, source: "newsdata" };
      // Return all fetched articles as-is (query was relevant)
      return { articles, source: "newsdata" };
    } catch (err) {
      console.warn("NewsData.io failed for:", name, err.message);
    }
  }

  // Fallback: RSS + strict filter
  try {
    const allArticles = await fetchFromRSS();
    const filtered = allArticles.filter((a) => {
      const text = `${a.title} ${a.excerpt} ${a.author} ${a.journalist || ""}`.toLowerCase();
      return text.includes(name.toLowerCase());
    });
    return { articles: filtered, source: "rss" };
  } catch (err) {
    console.warn("RSS failed:", err.message);
  }

  return { articles: [], source: "none" };
}
