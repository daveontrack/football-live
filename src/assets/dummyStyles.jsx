// assets/dummyStyles.js
export const navbarStyles = {
  // Outer nav container
  nav: "absolute left-0 right-0 top-0 z-30 px-3 pt-4 sm:px-6 sm:pt-10 lg:pt-12",

  // Inner flex container
  innerContainer:
    "mx-auto flex max-w-[1120px] items-center justify-between gap-3 text-white",

  // Logo link
  logo: "shrink-0 text-sm font-black uppercase tracking-tight sm:text-lg",

  // Desktop navigation wrapper
  desktopNav:
    "hidden items-center gap-8 text-[10px] font-bold uppercase tracking-wider text-white/70 md:flex lg:gap-12",

  // Desktop navigation links
  desktopNavLink: "transition hover:text-white",

  // Live stream button
  liveButton:
    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-black/80 px-2.5 py-2 text-[9px] font-bold text-white shadow-2xl shadow-black/30 backdrop-blur-sm transition hover:bg-black min-[380px]:gap-2 min-[380px]:px-3 min-[380px]:text-[10px] sm:px-4 sm:py-2.5",

  // Live icon (Circle)
  liveIcon: "fill-red-500 text-red-500",

  // Live text – full version (hidden below 360px)
  liveTextFull: "max-[359px]:hidden",

  // Live text – short version (visible only below 360px)
  liveTextShort: "min-[360px]:hidden",

  // Mobile hamburger button
  hamburgerButton:
    "grid size-9 place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm md:hidden",

  // Mobile menu overlay container
  mobileMenu:
    "absolute left-3 right-3 top-full mt-2 flex flex-col gap-1 rounded-2xl bg-black/90 p-3 backdrop-blur-xl sm:left-4 sm:right-4 sm:p-4 md:hidden",

  // Mobile menu links
  mobileMenuLink:
    "rounded-xl px-4 py-3 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white",
};



export const heroStyles = {
  // Section & containers
  section: "min-h-[100svh] bg-red-700",
  innerBg: "relative min-h-[100svh] w-full overflow-hidden bg-red-700",
  heroVideo: "absolute inset-0 size-full object-cover",
  overlayGradient: "absolute inset-0 bg-[radial-gradient(circle_at_42%_32%,rgba(255,60,60,0.24),transparent_28%),linear-gradient(180deg,transparent_55%,rgba(0,0,0,0.24)_100%)]",
  gridContainer: "relative z-10 mx-auto grid min-h-[100svh] max-w-[1280px] grid-cols-1 content-end px-4 pb-8 pt-24 min-[380px]:pt-28 sm:px-8 md:grid-cols-[220px_1fr_230px] md:content-stretch md:pb-12 md:pt-32 lg:px-12",

  // Stats aside
  statsAside: "grid w-full grid-cols-3 gap-3 md:mt-20 md:flex md:max-w-[180px] md:flex-col md:gap-7",
  statValue: "text-2xl font-black leading-none text-white drop-shadow-xl min-[380px]:text-3xl sm:text-[42px]",
  statLabel: "mt-1 text-[8px] font-black uppercase tracking-wider text-white/90 min-[380px]:text-[9px] sm:text-[10px]",

  // Heading block
  headingWrapper: "pointer-events-none relative flex min-w-0 items-end md:col-start-1 md:col-end-3 md:row-start-1",
  heading: "display-heading mb-3 max-w-full text-[58px] uppercase leading-[0.84] text-white drop-shadow-[0_14px_28px_rgba(0,0,0,0.35)] min-[380px]:text-[68px] sm:text-[112px] md:text-[136px] lg:text-[146px]",

  // Right panel (matches)
  rightPanel: "relative z-20 mt-5 w-full self-center justify-self-center min-[440px]:max-w-sm md:col-start-3 md:row-start-1 md:mt-0 md:max-w-none",
  featuredMatchCard: "rounded-2xl bg-black p-3 text-white shadow-2xl shadow-black/35 sm:rounded-[26px] sm:p-4",
  featuredMatchHeader: "mb-4 flex items-center justify-between",
  featuredMatchHeaderText: "text-xs font-black leading-tight",
  featuredMatchButton: "grid size-9 place-items-center rounded-full bg-white text-zinc-950 transition hover:bg-zinc-200",
  emptyState: "rounded-[26px] bg-black p-6 text-center text-sm font-bold text-white/50",

  // "More matches" row
  moreMatchesRow: "mt-4 flex items-center justify-between px-2",
  moreMatchesLabel: "text-[10px] font-black uppercase text-white/70",
  moreMatchesButton: "grid size-8 place-items-center rounded-full bg-white/16 text-white transition hover:bg-white/30",

  // Remaining matches grid
  remainingMatchesGrid: "mt-4 grid gap-3",

  // RealTeamBadge styles
  badgeBase: "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 bg-white text-xs font-black shadow-sm sm:size-12",
  badgeFeatured: "border-zinc-200",
  badgeDefault: "border-red-500/30",
  badgeLogo: "size-full object-contain p-1.5",
  badgeFallbackFeatured: "text-zinc-500",
  badgeFallbackDefault: "text-red-700",

  // MatchRow styles
  matchRowFeatured: "rounded-[28px] bg-white p-3 text-zinc-950",
  matchRowDefault: "rounded-[24px] bg-white/12 p-3 text-white backdrop-blur-sm",
  matchDate: "mb-3 truncate text-xs font-black leading-tight text-white/90",
  teamColumn: "grid w-[40%] justify-items-center gap-1",
  teamNameFeatured: "text-zinc-500",
  teamNameDefault: "text-white/80",
  teamNameBase: "w-full truncate text-center text-[10px] font-bold",
  vsBase: "text-xs font-black uppercase",
  vsFeatured: "text-zinc-950",
  vsDefault: "text-white/80",
  matchButton: "grid size-8 shrink-0 place-items-center rounded-full bg-white/20 text-white transition hover:bg-white/30",
};




