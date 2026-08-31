import { useState, useEffect } from "react";
import {
  Clock,
  Newspaper,
  TrendingUp,
  ArrowRight,
  Tag,
  User,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { newsStyles as s } from "../assets/dummyStyles";
import {
  fetchFootballNews,
  fetchNewsByJournalist,
  ALL_JOURNALISTS,
  ALL_MEDIA,
} from "../services/newsApi";

function ArticleCard({ article, featured = false }) {
  const handleClick = () => {
    if (article.url && article.url !== "#") {
      window.open(article.url, "_blank", "noopener noreferrer");
    }
  };

  if (featured) {
    return (
      <article className={s.featuredArticle}>
        <div className={s.featuredImageWrapper}>
          {article.image ? (
            <img src={article.image} alt={article.title} className={s.featuredImage} />
          ) : (
            <div className="flex size-full items-center justify-center bg-white/5">
              <Newspaper size={48} className="text-white/10" />
            </div>
          )}
          <div className={s.featuredOverlay} />
        </div>
        <div className={s.featuredContent}>
          <div className={s.categoryBadge}>{article.category}</div>
          <h3 className={s.featuredTitle}>{article.title}</h3>
          <p className={s.featuredExcerpt}>{article.excerpt}</p>
          <div className={s.articleMeta}>
            <span className={s.metaItem}>
              <User size={12} />
              {article.author}
            </span>
            <span className={s.metaItem}>
              <Clock size={12} />
              {article.readTime}
            </span>
          </div>
          <a href={article.url} target="_blank" rel="noopener noreferrer" className={s.readMoreButton}>
            Read More <ArrowRight size={14} />
          </a>
        </div>
      </article>
    );
  }

  return (
    <article className={`${s.articleCard} card-glow-hover`} onClick={handleClick} style={{ cursor: article.url && article.url !== "#" ? "pointer" : "default" }}>
      <div className={s.articleImageWrapper}>
        {article.image ? (
          <img src={article.image} alt={article.title} className={s.articleImage} />
        ) : (
          <div className="flex size-full items-center justify-center bg-white/5">
            <Newspaper size={32} className="text-white/10" />
          </div>
        )}
      </div>
      <div className={s.articleContent}>
        <div className={s.articleHeader}>
          <span className={s.articleCategory}>{article.category}</span>
          <span className={s.articleDate}>{article.date}</span>
        </div>
        <h3 className={s.articleTitle}>{article.title}</h3>
        <p className={s.articleExcerpt}>{article.excerpt}</p>
        <div className={s.articleFooter}>
          <div className={s.tagsRow}>
            {article.tags.slice(0, 2).map((tag) => (
              <span key={tag} className={s.tag}>
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
          <span className={s.readTime}>{article.readTime}</span>
        </div>
      </div>
    </article>
  );
}

function SkeletonCard({ featured = false }) {
  if (featured) {
    return (
      <div className="animate-pulse overflow-hidden rounded-2xl sm:rounded-3xl">
        <div className="h-64 animate-pulse bg-white/5 sm:h-80" />
        <div className="space-y-3 bg-[#111] p-5 sm:p-8">
          <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
          <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />
          <div className="h-3 w-full animate-pulse rounded bg-white/10" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    );
  }
  return (
    <div className="glass-card animate-pulse overflow-hidden rounded-2xl sm:rounded-3xl">
      <div className="h-36 animate-pulse bg-white/5 sm:h-44" />
      <div className="space-y-2 p-4 sm:p-5">
        <div className="h-2 w-1/3 animate-pulse rounded bg-white/10" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
        <div className="h-2 w-full animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}

export default function NewsSection() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterType, setFilterType] = useState(null); // "journalist" or "media"
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState("none");
  const [error, setError] = useState(null);

  const loadNews = async (name = null) => {
    setLoading(true);
    setError(null);
    try {
      let result;
      if (name) {
        result = await fetchNewsByJournalist(name);
      } else {
        result = await fetchFootballNews();
      }
      setNewsArticles(result.articles);
      setDataSource(result.source);
    } catch (err) {
      setError(err.message);
      setNewsArticles([]);
      setDataSource("none");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleFilterClick = (name, type) => {
    if (activeFilter === name) {
      setActiveFilter(null);
      setFilterType(null);
      loadNews(null);
    } else {
      setActiveFilter(name);
      setFilterType(type);
      loadNews(name);
    }
  };

  const featuredArticle = newsArticles[0];
  const regularArticles = newsArticles.slice(1);

  return (
    <section id="news" className={s.section}>
      <div className={s.sectionHeader}>
        <span className={s.sectionLabel}>
          <Newspaper size={12} />
          Latest News
        </span>
        <h2 className={s.sectionTitle}>Football News & Stories</h2>
        <p className={s.sectionDescription}>
          Real football news from trusted journalists and football media.
        </p>

        {/* Journalist Filters */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
          <span className="mr-1 text-[9px] font-bold uppercase tracking-wider text-white/30">Journalists:</span>
          {ALL_JOURNALISTS.map((name) => (
            <button
              key={name}
              onClick={() => handleFilterClick(name, "journalist")}
              className={`rounded-full px-2 py-1 text-[9px] font-bold transition sm:px-2.5 sm:text-[10px] ${
                activeFilter === name
                  ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg"
                  : "border border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Media Filters */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
          <span className="mr-1 text-[9px] font-bold uppercase tracking-wider text-white/30">Media:</span>
          {ALL_MEDIA.map((name) => (
            <button
              key={name}
              onClick={() => handleFilterClick(name, "media")}
              className={`rounded-full px-2 py-1 text-[9px] font-bold transition sm:px-2.5 sm:text-[10px] ${
                activeFilter === name
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                  : "border border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Refresh + Source indicator */}
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={() => loadNews(activeFilter)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold text-white/50 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <span className="flex items-center gap-1.5 text-[10px] text-white/30">
            {dataSource === "newsdata" ? (
              <><Wifi size={10} className="text-green-400" /> Live via NewsData.io</>
            ) : dataSource === "rss" ? (
              <><Wifi size={10} className="text-blue-400" /> Live via RSS Feeds</>
            ) : (
              <><WifiOff size={10} /> No data</>
            )}
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-300">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className={s.articlesGrid}>
          <SkeletonCard featured />
          <div className={s.articlesList}>
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      )}

      {/* Articles */}
      {!loading && newsArticles.length > 0 && (
        <div className={s.articlesGrid}>
          {featuredArticle && (
            <ArticleCard article={featuredArticle} featured />
          )}
          <div className={s.articlesList}>
            {regularArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && newsArticles.length === 0 && (
        <div className="rounded-2xl border border-white/5 bg-white/5 p-8 text-center">
          <Newspaper size={32} className="mx-auto mb-3 text-white/10" />
          <p className="text-sm font-bold text-white/20">
            {activeFilter
              ? `No recent news available from ${activeFilter}.`
              : "No news available right now."}
          </p>
          <p className="mt-1 text-xs text-white/30">
            Try refreshing or selecting a different source.
          </p>
        </div>
      )}

      {/* Trending */}
      {!loading && newsArticles.length > 0 && (
        <div className={s.trendingSection}>
          <div className={s.trendingHeader}>
            <TrendingUp size={16} />
            <span>Trending Now</span>
          </div>
          <div className={s.trendingList}>
            {newsArticles.slice(0, 5).map((article, i) => (
              <div key={article.id} className={s.trendingItem}>
                <span className={s.trendingRank}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className={s.trendingTitle}>{article.title}</p>
                  <p className={s.trendingMeta}>{article.author} · {article.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