export const mainSectionStyles = {
  // Main container & background glows
  mainContainer: "relative bg-[#0a0a0a] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20",
  glowLeft: "pointer-events-none absolute left-1/4 top-0 size-[500px] -translate-x-1/2 rounded-full bg-red-900/15 blur-[120px]",
  glowRight: "pointer-events-none absolute right-1/4 top-1/3 size-[400px] rounded-full bg-blue-900/10 blur-[100px]",
  innerWrapper: "relative mx-auto max-w-7xl",
  errorBanner: "mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-300 sm:mb-8 sm:text-sm",

  // SectionTitle
  sectionTitleWrapper: "mb-8 flex flex-col items-center gap-3 text-center sm:mb-12",
  sectionTitleLabel: "inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-red-400 sm:px-4 sm:text-[11px]",
  sectionTitleH2: "text-2xl font-black text-white sm:text-3xl lg:text-4xl",

  // TeamBadge
  teamBadgeBase: "flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10 font-black text-white",
  teamBadgeImg: "size-full object-contain p-1.5 sm:p-2",
  // sizes (sm, md, lg) - we keep dynamic, but reference base
  teamBadgeSizeSm: "size-10 text-[9px] sm:size-11",
  teamBadgeSizeMd: "size-11 text-[10px] sm:size-14 sm:text-xs",
  teamBadgeSizeLg: "size-14 text-sm sm:size-16",

  // MatchCenter section
  matchCenterSection: "mb-16 sm:mb-20",
  matchCenterGrid: "grid gap-4 sm:gap-5 lg:grid-cols-[1.1fr_.9fr]",
  // Featured card
  featuredCard: "relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-red-900 p-5 text-white shadow-[0_20px_60px_rgba(220,38,38,0.3)] sm:rounded-[28px] sm:p-8",
  featuredCardGlow1: "pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-white/5 blur-3xl",
  featuredCardGlow2: "pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-black/20 blur-3xl",
  featuredTopline: "mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-6",
  featuredStatus: "inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1",
  featuredViewButton: "inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase text-red-700 shadow-lg shadow-black/10 transition hover:bg-white/90",
  featuredLiveDot: "live-dot size-2 rounded-full bg-white",
  featuredStatusText: "text-[10px] font-black uppercase tracking-wider text-white/90 sm:text-xs",
  featuredTeamsGrid: "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-6",
  featuredTeamColumn: "grid min-w-0 justify-items-center gap-2 text-center sm:gap-3",
  featuredTeamName: "line-clamp-2 text-xs font-black leading-tight sm:text-lg",
  featuredVs: "rounded-xl bg-white/10 px-2.5 py-2 text-base font-black sm:px-5 sm:py-3 sm:text-2xl",
  featuredScore: "rounded-xl bg-white px-3 py-2 text-base font-black text-red-700 shadow-lg shadow-black/10 sm:px-5 sm:py-3 sm:text-2xl",
  featuredCompetition: "mt-5 rounded-xl bg-white/10 p-3 text-center sm:mt-6 sm:rounded-2xl sm:p-4",
  featuredCompetitionText: "text-xs font-semibold text-white/80 sm:text-sm",
  featuredInsightGrid: "mt-5 grid gap-2 sm:mt-6 sm:grid-cols-3",
  featuredInsightItem: "flex min-w-0 items-center gap-2 rounded-xl bg-white/10 p-3 text-[10px] font-semibold leading-snug text-white/80 sm:text-xs",
  featuredEmpty: "py-8 text-center text-sm font-semibold text-white/60",

  // Side matches list
  sideMatchesGrid: "grid gap-3",
  matchCenterStatsGrid: "grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2",
  matchCenterStatCard: "glass-card rounded-xl p-3 text-center sm:rounded-2xl",
  matchCenterStatValue: "block text-xl font-black text-white sm:text-2xl",
  matchCenterStatLabel: "mt-1 block text-[9px] font-black uppercase tracking-wider text-white/40",
  sideMatchCard: "glass-card group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl p-3 transition-all duration-300 hover:border-red-500/30 hover:bg-white/8 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-4 sm:rounded-2xl sm:p-4",
  sideMatchBadges: "flex -space-x-2 sm:-space-x-3",
  sideMatchInfo: "min-w-0",
  sideMatchTitle: "truncate text-xs font-black text-white sm:text-sm",
  sideMatchLeague: "mt-0.5 truncate text-[10px] font-semibold text-white/40 sm:text-xs",
  sideMatchStatus: "col-start-2 max-w-full justify-self-start truncate rounded-full bg-red-500/15 px-2 py-0.5 text-[9px] font-black uppercase text-red-400 transition hover:bg-red-500/25 sm:col-start-auto sm:px-3 sm:py-1 sm:text-[10px]",
  sideEmpty: "glass-card rounded-2xl p-6 text-center text-sm font-semibold text-white/40",

  // Live section
  liveSection: "mb-16 sm:mb-24",
  liveGrid: "grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3",

  // Standings section
  standingsSection: "mb-16 sm:mb-24",
  standingsCard: "glass-card overflow-hidden rounded-2xl sm:rounded-3xl",
  standingsRow: "group grid grid-cols-[36px_1fr_auto] items-center gap-3 border-b border-white/5 p-3 transition hover:bg-white/5 last:border-b-0 sm:grid-cols-[48px_1fr_auto] sm:gap-4 sm:p-4",
  standingsRank: "text-center text-lg font-black text-red-500 sm:text-xl",
  standingsTeamInfo: "min-w-0",
  standingsTeamName: "truncate text-sm font-black text-white sm:text-base",
  standingsTeamMeta: "truncate text-[10px] font-medium text-white/40 sm:text-xs",
  standingsTrophy: "text-white/15 transition group-hover:text-red-500/40",

  // Fixtures section
  fixturesSection: "mb-16 sm:mb-24",
  fixturesControls: "mb-8 flex flex-col items-stretch justify-between gap-4 sm:mb-10 sm:items-center lg:flex-row",
  datePills: "grid grid-cols-3 gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-sm sm:flex",
  dateButtonBase: "px-2 py-2 text-[9px] font-bold uppercase tracking-wider transition min-[380px]:text-[10px] sm:px-5 sm:py-2.5 sm:text-xs disabled:opacity-50",
  dateButtonActive: "rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg",
  dateButtonInactive: "rounded-full text-white/50 hover:bg-white/10 hover:text-white",
  searchWrapper: "relative w-full sm:max-w-sm",
  searchIcon: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-white/30",
  searchInput: "w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-white/30 backdrop-blur-sm transition focus:border-red-500/50 focus:bg-white/10 focus:outline-none sm:text-sm",
  fixturesGrid: "grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3",
  fixtureCard: "glass-card group flex flex-col justify-between rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:bg-white/8 sm:rounded-3xl sm:p-6",
  fixtureTeamsGrid: "mb-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2 sm:mb-6 sm:gap-3",
  fixtureTeamColumn: "flex min-w-0 flex-col items-center gap-2 text-center sm:gap-3",
  fixtureTeamName: "line-clamp-2 text-[10px] font-bold leading-tight text-white/70 sm:text-xs",
  fixtureVs: "rounded-xl bg-white/5 px-2.5 py-2 text-sm font-black text-white/60 sm:px-3 sm:text-lg",
  fixtureScore: "rounded-xl bg-white px-3 py-2 text-sm font-black text-red-600 shadow-lg shadow-black/20 sm:px-4 sm:text-lg",
  fixtureInfo: "mb-4 text-center sm:mb-5",
  fixtureLeague: "text-xs font-bold text-white/70 sm:text-sm",
  fixtureDate: "mt-1 text-[10px] font-semibold text-white/30 sm:text-xs",
  ticketButton: "inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-[10px] font-bold text-white shadow-lg shadow-red-500/20 transition hover:shadow-red-500/40 sm:px-5 sm:py-2.5 sm:text-xs",

  // Match details dialog
  matchDialogBackdrop: "fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 py-6 backdrop-blur-sm",
  matchDialog: "max-h-[88svh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#111111] p-5 text-white shadow-2xl sm:rounded-3xl sm:p-6",
  matchDialogHeader: "mb-5 flex items-start justify-between gap-4",
  matchDialogKicker: "text-[10px] font-black uppercase tracking-widest text-red-400",
  matchDialogTitle: "mt-1 text-lg font-black leading-tight sm:text-2xl",
  matchDialogClose: "grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20",
  matchDialogScoreGrid: "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 rounded-2xl bg-white/5 p-4",
  matchDialogTeam: "grid min-w-0 justify-items-center gap-2 text-center text-xs font-black leading-tight sm:text-sm",
  matchDialogScore: "grid justify-items-center rounded-2xl bg-white px-4 py-3 text-red-600 shadow-lg shadow-black/20",
  matchDialogFacts: "mt-4 grid gap-3",
  matchDialogFact: "flex min-w-0 items-center gap-2 rounded-xl bg-white/5 p-3 text-xs font-semibold text-white/70",

  // Empty helper
  emptyBase: "glass-card rounded-2xl p-6 text-center text-sm font-medium text-white/40",
};


export const liveScoreCardStyles = {
  // TeamLogo
  teamLogoContainer:
    "flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10 text-[10px] font-black text-white sm:size-14",
  teamLogoImg: "size-full object-contain p-2",

  // LiveScoreCard article
  card: "group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(239,68,68,0.2)] sm:rounded-3xl sm:p-6",
  glowRed: "pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-red-500/10 blur-3xl transition-all duration-500 group-hover:bg-red-500/20",
  glowBlue: "pointer-events-none absolute -bottom-10 -left-10 size-32 rounded-full bg-blue-500/8 blur-3xl",

  // Header
  header: "relative mb-4 flex items-center justify-between sm:mb-5",
  leagueText: "max-w-[60%] truncate text-[10px] font-bold uppercase tracking-wider text-white/50 sm:text-xs",
  liveBadge: "flex items-center gap-1.5 rounded-full bg-red-500/20 px-2.5 py-1 sm:px-3",
  liveDot: "live-dot size-1.5 rounded-full bg-red-500 sm:size-2",
  liveText: "text-[9px] font-black uppercase tracking-wider text-red-400 sm:text-[10px]",

  // Teams + Score grid
  teamsGrid: "relative grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2",
  teamColumn: "flex min-w-0 flex-col items-center gap-2 text-center sm:gap-3",
  teamName: "line-clamp-2 text-[10px] font-bold leading-tight text-white/80 sm:text-xs",
  scoreBox: "rounded-2xl bg-white/5 px-3 py-2.5 sm:px-6 sm:py-3",
  scoreText: "text-center text-xl font-black tracking-tight text-white min-[380px]:text-2xl sm:text-3xl",
  colon: "text-red-500",

  // Footer
  divider: "mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent sm:mt-5",
  footerText: "mt-3 text-center text-[9px] font-semibold uppercase tracking-wider text-white/30 sm:text-[10px]",
};


export const footerStyles = {
  footer: "overflow-hidden bg-[#0a0a0a] px-3 pt-8 pb-0 sm:px-6 sm:pt-10",
  wordmark: "footer-wordmark pointer-events-none block w-full select-none whitespace-nowrap text-center text-[clamp(3rem,18vw,15rem)] uppercase leading-none sm:text-[clamp(4.5rem,16vw,18rem)]",
};



// ═══════════════════════════════════════════════════════════
// NEWS SECTION
// ═══════════════════════════════════════════════════════════
export const newsStyles = {
  section: "mb-16 sm:mb-24",
  sectionHeader: "mb-8 flex flex-col items-center gap-3 text-center sm:mb-12",
  sectionLabel: "inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-red-400 sm:px-4 sm:text-[11px]",
  sectionTitle: "text-2xl font-black text-white sm:text-3xl lg:text-4xl",
  sectionDescription: "max-w-xl text-sm text-white/50 sm:text-base",

  categoryFilter: "mb-8 flex flex-wrap items-center justify-center gap-2 sm:mb-10",
  categoryButton: "rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold text-white/50 transition hover:bg-white/10 hover:text-white sm:px-4 sm:text-xs",
  categoryButtonActive: "border-red-500/30 bg-red-500/15 text-red-400 hover:bg-red-500/20",

  articlesGrid: "grid gap-6 lg:grid-cols-[1.2fr_1fr]",
  featuredArticle: "group relative overflow-hidden rounded-2xl sm:rounded-3xl",
  featuredImageWrapper: "relative h-64 overflow-hidden sm:h-80",
  featuredImage: "size-full object-cover transition duration-500 group-hover:scale-105",
  featuredOverlay: "absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent",
  featuredContent: "absolute inset-x-0 bottom-0 p-5 sm:p-8",
  categoryBadge: "mb-3 inline-block rounded-full bg-red-500 px-3 py-1 text-[10px] font-black uppercase text-white",
  featuredTitle: "mb-2 text-xl font-black leading-tight text-white sm:text-2xl",
  featuredExcerpt: "mb-4 max-w-lg text-xs text-white/70 sm:text-sm",
  articleMeta: "mb-4 flex items-center gap-4 text-[10px] text-white/50 sm:text-xs",
  metaItem: "inline-flex items-center gap-1.5",
  readMoreButton: "inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[10px] font-black text-black transition hover:bg-white/90 sm:text-xs",

  articlesList: "grid gap-4 sm:grid-cols-2",
  articleCard: "group glass-card overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30 sm:rounded-3xl",
  articleImageWrapper: "relative h-36 overflow-hidden sm:h-44",
  articleImage: "size-full object-cover transition duration-500 group-hover:scale-105",
  articleContent: "p-4 sm:p-5",
  articleHeader: "mb-2 flex items-center justify-between",
  articleCategory: "text-[10px] font-black uppercase text-red-400",
  articleDate: "text-[10px] text-white/30",
  articleTitle: "mb-2 text-sm font-black leading-snug text-white sm:text-base",
  articleExcerpt: "mb-3 text-xs leading-relaxed text-white/50 line-clamp-2",
  articleFooter: "flex items-center justify-between",
  tagsRow: "flex items-center gap-1.5",
  tag: "inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[9px] text-white/40",
  readTime: "text-[10px] text-white/30",

  trendingSection: "mt-10 rounded-2xl bg-white/5 p-5 sm:rounded-3xl sm:p-6",
  trendingHeader: "mb-4 flex items-center gap-2 text-sm font-black text-white sm:text-base",
  trendingList: "grid gap-3 sm:grid-cols-2",
  trendingItem: "flex items-start gap-3 rounded-xl p-2 transition hover:bg-white/5",
  trendingRank: "text-lg font-black text-red-500/40",
  trendingTitle: "text-xs font-bold text-white sm:text-sm",
  trendingMeta: "mt-0.5 text-[10px] text-white/30",
};



// ═══════════════════════════════════════════════════════════
// PLAYER STATS
// ═══════════════════════════════════════════════════════════
export const playerStyles = {
  section: "mb-16 sm:mb-24",
  sectionHeader: "mb-8 flex flex-col items-center gap-3 text-center sm:mb-12",
  sectionLabel: "inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-red-400 sm:px-4 sm:text-[11px]",
  sectionTitle: "text-2xl font-black text-white sm:text-3xl lg:text-4xl",
  sectionDescription: "max-w-xl text-sm text-white/50 sm:text-base",

  controls: "mb-8 flex flex-col items-stretch justify-between gap-4 sm:mb-10 sm:flex-row sm:items-center",
  positionFilter: "flex flex-wrap gap-1 rounded-full border border-white/10 bg-white/5 p-1",
  positionButton: "rounded-full px-3 py-1.5 text-[10px] font-bold text-white/50 transition hover:bg-white/10 hover:text-white sm:text-xs",
  positionButtonActive: "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg",
  searchWrapper: "relative w-full sm:max-w-sm",
  searchIcon: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-white/30",
  searchInput: "w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-white/30 backdrop-blur-sm transition focus:border-red-500/50 focus:bg-white/10 focus:outline-none sm:text-sm",

  playersGrid: "grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4",
  playerCard: "glass-card group cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30 sm:rounded-3xl",
  playerImageWrapper: "relative h-40 overflow-hidden sm:h-48",
  playerImage: "size-full object-cover transition duration-500 group-hover:scale-105",
  playerNumber: "absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-black text-white backdrop-blur-sm",
  playerInfo: "p-4 sm:p-5",
  playerName: "mb-1 text-sm font-black text-white sm:text-base",
  playerTeam: "mb-2 text-[10px] text-white/40 sm:text-xs",
  playerTags: "mb-3 flex items-center gap-2",
  positionTag: "rounded-full bg-red-500/15 px-2 py-0.5 text-[9px] font-bold text-red-400",
  nationalityTag: "rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-bold text-white/40",
  quickStats: "grid grid-cols-3 gap-2 rounded-xl bg-white/5 p-3",
  quickStat: "text-center",
  quickStatValue: "block text-sm font-black text-white sm:text-base",
  quickStatLabel: "text-[9px] text-white/40",

  emptyState: "glass-card rounded-2xl p-8 text-center text-sm font-medium text-white/40",

  detailBackdrop: "fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 py-6 backdrop-blur-sm",
  detailPanel: "max-h-[88svh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#111] p-5 text-white sm:rounded-3xl sm:p-6",
  detailHeader: "mb-6 flex items-start justify-between gap-4",
  detailPlayerInfo: "flex items-center gap-4",
  detailImage: "size-16 rounded-full border-2 border-white/10 object-cover sm:size-20",
  detailName: "text-lg font-black sm:text-xl",
  detailTeam: "text-xs text-white/50",
  detailTags: "mt-2 flex items-center gap-2",
  detailPosition: "rounded-full bg-red-500/15 px-2 py-0.5 text-[9px] font-bold text-red-400",
  detailNationality: "rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-bold text-white/40",
  detailAge: "rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-bold text-white/40",
  closeButton: "grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20",

  statsGrid: "mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4",
  statCard: "glass-card flex flex-col items-center gap-1 rounded-xl p-3 sm:rounded-2xl sm:p-4",
  statIcon: "text-red-400",
  statValue: "text-xl font-black text-white sm:text-2xl",
  statLabel: "text-[9px] uppercase text-white/40",

  detailStatsSection: "rounded-2xl bg-white/5 p-4 sm:p-5",
  detailStatsTitle: "mb-4 text-sm font-black text-white",
  statBarRow: "mb-3 flex items-center gap-3",
  statBarLabel: "w-24 text-[10px] font-semibold text-white/50 sm:text-xs",
  statBarTrack: "h-2 flex-1 overflow-hidden rounded-full bg-white/10",
  statBarFill: "h-full rounded-full transition-all duration-500",
  statBarRed: "bg-gradient-to-r from-red-600 to-red-400",
  statBarGreen: "bg-gradient-to-r from-green-600 to-green-400",
  statBarYellow: "bg-gradient-to-r from-yellow-600 to-yellow-400",
  statBarValue: "w-8 text-right text-[10px] font-bold text-white/60",
};



// ═══════════════════════════════════════════════════════════
// TEAMS DIRECTORY
// ═══════════════════════════════════════════════════════════
export const teamsStyles = {
  section: "mb-16 sm:mb-24",
  sectionHeader: "mb-8 flex flex-col items-center gap-3 text-center sm:mb-12",
  sectionLabel: "inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-red-400 sm:px-4 sm:text-[11px]",
  sectionTitle: "text-2xl font-black text-white sm:text-3xl lg:text-4xl",
  sectionDescription: "max-w-xl text-sm text-white/50 sm:text-base",

  controls: "mb-8 flex flex-col items-stretch justify-between gap-4 sm:mb-10 sm:flex-row sm:items-center",
  leagueFilter: "flex flex-wrap gap-1 rounded-full border border-white/10 bg-white/5 p-1",
  leagueButton: "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold text-white/50 transition hover:bg-white/10 hover:text-white sm:text-xs",
  leagueButtonActive: "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg",
  leagueButtonText: "hidden min-[420px]:inline",
  searchWrapper: "relative w-full sm:max-w-sm",
  searchIcon: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-white/30",
  searchInput: "w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-white/30 backdrop-blur-sm transition focus:border-red-500/50 focus:bg-white/10 focus:outline-none sm:text-sm",

  teamsGrid: "grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4",
  teamCard: "glass-card group cursor-pointer overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30 sm:rounded-3xl sm:p-6",
  cardHeader: "mb-4 flex items-center gap-3",
  teamLogo: "size-12 rounded-full border border-white/10 object-cover sm:size-14",
  cardHeaderInfo: "min-w-0 flex-1",
  teamName: "truncate text-sm font-black text-white sm:text-base",
  teamLeague: "text-[10px] text-white/40",
  chevron: "shrink-0 text-white/20 transition group-hover:text-red-400",
  cardStats: "mb-3 flex items-center gap-3",
  cardStat: "inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-[10px] text-white/50",
  starsRow: "flex flex-wrap gap-1.5",
  starBadge: "inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[9px] text-white/40",

  emptyState: "glass-card rounded-2xl p-8 text-center text-sm font-medium text-white/40",

  detailBackdrop: "fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 py-6 backdrop-blur-sm",
  detailPanel: "max-h-[88svh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#111] p-5 text-white sm:rounded-3xl sm:p-6",
  detailHeader: "mb-6 flex items-start justify-between gap-4",
  detailTeamInfo: "flex items-center gap-4",
  detailLogo: "size-16 rounded-full border-2 border-white/10 object-cover sm:size-20",
  detailName: "text-lg font-black sm:text-xl",
  detailLeague: "text-xs text-white/50",
  closeButton: "grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20",

  infoGrid: "mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4",
  infoCard: "glass-card flex flex-col items-center gap-1 rounded-xl p-3 sm:rounded-2xl sm:p-4",
  infoIcon: "text-red-400",
  infoValue: "text-sm font-black text-white sm:text-base",
  infoLabel: "text-[9px] uppercase text-white/40",

  leagueStatsSection: "mb-6 rounded-2xl bg-white/5 p-4 sm:p-5",
  sectionSubtitle: "mb-3 text-sm font-black text-white",
  leagueStatRow: "flex items-center justify-between border-b border-white/5 py-2 last:border-b-0",
  leagueStatLabel: "text-xs text-white/50",
  leagueStatValue: "text-sm font-black text-white",

  starsSection: "rounded-2xl bg-white/5 p-4 sm:p-5",
  starsList: "flex flex-wrap gap-2",
  starItem: "inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/70",
  starIcon: "text-yellow-500",
};



// ═══════════════════════════════════════════════════════════
// FAVORITES / WATCHLIST
// ═══════════════════════════════════════════════════════════
export const favoritesStyles = {
  section: "mb-16 sm:mb-24",
  sectionHeader: "mb-8 flex flex-col items-center gap-3 text-center sm:mb-12",
  sectionLabel: "inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-red-400 sm:px-4 sm:text-[11px]",
  sectionTitle: "text-2xl font-black text-white sm:text-3xl lg:text-4xl",
  sectionDescription: "max-w-xl text-sm text-white/50 sm:text-base",

  controls: "mb-8 flex flex-col items-stretch justify-between gap-4 sm:mb-10 sm:flex-row sm:items-center",
  tabBar: "flex gap-1 rounded-full border border-white/10 bg-white/5 p-1",
  tab: "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold text-white/50 transition hover:bg-white/10 hover:text-white sm:text-xs",
  tabActive: "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg",
  searchWrapper: "relative w-full sm:max-w-sm",
  searchIcon: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-white/30",
  searchInput: "w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-white/30 backdrop-blur-sm transition focus:border-red-500/50 focus:bg-white/10 focus:outline-none sm:text-sm",

  matchesGrid: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
  matchCard: "glass-card overflow-hidden rounded-2xl p-4 sm:rounded-3xl sm:p-5",
  matchCardHeader: "mb-3 flex items-center justify-between",
  matchLeague: "text-[10px] font-bold uppercase text-white/40",
  matchActions: "flex items-center gap-1.5",
  notifyButton: "grid size-7 place-items-center rounded-full bg-white/5 text-white/40 transition hover:bg-white/10 hover:text-white",
  bellActive: "text-yellow-400",
  removeButton: "grid size-7 place-items-center rounded-full bg-white/5 text-white/40 transition hover:bg-red-500/20 hover:text-red-400",
  matchTeams: "mb-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2",
  matchTeam: "flex flex-col items-center gap-1.5 text-center",
  teamLogo: "size-10 rounded-full border border-white/10 object-cover sm:size-12",
  teamLogoFallback: "flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[9px] font-black text-white sm:size-12",
  teamName: "text-[10px] font-bold text-white/70 sm:text-xs",
  matchScore: "flex items-center gap-1.5 rounded-xl bg-white/5 px-2.5 py-1.5",
  liveDot: "size-1.5 rounded-full bg-red-500",
  scoreText: "text-sm font-black text-white",
  matchDate: "text-center text-[10px] text-white/30",

  teamsGrid: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
  teamCard: "glass-card overflow-hidden rounded-2xl p-4 text-center sm:rounded-3xl sm:p-5",
  teamCardActions: "mb-3 flex items-center justify-end gap-1.5",
  teamCardLogo: "mx-auto mb-3 size-16 rounded-full border border-white/10 object-cover sm:size-20",
  teamCardName: "mb-1 text-sm font-black text-white sm:text-base",
  teamCardLeague: "text-[10px] text-white/40",

  emptyState: "glass-card col-span-full flex flex-col items-center gap-3 rounded-2xl p-8 text-center sm:rounded-3xl",
  emptyIcon: "text-white/10",
  emptyHint: "text-xs text-white/30",
};



// ═══════════════════════════════════════════════════════════
// HIGHLIGHTS & VIDEOS
// ═══════════════════════════════════════════════════════════
export const highlightsStyles = {
  section: "mb-16 sm:mb-24",
  sectionHeader: "mb-8 flex flex-col items-center gap-3 text-center sm:mb-12",
  sectionLabel: "inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-red-400 sm:px-4 sm:text-[11px]",
  sectionTitle: "text-2xl font-black text-white sm:text-3xl lg:text-4xl",
  sectionDescription: "max-w-xl text-sm text-white/50 sm:text-base",

  leagueFilter: "mb-8 flex flex-wrap items-center justify-center gap-2 sm:mb-10",
  leagueButton: "rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold text-white/50 transition hover:bg-white/10 hover:text-white sm:px-4 sm:text-xs",
  leagueButtonActive: "border-red-500/30 bg-red-500/15 text-red-400 hover:bg-red-500/20",

  highlightsGrid: "grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3",
  highlightCard: "glass-card group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30 sm:rounded-3xl",
  thumbnailWrapper: "relative h-40 cursor-pointer overflow-hidden sm:h-48",
  thumbnail: "size-full object-cover transition duration-500 group-hover:scale-105",
  thumbnailOverlay: "absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100",
  playButton: "grid size-14 place-items-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 transition hover:bg-red-400",
  durationBadge: "absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm",
  highlightInfo: "p-4 sm:p-5",
  highlightHeader: "mb-2 flex items-center justify-between",
  highlightLeague: "text-[10px] font-bold uppercase text-red-400",
  highlightDate: "text-[10px] text-white/30",
  highlightTitle: "mb-2 text-sm font-black leading-snug text-white sm:text-base",
  highlightMeta: "flex items-center gap-3 text-[10px] text-white/40",
  metaItem: "inline-flex items-center gap-1",

  emptyState: "glass-card col-span-full rounded-2xl p-8 text-center text-sm font-medium text-white/40",

  modalBackdrop: "fixed inset-0 z-50 grid place-items-center bg-black/80 px-4 py-6 backdrop-blur-sm",
  modal: "max-h-[88svh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#111] p-5 text-white sm:rounded-3xl sm:p-6",
  modalHeader: "mb-4 flex items-start justify-between gap-4",
  modalTitle: "text-lg font-black sm:text-xl",
  closeButton: "grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20",
  videoWrapper: "relative mb-4 aspect-video overflow-hidden rounded-xl bg-black",
  videoPlaceholder: "flex size-full flex-col items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#0f3460]",
  videoPlaceholderIcon: "mb-3 text-white/30",
  videoPlaceholderText: "text-sm font-bold text-white/50",
  videoPlaceholderSub: "text-xs text-white/30",
  modalMeta: "flex items-center justify-center gap-4 text-xs text-white/40",
};



// ═══════════════════════════════════════════════════════════
// THEME TOGGLE
// ═══════════════════════════════════════════════════════════
export const themeToggleStyles = {
  button: "grid size-8 place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20",
};



// ═══════════════════════════════════════════════════════════
// WATCH LIVE PAGE
// ═══════════════════════════════════════════════════════════
export const watchLiveStyles = {
  page: "min-h-screen bg-[#0a0a0a] px-4 py-8 sm:px-6 sm:py-12 lg:px-8",
  container: "mx-auto max-w-7xl",

  // Header
  header: "mb-8 sm:mb-12",
  headerTop: "mb-4 flex flex-wrap items-center justify-between gap-3",
  headerLabel: "inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-red-400 sm:px-4 sm:text-[11px]",
  headerStats: "flex items-center gap-3",
  liveCountBadge: "inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 text-[10px] font-black uppercase text-red-400",
  upcomingBadge: "inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase text-white/40",
  headerTitle: "text-2xl font-black text-white sm:text-3xl lg:text-4xl",
  headerDescription: "mt-2 max-w-xl text-sm text-white/50 sm:text-base",

  // Controls
  controls: "mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between",
  filterRow: "flex flex-wrap gap-1 rounded-full border border-white/10 bg-white/5 p-1",
  filterButton: "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold text-white/50 transition hover:bg-white/10 hover:text-white sm:text-xs",
  filterButtonActive: "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg",
  leagueFilterRow: "flex flex-wrap gap-1 rounded-full border border-white/10 bg-white/5 p-1",
  leagueButton: "rounded-full px-3 py-1.5 text-[10px] font-bold text-white/50 transition hover:bg-white/10 hover:text-white sm:text-xs",
  leagueButtonActive: "border-red-500/30 bg-red-500/15 text-red-400",
  searchWrapper: "relative w-full sm:max-w-sm",
  searchIcon: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-white/30",
  searchInput: "w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-white/30 backdrop-blur-sm transition focus:border-red-500/50 focus:bg-white/10 focus:outline-none sm:text-sm",

  // Refresh row
  refreshRow: "mb-6 flex items-center justify-between",
  refreshButton: "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold text-white/50 transition hover:bg-white/10 hover:text-white disabled:opacity-50 sm:text-xs",
  matchCount: "text-[10px] text-white/30",

  // Error
  errorBanner: "mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-300",

  // Matches grid
  matchesGrid: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
  loadingGrid: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
  skeletonCard: "rounded-2xl border border-white/5 bg-white/5 p-5",

  // Match card
  matchCard: "group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:shadow-[0_20px_60px_rgba(239,68,68,0.15)] sm:rounded-3xl sm:p-6",
  liveGlow: "pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-red-500/15 blur-3xl",
  cardHeader: "relative mb-4 flex items-center justify-between sm:mb-5",
  leagueText: "max-w-[50%] truncate text-[10px] font-bold uppercase tracking-wider text-white/50 sm:text-xs",
  kickoffTime: "rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold text-white/60",
  statusBadge: "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider sm:px-3 sm:text-[10px]",
  statusBadgeLive: "bg-red-500/20 text-red-400",
  statusBadgeFinished: "bg-white/10 text-white/40",
  statusBadgeUpcoming: "bg-blue-500/15 text-blue-400",

  // Teams + Score
  teamsGrid: "relative grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2",
  teamColumn: "flex min-w-0 flex-col items-center gap-2 text-center sm:gap-3",
  teamName: "line-clamp-2 text-[10px] font-bold leading-tight text-white/80 sm:text-xs",
  scoreBox: "rounded-2xl bg-white/5 px-3 py-2.5 sm:px-6 sm:py-3",
  scoreText: "text-center text-xl font-black tracking-tight text-white min-[380px]:text-2xl sm:text-3xl",
  colon: "text-red-500",
  vsText: "text-lg font-black text-white/30",

  // Team badge
  teamBadgeBase: "flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10 font-black text-white",
  teamBadgeImg: "size-full object-contain p-1.5",

  // Card footer
  cardFooter: "mt-4",
  watchLiveButton: "flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-red-500/30 transition hover:shadow-red-500/50 sm:text-sm",
  watchReplayButton: "flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-white/60 transition hover:bg-white/10 hover:text-white sm:text-sm",
  watchUpcomingButton: "flex w-full items-center justify-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2.5 text-xs font-bold text-blue-400 transition hover:bg-blue-500/20 sm:text-sm",

  // Empty state
  emptyState: "rounded-2xl border border-white/5 bg-white/5 p-12 text-center",
};



// ═══════════════════════════════════════════════════════════
// MATCH WATCH PAGE
// ═══════════════════════════════════════════════════════════
export const matchWatchStyles = {
  page: "min-h-screen bg-[#0a0a0a]",

  // Back bar
  backBar: "sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-[#0a0a0a]/90 px-4 py-3 backdrop-blur-xl sm:px-6",
  backButton: "inline-flex items-center gap-2 text-xs font-bold text-white/60 transition hover:text-white sm:text-sm",
  backTitle: "text-[10px] font-bold uppercase tracking-wider text-white/30 sm:text-xs",

  // Video container
  videoContainer: "relative w-full bg-black",
  videoIframe: "aspect-video w-full border-0",
  videoElement: "size-full object-contain",
  videoPlaceholder: "flex aspect-video w-full flex-col items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#0f3460]",
  videoPlaceholderText: "text-sm font-bold text-white/50",
  noStreamPlaceholder: "flex aspect-video w-full flex-col items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] px-6",
  videoControls: "absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-gradient-to-t from-black/80 to-transparent p-4",
  controlButton: "grid size-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20",

  // Info bar
  infoBar: "border-b border-white/5 bg-[#111] px-4 py-5 sm:px-6",
  infoBarContent: "mx-auto max-w-4xl",
  infoLeague: "mb-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400",
  infoTeams: "grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8",
  infoTeam: "flex flex-col items-center gap-2 text-center",
  infoTeamName: "text-xs font-black text-white sm:text-sm",
  infoScoreBox: "flex flex-col items-center gap-1 rounded-2xl bg-white/5 px-4 py-3 sm:px-8 sm:py-4",
  infoScore: "text-2xl font-black text-white sm:text-4xl",
  infoStatus: "text-[10px] font-bold uppercase tracking-wider text-white/40",

  // Team badge
  teamBadgeBase: "flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10 font-black text-white",
  teamBadgeImg: "size-full object-contain p-1.5",

  // Content grid
  contentGrid: "mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[1fr_350px] lg:gap-8",
  contentMain: "space-y-6",
  contentSide: "space-y-6",

  // Details card
  detailsCard: "rounded-2xl border border-white/5 bg-white/5 p-5 sm:rounded-3xl sm:p-6",
  detailsTitle: "mb-4 text-sm font-black text-white sm:text-base",
  detailsGrid: "space-y-3",
  detailItem: "flex items-start gap-3 rounded-xl bg-white/5 p-3",
  detailLabel: "text-[10px] font-bold uppercase tracking-wider text-white/40",
  detailValue: "text-xs font-semibold text-white sm:text-sm",

  // Events card
  eventsCard: "rounded-2xl border border-white/5 bg-white/5 p-5 sm:rounded-3xl sm:p-6",
  eventsTitle: "mb-4 text-sm font-black text-white sm:text-base",
  eventsList: "space-y-2",
  eventItem: "flex items-center gap-3 rounded-xl bg-white/5 p-3 text-xs",
  eventTime: "w-10 text-center font-bold text-white/40",
  eventText: "font-semibold text-white",

  // Lineups card
  lineupsCard: "rounded-2xl border border-white/5 bg-white/5 p-5 sm:rounded-3xl sm:p-6",
  lineupsTitle: "mb-4 text-sm font-black text-white sm:text-base",
  lineupsGrid: "grid grid-cols-3 items-center gap-4",
  lineupTeam: "text-center",
  lineupTeamName: "text-xs font-black text-white sm:text-sm",
  lineupFormation: "mt-1 text-[10px] font-bold text-white/40",
  lineupsDivider: "h-px w-full bg-white/10",

  // Notice card
  noticeCard: "flex items-start gap-3 rounded-2xl border border-green-500/10 bg-green-500/5 p-4",
  noticeTitle: "text-xs font-black text-green-400",
  noticeText: "mt-1 text-[10px] leading-relaxed text-white/30",
};
