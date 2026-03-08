const API_BASE = "https://clash-xi-api.lowkeyy9191.workers.dev";

const el = (id) => document.getElementById(id);
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SLOT_KEYS = ["GK", "LB", "CB1", "CB2", "RB", "CM1", "CM2", "CAM", "LW", "ST", "RW"];

const DEFAULT_RULES = {
  maxOpenListings: 5,
  feeBps: 500,
  minPrice: {
    COMMON: 10,
    UNCOMMON: 18,
    RARE: 25,
    EPIC: 60,
    LEGENDARY: 150,
    ICON: 600
  }
};

const FORMATIONS = ["343", "433", "442", "451", "4231", "352"];
const TACTIC_MODES = ["balanced", "highpress", "counter", "control"];
const MARKET_TABS = ["players", "packs", "coins"];

const RARITY_ORDER = {
  COMMON: 1,
  UNCOMMON: 2,
  RARE: 3,
  EPIC: 4,
  LEGENDARY: 5,
  ICON: 6
};

const PACK_MARKET_PRODUCTS = {
  kickoff: {
    key: "kickoff",
    title: "Kickoff Pack",
    pityBase: 10,
    odds: [
      { rarity: "COMMON", chance: "70.0%" },
      { rarity: "UNCOMMON", chance: "18.0%" },
      { rarity: "RARE", chance: "8.0%" },
      { rarity: "EPIC", chance: "3.0%" },
      { rarity: "LEGENDARY", chance: "0.8%" },
      { rarity: "ICON", chance: "0.2%" }
    ]
  },
  pro: {
    key: "pro",
    title: "Pro Pack",
    pityBase: 8,
    odds: [
      { rarity: "UNCOMMON", chance: "52.0%" },
      { rarity: "RARE", chance: "28.0%" },
      { rarity: "EPIC", chance: "13.0%" },
      { rarity: "LEGENDARY", chance: "5.2%" },
      { rarity: "ICON", chance: "1.8%" }
    ]
  },
  legendary: {
    key: "legendary",
    title: "Legendary Chest",
    pityBase: 6,
    odds: [
      { rarity: "RARE", chance: "38.0%" },
      { rarity: "EPIC", chance: "36.0%" },
      { rarity: "LEGENDARY", chance: "20.0%" },
      { rarity: "ICON", chance: "6.0%" }
    ]
  },
  icon: {
    key: "icon",
    title: "Icon Capsule",
    pityBase: 4,
    odds: [
      { rarity: "EPIC", chance: "36.0%" },
      { rarity: "LEGENDARY", chance: "42.0%" },
      { rarity: "ICON", chance: "22.0%" }
    ]
  }
};

const COIN_BUNDLE_DATA = {
  starter: { key: "starter", name: "Starter Bundle", fc: 1000, bonus: 0, price: "$0.99" },
  boost: { key: "boost", name: "Boost Bundle", fc: 5500, bonus: 500, price: "$4.99" },
  bestvalue: { key: "bestvalue", name: "Best Value Bundle", fc: 12000, bonus: 2000, price: "$9.99" },
  whale: { key: "whale", name: "Founders Vault", fc: 100000, bonus: 0, price: "$79.99" }
};

const TACTICAL_ROLES = {
  GOALKEEPER: "GOALKEEPER",
  CENTER_BACK: "CENTER_BACK",
  FULLBACK_WINGBACK: "FULLBACK_WINGBACK",
  DEFENSIVE_MID: "DEFENSIVE_MID",
  CENTRAL_MID: "CENTRAL_MID",
  ATTACKING_MID: "ATTACKING_MID",
  WIDE_FORWARD: "WIDE_FORWARD",
  STRIKER: "STRIKER"
};

const ROLE_OPTIONS = {
  [TACTICAL_ROLES.GOALKEEPER]: ["Shot Stopper", "Sweeper Keeper", "Distributor"],
  [TACTICAL_ROLES.CENTER_BACK]: ["Stopper", "Ball Player", "Cover"],
  [TACTICAL_ROLES.FULLBACK_WINGBACK]: ["Fullback", "Wingback", "Inverted Fullback"],
  [TACTICAL_ROLES.DEFENSIVE_MID]: ["Anchor", "Ball Winner", "Deep Pivot"],
  [TACTICAL_ROLES.CENTRAL_MID]: ["Box to Box", "Tempo Controller", "Deep Lying Playmaker"],
  [TACTICAL_ROLES.ATTACKING_MID]: ["Creator", "Shadow Striker", "Playmaker"],
  [TACTICAL_ROLES.WIDE_FORWARD]: ["Winger", "Inside Forward", "Wide Threat"],
  [TACTICAL_ROLES.STRIKER]: ["Target Man", "Poacher", "False 9", "Advanced Forward"]
};

const TRAIT_LIBRARY = [
  { key: "Tireless Engine", desc: "Maintains output deeper into the match.", tags: ["CM", "CDM", "LB", "RB", "LW", "RW"], minRarity: "COMMON" },
  { key: "Clinical Finisher", desc: "Improves final-third shot quality.", tags: ["ST", "CAM", "LW", "RW"], minRarity: "RARE" },
  { key: "Aerial Threat", desc: "Dangerous in crosses and set pieces.", tags: ["ST", "CB"], minRarity: "COMMON" },
  { key: "Press Leader", desc: "Improves aggressive ball recovery patterns.", tags: ["CM", "CDM", "CAM", "ST", "LW", "RW"], minRarity: "COMMON" },
  { key: "Visionary Pass", desc: "Unlocks cleaner progressive passing lanes.", tags: ["CM", "CAM", "CDM"], minRarity: "RARE" },
  { key: "Last Man Wall", desc: "Strong emergency defending and recovery.", tags: ["CB", "LB", "RB", "GK"], minRarity: "COMMON" },
  { key: "Rapid Burst", desc: "Explosive acceleration in transition moments.", tags: ["LW", "RW", "ST", "LB", "RB"], minRarity: "RARE" },
  { key: "Set Piece Specialist", desc: "Extra value from dead-ball situations.", tags: ["CAM", "CM", "ST"], minRarity: "EPIC" },
  { key: "Tempo Dictator", desc: "Stabilizes possession and match rhythm.", tags: ["CM", "CDM", "CAM"], minRarity: "RARE" },
  { key: "League Legend", desc: "Signature top-tier trait with elite impact moments.", tags: ["ST", "CAM", "CM", "CB"], minRarity: "ICON" }
];

const FORMATION_ROLE_MAP = {
  "433": {
    GK:  { role: TACTICAL_ROLES.GOALKEEPER, allowed: ["GK"] },
    LB:  { role: TACTICAL_ROLES.FULLBACK_WINGBACK, allowed: ["LB"] },
    CB1: { role: TACTICAL_ROLES.CENTER_BACK, allowed: ["CB"] },
    CB2: { role: TACTICAL_ROLES.CENTER_BACK, allowed: ["CB"] },
    RB:  { role: TACTICAL_ROLES.FULLBACK_WINGBACK, allowed: ["RB"] },
    CM1: { role: TACTICAL_ROLES.CENTRAL_MID, allowed: ["CM", "CDM"] },
    CM2: { role: TACTICAL_ROLES.CENTRAL_MID, allowed: ["CM", "CDM"] },
    CAM: { role: TACTICAL_ROLES.ATTACKING_MID, allowed: ["CAM", "CM"] },
    LW:  { role: TACTICAL_ROLES.WIDE_FORWARD, allowed: ["LW"] },
    ST:  { role: TACTICAL_ROLES.STRIKER, allowed: ["ST"] },
    RW:  { role: TACTICAL_ROLES.WIDE_FORWARD, allowed: ["RW"] }
  },
  "442": {
    GK:  { role: TACTICAL_ROLES.GOALKEEPER, allowed: ["GK"] },
    LB:  { role: TACTICAL_ROLES.FULLBACK_WINGBACK, allowed: ["LB"] },
    CB1: { role: TACTICAL_ROLES.CENTER_BACK, allowed: ["CB"] },
    CB2: { role: TACTICAL_ROLES.CENTER_BACK, allowed: ["CB"] },
    RB:  { role: TACTICAL_ROLES.FULLBACK_WINGBACK, allowed: ["RB"] },
    LW:  { role: TACTICAL_ROLES.WIDE_FORWARD, allowed: ["LW", "LM"] },
    CM1: { role: TACTICAL_ROLES.CENTRAL_MID, allowed: ["CM", "CDM"] },
    CM2: { role: TACTICAL_ROLES.CENTRAL_MID, allowed: ["CM", "CDM"] },
    RW:  { role: TACTICAL_ROLES.WIDE_FORWARD, allowed: ["RW", "RM"] },
    CAM: { role: TACTICAL_ROLES.STRIKER, allowed: ["ST", "CF"] },
    ST:  { role: TACTICAL_ROLES.STRIKER, allowed: ["ST", "CF"] }
  },
  "451": {
    GK:  { role: TACTICAL_ROLES.GOALKEEPER, allowed: ["GK"] },
    LB:  { role: TACTICAL_ROLES.FULLBACK_WINGBACK, allowed: ["LB"] },
    CB1: { role: TACTICAL_ROLES.CENTER_BACK, allowed: ["CB"] },
    CB2: { role: TACTICAL_ROLES.CENTER_BACK, allowed: ["CB"] },
    RB:  { role: TACTICAL_ROLES.FULLBACK_WINGBACK, allowed: ["RB"] },
    LW:  { role: TACTICAL_ROLES.WIDE_FORWARD, allowed: ["LW", "LM"] },
    CM1: { role: TACTICAL_ROLES.CENTRAL_MID, allowed: ["CM", "CDM"] },
    CAM: { role: TACTICAL_ROLES.ATTACKING_MID, allowed: ["CAM", "CM"] },
    CM2: { role: TACTICAL_ROLES.CENTRAL_MID, allowed: ["CM", "CDM"] },
    RW:  { role: TACTICAL_ROLES.WIDE_FORWARD, allowed: ["RW", "RM"] },
    ST:  { role: TACTICAL_ROLES.STRIKER, allowed: ["ST"] }
  },
  "4231": {
    GK:  { role: TACTICAL_ROLES.GOALKEEPER, allowed: ["GK"] },
    LB:  { role: TACTICAL_ROLES.FULLBACK_WINGBACK, allowed: ["LB"] },
    CB1: { role: TACTICAL_ROLES.CENTER_BACK, allowed: ["CB"] },
    CB2: { role: TACTICAL_ROLES.CENTER_BACK, allowed: ["CB"] },
    RB:  { role: TACTICAL_ROLES.FULLBACK_WINGBACK, allowed: ["RB"] },
    CM1: { role: TACTICAL_ROLES.DEFENSIVE_MID, allowed: ["CDM", "CM"] },
    CM2: { role: TACTICAL_ROLES.DEFENSIVE_MID, allowed: ["CDM", "CM"] },
    LW:  { role: TACTICAL_ROLES.WIDE_FORWARD, allowed: ["LW", "LM"] },
    CAM: { role: TACTICAL_ROLES.ATTACKING_MID, allowed: ["CAM"] },
    RW:  { role: TACTICAL_ROLES.WIDE_FORWARD, allowed: ["RW", "RM"] },
    ST:  { role: TACTICAL_ROLES.STRIKER, allowed: ["ST"] }
  },
  "343": {
    GK:  { role: TACTICAL_ROLES.GOALKEEPER, allowed: ["GK"] },
    CB1: { role: TACTICAL_ROLES.CENTER_BACK, allowed: ["CB"] },
    CB2: { role: TACTICAL_ROLES.CENTER_BACK, allowed: ["CB"] },
    RB:  { role: TACTICAL_ROLES.CENTER_BACK, allowed: ["CB", "RB"] },
    LB:  { role: TACTICAL_ROLES.FULLBACK_WINGBACK, allowed: ["LB", "LM"] },
    CM1: { role: TACTICAL_ROLES.CENTRAL_MID, allowed: ["CM", "CDM"] },
    CM2: { role: TACTICAL_ROLES.CENTRAL_MID, allowed: ["CM", "CDM"] },
    CAM: { role: TACTICAL_ROLES.FULLBACK_WINGBACK, allowed: ["RM", "RW", "RB"] },
    LW:  { role: TACTICAL_ROLES.WIDE_FORWARD, allowed: ["LW"] },
    ST:  { role: TACTICAL_ROLES.STRIKER, allowed: ["ST"] },
    RW:  { role: TACTICAL_ROLES.WIDE_FORWARD, allowed: ["RW"] }
  },
  "352": {
    GK:  { role: TACTICAL_ROLES.GOALKEEPER, allowed: ["GK"] },
    CB1: { role: TACTICAL_ROLES.CENTER_BACK, allowed: ["CB"] },
    CB2: { role: TACTICAL_ROLES.CENTER_BACK, allowed: ["CB"] },
    RB:  { role: TACTICAL_ROLES.CENTER_BACK, allowed: ["CB", "RB"] },
    LB:  { role: TACTICAL_ROLES.FULLBACK_WINGBACK, allowed: ["LB", "LM"] },
    CM1: { role: TACTICAL_ROLES.CENTRAL_MID, allowed: ["CM", "CDM"] },
    CAM: { role: TACTICAL_ROLES.ATTACKING_MID, allowed: ["CAM", "CM"] },
    CM2: { role: TACTICAL_ROLES.CENTRAL_MID, allowed: ["CM", "CDM"] },
    RW:  { role: TACTICAL_ROLES.FULLBACK_WINGBACK, allowed: ["RM", "RW", "RB"] },
    LW:  { role: TACTICAL_ROLES.STRIKER, allowed: ["ST", "CF"] },
    ST:  { role: TACTICAL_ROLES.STRIKER, allowed: ["ST", "CF"] }
  }
};

const FORMATION_LAYOUTS = {
  "433": {
    GK: { x: 50, y: 85 }, LB: { x: 16, y: 70 }, CB1: { x: 38, y: 72 }, CB2: { x: 62, y: 72 }, RB: { x: 84, y: 70 },
    CM1: { x: 28, y: 50 }, CM2: { x: 72, y: 50 }, CAM: { x: 50, y: 38 }, LW: { x: 18, y: 16 }, ST: { x: 50, y: 10 }, RW: { x: 82, y: 16 }
  },
  "442": {
    GK: { x: 50, y: 85 }, LB: { x: 16, y: 70 }, CB1: { x: 38, y: 72 }, CB2: { x: 62, y: 72 }, RB: { x: 84, y: 70 },
    LW: { x: 16, y: 48 }, CM1: { x: 38, y: 50 }, CM2: { x: 62, y: 50 }, RW: { x: 84, y: 48 }, CAM: { x: 40, y: 18 }, ST: { x: 60, y: 18 }
  },
  "451": {
    GK: { x: 50, y: 85 }, LB: { x: 16, y: 70 }, CB1: { x: 38, y: 72 }, CB2: { x: 62, y: 72 }, RB: { x: 84, y: 70 },
    LW: { x: 12, y: 46 }, CM1: { x: 32, y: 50 }, CAM: { x: 50, y: 46 }, CM2: { x: 68, y: 50 }, RW: { x: 88, y: 46 }, ST: { x: 50, y: 12 }
  },
  "4231": {
    GK: { x: 50, y: 85 }, LB: { x: 16, y: 70 }, CB1: { x: 38, y: 72 }, CB2: { x: 62, y: 72 }, RB: { x: 84, y: 70 },
    CM1: { x: 40, y: 56 }, CM2: { x: 60, y: 56 }, LW: { x: 18, y: 34 }, CAM: { x: 50, y: 34 }, RW: { x: 82, y: 34 }, ST: { x: 50, y: 12 }
  },
  "343": {
    GK: { x: 50, y: 85 }, CB1: { x: 28, y: 70 }, CB2: { x: 50, y: 72 }, RB: { x: 72, y: 70 },
    LB: { x: 18, y: 48 }, CM1: { x: 40, y: 50 }, CM2: { x: 60, y: 50 }, CAM: { x: 82, y: 48 }, LW: { x: 18, y: 16 }, ST: { x: 50, y: 10 }, RW: { x: 82, y: 16 }
  },
  "352": {
    GK: { x: 50, y: 85 }, CB1: { x: 28, y: 70 }, CB2: { x: 50, y: 72 }, RB: { x: 72, y: 70 },
    LB: { x: 16, y: 48 }, CM1: { x: 36, y: 50 }, CAM: { x: 50, y: 42 }, CM2: { x: 64, y: 50 }, RW: { x: 84, y: 48 }, LW: { x: 40, y: 16 }, ST: { x: 60, y: 16 }
  }
};

const LEAGUE_TEAM_POOL = [
  { id: "you", name: "Your Club", bot: false, base: 0 },
  { id: "topside", name: "Topside FC", bot: false, base: 84 },
  { id: "northxi", name: "North XI", bot: true, base: 82 },
  { id: "ironeleven", name: "Iron Eleven", bot: false, base: 80 },
  { id: "dockside", name: "Dockside SC", bot: true, base: 76 },
  { id: "eastborough", name: "East Borough", bot: true, base: 74 },
  { id: "harborcity", name: "Harbor City", bot: false, base: 79 },
  { id: "royalforge", name: "Royal Forge", bot: true, base: 81 },
  { id: "stormathletic", name: "Storm Athletic", bot: true, base: 77 },
  { id: "capitalrover", name: "Capital Rovers", bot: true, base: 75 }
];

function normalizeRarity(rarity) {
  const r = String(rarity || "COMMON").trim().toUpperCase();
  if (r === "LEG") return "LEGENDARY";
  if (r === "UNCO" || r === "UNCOMMON") return "UNCOMMON";
  return RARITY_ORDER[r] ? r : "COMMON";
}

function priceFmt(n) {
  const num = Number(n || 0);
  return `${num.toLocaleString("en-GB")} FC`;
}

function debounce(fn, wait = 300) {
  let t = null;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

function tacticDescriptors(mode) {
  const map = {
    balanced: { front: "Wide Forwards", mid: "Progressive Build", def: "Medium Block" },
    highpress: { front: "Aggressive Runs", mid: "Ball Recovery", def: "High Line" },
    counter: { front: "Direct Breaks", mid: "Vertical Launch", def: "Compact Block" },
    control: { front: "Patient Width", mid: "Tempo Control", def: "Structured Press" }
  };
  return map[mode] || map.balanced;
}

function savedTemplateLabel() {
  const map = {
    balanced: "Balanced Press",
    highpress: "High Press Trigger",
    counter: "Counter Burst",
    control: "Control Shape"
  };
  return map[state.tacticMode] || "Balanced Press";
}

function loadBenchState() {
  try {
    const raw = JSON.parse(localStorage.getItem("kf_bench") || "[]");
    if (!Array.isArray(raw)) return Array(7).fill(null);
    return raw.slice(0, 7).concat(Array(Math.max(0, 7 - raw.length)).fill(null));
  } catch {
    return Array(7).fill(null);
  }
}

function loadRoleOverrides() {
  try {
    const raw = JSON.parse(localStorage.getItem("kf_role_overrides") || "{}");
    return raw && typeof raw === "object" ? raw : {};
  } catch {
    return {};
  }
}

function saveRoleOverrides() {
  localStorage.setItem("kf_role_overrides", JSON.stringify(state.roleOverrides || {}));
}

function defaultLeagueState() {
  return {
    joined: false,
    seasonNumber: 4,
    tier: "OPEN",
    seasonStartIso: null,
    userSelectedMd: false
  };
}

function loadLeagueState() {
  try {
    const raw = JSON.parse(localStorage.getItem("kf_league_state") || "null");
    if (!raw || typeof raw !== "object") return defaultLeagueState();
    return { ...defaultLeagueState(), ...raw };
  } catch {
    return defaultLeagueState();
  }
}

function saveLeagueState() {
  localStorage.setItem("kf_league_state", JSON.stringify(state.league));
}

function loadPackPityState() {
  try {
    const raw = JSON.parse(localStorage.getItem("kf_pack_pity") || "{}");
    return raw && typeof raw === "object" ? raw : {};
  } catch {
    return {};
  }
}

function savePackPityState() {
  localStorage.setItem("kf_pack_pity", JSON.stringify(state.packPity || {}));
}

const state = {
  token: localStorage.getItem("cx_token") || null,
  userId: localStorage.getItem("cx_user") || null,
  revealIndex: 0,
  revealCards: [],
  revealing: false,
  inventory: [],
  inventoryLoaded: false,
  squad: {},
  bench: loadBenchState(),
  roleOverrides: loadRoleOverrides(),
  compareBench: false,
  selectedCardId: null,
  filter: "ALL",
  style: localStorage.getItem("cx_style") || "PRESS",
  arenaMode: "BRONZE",
  walletCoins: null,
  battlepass: null,
  market: {
    activeTab: "players",
    query: "",
    rarityFilter: "ALL",
    positionFilter: "ALL",
    sort: "PRICE_ASC",
    selectedCoinBundle: null,
    listings: [],
    mine: [],
    trades: [],
    pulse: { last: null, chg24h: null, points: [] },
    rules: DEFAULT_RULES,
    listedSet: new Set()
  },
  daily: null,
  cosmetics: [],
  isPro: false,
  activeView: "home",
  countdownTimer: null,
  formation: localStorage.getItem("kf_formation") || "433",
  tacticMode: localStorage.getItem("kf_tactic_mode") || "balanced",
  tacticsLocked: false,
  activeMatchday: Number(localStorage.getItem("kf_active_md") || 0) || 0,
  teamValidation: null,
  dragPayload: null,
  league: loadLeagueState(),
  packPity: loadPackPityState()
};

function normalizeCard(raw) {
  if (!raw) return null;
  return {
    ...raw,
    id: raw.id || raw.cardId || raw.card_id || crypto.randomUUID(),
    display_name: raw.display_name || raw.displayName || raw.name || "Unknown",
    role: raw.role || raw.playerRole || raw.archetype || "Utility Role",
    position: raw.position || raw.pos || "CM",
    rarity: normalizeRarity(raw.rarity || "COMMON")
  };
}

function normalizePosition(pos) {
  return String(pos || "").trim().toUpperCase();
}

function getFormationRoleMap(formation) {
  return FORMATION_ROLE_MAP[formation] || FORMATION_ROLE_MAP["433"];
}

function getFriendlyTacticalRole(role) {
  if (!role) return "Role";
  return String(role).replaceAll("_", " ");
}

function getSlotMeta(slotKey) {
  const roleMap = getFormationRoleMap(state.formation);
  return roleMap[slotKey] || null;
}

function getSlotRoleOverride(slotKey) {
  return state.roleOverrides?.[slotKey] || "";
}

function setSlotRoleOverride(slotKey, roleName) {
  if (!slotKey) return;
  if (!roleName) delete state.roleOverrides[slotKey];
  else state.roleOverrides[slotKey] = roleName;
  saveRoleOverrides();
}

function getSlotRoleDisplay(slotKey) {
  return getSlotRoleOverride(slotKey) || getFriendlyTacticalRole(getSlotMeta(slotKey)?.role);
}

function getShortRoleDisplay(slotKey) {
  const label = getSlotRoleDisplay(slotKey);
  return label.length > 14 ? `${label.slice(0, 12)}…` : label;
}

function ensureBenchState() {
  if (!Array.isArray(state.bench)) state.bench = Array(7).fill(null);
  state.bench = state.bench.slice(0, 7).concat(Array(Math.max(0, 7 - state.bench.length)).fill(null));
}

function saveBenchState() {
  ensureBenchState();
  localStorage.setItem("kf_bench", JSON.stringify(state.bench));
}

function getCardById(id) {
  return state.inventory.find((c) => c.id === id) || null;
}

function getSquadSlotOfCard(cardId) {
  for (const [slotKey, id] of Object.entries(state.squad)) {
    if (id === cardId) return slotKey;
  }
  return null;
}

function findBenchIndexByCardId(cardId) {
  ensureBenchState();
  return state.bench.findIndex((id) => id === cardId);
}

function removeCardFromBench(cardId, exceptIndex = null) {
  ensureBenchState();
  state.bench = state.bench.map((id, idx) => (id === cardId && idx !== exceptIndex ? null : id));
}

function firstEmptyBenchIndex() {
  ensureBenchState();
  return state.bench.findIndex((id) => !id);
}

function reconcileBenchWithState() {
  ensureBenchState();

  const squadIds = new Set(Object.values(state.squad).filter(Boolean));
  const inventoryIds = state.inventoryLoaded ? new Set(state.inventory.map((c) => c.id)) : null;
  const seen = new Set();

  state.bench = state.bench.map((cardId) => {
    if (!cardId) return null;
    if (inventoryIds && !inventoryIds.has(cardId)) return null;
    if (squadIds.has(cardId)) return null;
    if (seen.has(cardId)) return null;
    seen.add(cardId);
    return cardId;
  });

  saveBenchState();
}

function canEquipSelected() {
  return !!state.selectedCardId && !state.market.listedSet.has(state.selectedCardId);
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return function () {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randIntSeed(rnd, min, max) {
  return Math.floor(rnd() * (max - min + 1)) + min;
}

function clampStat(n) {
  return Math.max(35, Math.min(99, n));
}

function clamp(num, min, max) {
  return Math.max(min, Math.min(max, num));
}

function roleStyle(role) {
  const r = (role || "").toLowerCase();
  if (r.includes("press") || r.includes("ball winner") || r.includes("aggressive") || r.includes("overlap")) return "PRESS";
  if (r.includes("playmaking") || r.includes("tempo") || r.includes("ball-playing")) return "POSSESSION";
  if (r.includes("poacher") || r.includes("direct") || r.includes("ghost")) return "COUNTER";
  return "PRESS";
}

function cardVisualModel(card) {
  const c = normalizeCard(card);
  const seed = hashString(`${c.id}|${c.display_name}|${c.position}|${c.role}|${c.rarity}`);
  const rnd = mulberry32(seed);

  const rarityBase = {
    COMMON: 62,
    UNCOMMON: 67,
    RARE: 72,
    EPIC: 82,
    LEGENDARY: 91,
    ICON: 95
  }[c.rarity] ?? 62;

  const posBoost = {
    GK: { pace: -10, pass: 0, attack: -18, defense: 18 },
    CB: { pace: -4, pass: 1, attack: -10, defense: 15 },
    LB: { pace: 6, pass: 4, attack: -2, defense: 8 },
    RB: { pace: 6, pass: 4, attack: -2, defense: 8 },
    CDM: { pace: 0, pass: 8, attack: -5, defense: 12 },
    CM: { pace: 1, pass: 10, attack: 3, defense: 5 },
    CAM: { pace: 3, pass: 12, attack: 10, defense: -6 },
    LW: { pace: 12, pass: 4, attack: 12, defense: -10 },
    RW: { pace: 12, pass: 4, attack: 12, defense: -10 },
    ST: { pace: 10, pass: 0, attack: 16, defense: -14 }
  }[normalizePosition(c.position)] || { pace: 0, pass: 0, attack: 0, defense: 0 };

  const boost = roleStyle(c.role);
  const mods = { pace: 0, pass: 0, attack: 0, defense: 0 };
  if (boost === "PRESS") { mods.pace += 3; mods.defense += 4; }
  if (boost === "POSSESSION") { mods.pass += 5; mods.attack += 2; }
  if (boost === "COUNTER") { mods.pace += 5; mods.attack += 5; }

  if (state.tacticMode === "highpress") { mods.pace += 2; mods.defense += 2; }
  if (state.tacticMode === "counter") { mods.pace += 3; mods.attack += 2; }
  if (state.tacticMode === "control") { mods.pass += 4; }

  const pace = clampStat(rarityBase + posBoost.pace + mods.pace + randIntSeed(rnd, -4, 6));
  const pass = clampStat(rarityBase + posBoost.pass + mods.pass + randIntSeed(rnd, -4, 6));
  const attack = clampStat(rarityBase + posBoost.attack + mods.attack + randIntSeed(rnd, -4, 6));
  const defense = clampStat(rarityBase + posBoost.defense + mods.defense + randIntSeed(rnd, -4, 6));
  const ovr = clampStat(Math.round((pace + pass + attack + defense) / 4));

  return { ovr, pace, pass, attack, defense };
}

function getDetailedStats(card) {
  const vm = cardVisualModel(card);
  const seed = hashString(`${card.id}|detail|${card.rarity}|${card.position}`);
  const rnd = mulberry32(seed);

  const drb = clampStat(Math.round((vm.pace * 0.35) + (vm.attack * 0.35) + (vm.pass * 0.30)) + randIntSeed(rnd, -3, 3));
  const stm = clampStat(Math.round((vm.pace * 0.30) + (vm.defense * 0.30) + (vm.pass * 0.20) + (vm.attack * 0.20)) + randIntSeed(rnd, -3, 3));

  return [
    { key: "PAC", label: "Pace", value: vm.pace },
    { key: "SHT", label: "Shot", value: vm.attack },
    { key: "PAS", label: "Pass", value: vm.pass },
    { key: "DEF", label: "Defense", value: vm.defense },
    { key: "DRB", label: "Dribble", value: drb },
    { key: "STM", label: "Stamina", value: stm }
  ];
}

function generateCardTraits(card) {
  const rarity = normalizeRarity(card?.rarity || "COMMON");
  const count = rarity === "ICON" ? 3 : rarity === "LEGENDARY" ? 3 : rarity === "EPIC" ? 3 : rarity === "RARE" ? 2 : 1;
  const position = normalizePosition(card?.position);
  const seed = hashString(`${card?.id}|traits|${rarity}|${position}|${card?.role || ""}`);
  const rnd = mulberry32(seed);

  const filtered = TRAIT_LIBRARY.filter((t) => {
    const req = RARITY_ORDER[normalizeRarity(t.minRarity)] || 1;
    const have = RARITY_ORDER[rarity] || 1;
    return have >= req && t.tags.includes(position);
  });

  const fallback = TRAIT_LIBRARY.filter((t) => (RARITY_ORDER[rarity] || 1) >= (RARITY_ORDER[normalizeRarity(t.minRarity)] || 1));
  const pool = filtered.length ? filtered.slice() : fallback.slice();
  const picked = [];

  while (pool.length && picked.length < count) {
    const idx = Math.floor(rnd() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }

  return picked;
}

function getSerialText(card) {
  const c = normalizeCard(card);
  const base = Math.abs(hashString(`${c.id}|serial`)) % 99999;
  const serial = String(base + 1).padStart(5, "0");
  if (normalizeRarity(c.rarity) === "ICON") {
    const cap = "5,000";
    const current = String((base % 5000) + 1).padStart(2, "0");
    return `#${current},${String((base % 1000)).padStart(3, "0")} / ${cap}`;
  }
  return `#${serial}`;
}

function buildTeamModel() {
  const roleMap = getFormationRoleMap(state.formation);
  const slots = SLOT_KEYS.map((slotKey) => {
    const card = getCardById(state.squad[slotKey]);
    const meta = roleMap[slotKey] || null;
    const allowedPositions = (meta?.allowed || []).map(normalizePosition);
    const cardPosition = normalizePosition(card?.position);
    const isNaturalFit = !!card && allowedPositions.includes(cardPosition);

    return {
      slotKey,
      tacticalRole: meta?.role || null,
      roleOverride: getSlotRoleOverride(slotKey),
      allowedPositions,
      cardId: card?.id || null,
      card,
      cardPosition,
      isNaturalFit
    };
  });

  const equippedCards = slots.filter((s) => s.card).map((s) => s.card);
  const avgOvr = equippedCards.length
    ? Math.round(equippedCards.reduce((sum, c) => sum + cardVisualModel(c).ovr, 0) / equippedCards.length)
    : 0;

  return {
    formation: state.formation,
    tacticMode: state.tacticMode,
    style: state.style,
    locked: state.tacticsLocked,
    slots,
    equippedCount: equippedCards.length,
    avgOvr
  };
}

function validateTeamModel(team = buildTeamModel()) {
  const missingSlots = [];
  const duplicateCards = [];
  const listedConflicts = [];
  const offPositionAssignments = [];
  const warnings = [];

  const seenCardIds = new Set();
  const rolelessSlots = [];

  team.slots.forEach((slot) => {
    if (!slot.tacticalRole) rolelessSlots.push(slot.slotKey);
    if (!slot.cardId) {
      missingSlots.push(slot.slotKey);
      return;
    }

    if (seenCardIds.has(slot.cardId)) duplicateCards.push(slot.cardId);
    else seenCardIds.add(slot.cardId);

    if (state.market.listedSet.has(slot.cardId)) listedConflicts.push(slot.slotKey);
    if (!slot.isNaturalFit) offPositionAssignments.push(slot.slotKey);
  });

  if (rolelessSlots.length) warnings.push(`Missing tactical role mapping for: ${rolelessSlots.join(", ")}`);
  if (offPositionAssignments.length) warnings.push(`Off-position assignments: ${offPositionAssignments.join(", ")}`);

  const isComplete = missingSlots.length === 0;
  const isReady = isComplete && duplicateCards.length === 0 && listedConflicts.length === 0 && rolelessSlots.length === 0;

  return {
    isComplete,
    isReady,
    missingSlots,
    duplicateCards,
    listedConflicts,
    offPositionAssignments,
    warnings
  };
}

function getCardNation(card) {
  const raw = card?.nation || card?.country || card?.nationality || card?.nation_code || null;
  return raw ? String(raw).trim().toUpperCase() : null;
}

function getTopGroup(values = []) {
  const counts = new Map();
  let topValue = null;
  let topCount = 0;

  values.filter(Boolean).forEach((value) => {
    const key = String(value).trim().toUpperCase();
    const next = (counts.get(key) || 0) + 1;
    counts.set(key, next);
    if (next > topCount) {
      topCount = next;
      topValue = key;
    }
  });

  return { value: topValue, count: topCount };
}

function getBandStatus(kind, pct, available = true) {
  if (!available) return "INACTIVE";
  if (kind === "role") {
    if (pct >= 100) return "ACTIVE";
    if (pct >= 70) return "PARTIAL";
    return "INACTIVE";
  }
  if (kind === "rarity") {
    if (pct >= 55) return "ACTIVE";
    if (pct >= 35) return "PARTIAL";
    return "INACTIVE";
  }
  if (kind === "nation") {
    if (pct >= 55) return "ACTIVE";
    if (pct >= 35) return "PARTIAL";
    return "INACTIVE";
  }
  return "INACTIVE";
}

function buildSynergyModel(team = buildTeamModel()) {
  const equippedSlots = team.slots.filter((slot) => slot.card);
  const equippedCount = equippedSlots.length;

  if (!equippedCount) {
    return {
      overall: 0,
      role: { status: "INACTIVE", count: 0, pct: 0 },
      rarity: { status: "INACTIVE", count: 0, pct: 0, value: null },
      nation: { status: "INACTIVE", count: 0, pct: 0, value: null, available: false },
      streetKings: { active: false }
    };
  }

  const roleFitCount = equippedSlots.filter((slot) => slot.isNaturalFit).length;
  const rolePct = Math.round((roleFitCount / equippedCount) * 100);

  const rarityTop = getTopGroup(equippedSlots.map((slot) => slot.card?.rarity));
  const rarityPct = Math.round((rarityTop.count / equippedCount) * 100);

  const nations = equippedSlots.map((slot) => getCardNation(slot.card)).filter(Boolean);
  const hasNationData = nations.length > 0;
  const nationTop = getTopGroup(nations);
  const nationPct = hasNationData ? Math.round((nationTop.count / equippedCount) * 100) : 0;

  const streetKingsActive =
    equippedCount === 11 &&
    equippedSlots.every((slot) => normalizeRarity(slot.card?.rarity) === "COMMON");

  let overall = Math.round((rolePct * 0.55) + (rarityPct * 0.25) + (hasNationData ? nationPct * 0.20 : 0));
  if (streetKingsActive) overall = Math.max(overall, 85);

  return {
    overall: clamp(overall, 0, 100),
    role: { status: getBandStatus("role", rolePct, true), count: roleFitCount, pct: rolePct },
    rarity: { status: getBandStatus("rarity", rarityPct, true), count: rarityTop.count, pct: rarityPct, value: rarityTop.value },
    nation: { status: getBandStatus("nation", nationPct, hasNationData), count: nationTop.count, pct: nationPct, value: nationTop.value, available: hasNationData },
    streetKings: { active: streetKingsActive }
  };
}

function rarityClass(r) {
  const rr = normalizeRarity(r);
  if (rr === "ICON") return "rLegend";
  if (rr === "LEGENDARY") return "rLegend";
  if (rr === "EPIC") return "rEpic";
  if (rr === "RARE") return "rRare";
  if (rr === "UNCOMMON") return "rRare";
  return "rCommon";
}

function rarityFrame(r) {
  const rr = normalizeRarity(r);
  if (rr === "ICON") return "kfCard--icon";
  if (rr === "LEGENDARY") return "kfCard--legendary";
  if (rr === "EPIC") return "kfCard--epic";
  if (rr === "RARE") return "kfCard--rare";
  if (rr === "UNCOMMON") return "kfCard--uncommon";
  return "kfCard--common";
}

function rarityShort(r) {
  const rr = normalizeRarity(r);
  if (rr === "ICON") return "ICON";
  if (rr === "LEGENDARY") return "LEG";
  if (rr === "EPIC") return "EPIC";
  if (rr === "RARE") return "RARE";
  if (rr === "UNCOMMON") return "UNC";
  return "COM";
}

function minPriceFor(r) {
  const rules = state.market.rules || DEFAULT_RULES;
  return rules.minPrice?.[normalizeRarity(r)] ?? 10;
}

function safeText(node, value) {
  if (node) node.textContent = value;
}

function setStatus(message) {
  safeText(el("mk-status"), message || "");
}

function setConn(ok) {
  safeText(el("pill-conn"), ok ? "API: Connected" : "API: Offline");
}

function setUserLabel() {
  safeText(el("pill-user"), state.userId ? `User: ${state.userId.slice(0, 8)}` : "Guest");
}

function setCoins(coins) {
  state.walletCoins = coins ?? null;
  safeText(el("pill-coins"), `Coins: ${coins ?? "—"}`);
  safeText(el("home-coins"), coins ?? "—");
}

function pulseSelectedPanel() {
  const panel = el("selectedCard");
  if (!panel) return;
  panel.classList.remove("pulseKick");
  void panel.offsetWidth;
  panel.classList.add("pulseKick");
}

function scrollToAppShell() {
  const node = el("app-shell");
  if (!node) return;
  node.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setActiveView(view) {
  state.activeView = view;
  $$("[data-view-tab]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.viewTab === view);
  });
  $$(".appView").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.view === view);
  });
}

function jumpToView(view) {
  setActiveView(view);
  scrollToAppShell();
}

async function api(path, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  if (!headers["Content-Type"] && opts.method !== "GET") headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  const txt = await res.text();
  let json = null;
  try { json = JSON.parse(txt); } catch {}

  if (!res.ok) throw new Error(json?.error || txt || "API error");
  return json;
}

async function healthCheck() {
  try {
    await api("/health", { method: "GET" });
    setConn(true);
    return true;
  } catch {
    setConn(false);
    return false;
  }
}

async function ensureSession() {
  if (state.token && state.userId) return;
  const s = await api("/v1/session", { method: "POST", body: JSON.stringify({}) });
  state.token = s.token;
  state.userId = s.userId;
  localStorage.setItem("cx_token", state.token);
  localStorage.setItem("cx_user", state.userId);
  setUserLabel();
}

function clearDropNodeStyle(node) {
  if (!node) return;
  node.style.borderColor = "";
  node.style.boxShadow = "";
  node.style.background = "";
}

function paintDropNode(node, kind) {
  if (!node) return;
  if (kind === "ok") {
    node.style.borderColor = "rgba(0,230,118,.9)";
    node.style.boxShadow = "0 0 20px rgba(0,230,118,.25)";
    node.style.background = "linear-gradient(180deg, rgba(0,230,118,.12), rgba(6,12,9,.82))";
    return;
  }
  if (kind === "bad") {
    node.style.borderColor = "rgba(255,61,90,.85)";
    node.style.boxShadow = "0 0 14px rgba(255,61,90,.25)";
    node.style.background = "linear-gradient(180deg, rgba(255,61,90,.10), rgba(6,12,9,.82))";
    return;
  }
  clearDropNodeStyle(node);
}

function clearAllDropStates() {
  $$(".slot, .benchSlot").forEach((node) => clearDropNodeStyle(node));
}

function setDragPayload(payload) {
  state.dragPayload = payload;
}

function clearDragPayload() {
  state.dragPayload = null;
  clearAllDropStates();
}

function resolveDragPayload(payload) {
  if (!payload?.cardId) return null;
  const squadSlot = getSquadSlotOfCard(payload.cardId);
  if (squadSlot) return { source: "pitch", slotKey: squadSlot, cardId: payload.cardId };
  const benchIndex = findBenchIndexByCardId(payload.cardId);
  if (benchIndex !== -1) return { source: "bench", benchIndex, cardId: payload.cardId };
  return { source: "inventory", cardId: payload.cardId };
}

function isCardCompatibleForSlot(card, slotKey) {
  if (!card) return false;
  const roleMap = getFormationRoleMap(state.formation);
  const meta = roleMap[slotKey];
  if (!meta) return false;
  const allowed = (meta.allowed || []).map(normalizePosition);
  return allowed.includes(normalizePosition(card.position));
}

function canDropOnBench(targetIndex, payload) {
  if (state.tacticsLocked) return false;
  const resolved = resolveDragPayload(payload);
  if (!resolved?.cardId) return false;
  const currentOccupant = state.bench[targetIndex] || null;
  if (resolved.source === "bench" && resolved.benchIndex === targetIndex) return true;
  if (currentOccupant) return false;
  return true;
}

function canDropOnPitch(slotKey, payload) {
  if (state.tacticsLocked) return false;
  const resolved = resolveDragPayload(payload);
  if (!resolved?.cardId) return false;

  const incomingCard = getCardById(resolved.cardId);
  if (!incomingCard) return false;
  if (state.market.listedSet.has(incomingCard.id)) return false;
  if (!isCardCompatibleForSlot(incomingCard, slotKey)) return false;

  const targetCardId = state.squad[slotKey] || null;
  if (!targetCardId || targetCardId === incomingCard.id) return true;

  if (resolved.source === "pitch") {
    const displaced = getCardById(targetCardId);
    return !!displaced && isCardCompatibleForSlot(displaced, resolved.slotKey);
  }
  if (resolved.source === "bench") return true;
  return firstEmptyBenchIndex() !== -1;
}

function findFirstCompatibleEmptySlot(cardId) {
  const card = getCardById(cardId);
  if (!card) return null;
  return SLOT_KEYS.find((slotKey) => !state.squad[slotKey] && isCardCompatibleForSlot(card, slotKey)) || null;
}

function getCompatibleBenchCandidatesForSlot(slotKey, excludeCardId = null) {
  ensureBenchState();
  return state.bench
    .map((cardId, idx) => ({ cardId, idx, card: getCardById(cardId) }))
    .filter((x) => x.card && x.card.id !== excludeCardId && isCardCompatibleForSlot(x.card, slotKey))
    .sort((a, b) => cardVisualModel(b.card).ovr - cardVisualModel(a.card).ovr);
}

function getBestBenchComparison(slotKey, excludeCardId = null) {
  const items = getCompatibleBenchCandidatesForSlot(slotKey, excludeCardId);
  return items.length ? items[0] : null;
}

function getQuickSellValue(card) {
  const vm = cardVisualModel(card);
  const rarityBase = { COMMON: 24, UNCOMMON: 42, RARE: 70, EPIC: 160, LEGENDARY: 420, ICON: 1200 }[normalizeRarity(card.rarity)] || 20;
  return Math.round(rarityBase + vm.ovr * 2.2);
}

async function moveCardToBench(cardId, targetBenchIndex, hintedPayload = null) {
  ensureBenchState();
  const resolved = resolveDragPayload(hintedPayload || { cardId });
  if (!resolved) return false;

  const targetOccupant = state.bench[targetBenchIndex] || null;
  if (targetOccupant && !(resolved.source === "bench" && resolved.benchIndex === targetBenchIndex)) {
    setStatus("That bench slot is already occupied.");
    return false;
  }

  try {
    if (resolved.source === "bench") {
      if (resolved.benchIndex === targetBenchIndex) return true;
      state.bench[targetBenchIndex] = cardId;
      state.bench[resolved.benchIndex] = null;
    } else if (resolved.source === "pitch") {
      await api("/v1/squad/unequip", { method: "POST", body: JSON.stringify({ slot: resolved.slotKey }) });
      delete state.squad[resolved.slotKey];
      removeCardFromBench(cardId);
      state.bench[targetBenchIndex] = cardId;
    } else {
      const slotKey = getSquadSlotOfCard(cardId);
      if (slotKey) {
        await api("/v1/squad/unequip", { method: "POST", body: JSON.stringify({ slot: slotKey }) });
        delete state.squad[slotKey];
      }
      removeCardFromBench(cardId);
      state.bench[targetBenchIndex] = cardId;
    }

    removeCardFromBench(cardId, targetBenchIndex);
    reconcileBenchWithState();
    state.selectedCardId = null;
    renderBench();
    renderSquad();
    renderInventory();
    renderPackResults(state.revealCards);
    renderSelectedCard();
    renderMarketSelected();
    renderTacticsShell();
    setStatus("Bench updated.");
    return true;
  } catch (e) {
    setStatus(e.message);
    return false;
  }
}

async function moveCardToPitch(cardId, targetSlotKey, hintedPayload = null) {
  const resolved = resolveDragPayload(hintedPayload || { cardId });
  if (!resolved) return false;

  const incomingCard = getCardById(cardId);
  if (!incomingCard) {
    setStatus("Card not found.");
    return false;
  }
  if (state.market.listedSet.has(cardId)) {
    setStatus("This card is listed on the market. Cancel listing first.");
    return false;
  }
  if (!isCardCompatibleForSlot(incomingCard, targetSlotKey)) {
    setStatus("That player is not compatible with this position.");
    return false;
  }

  const targetCardId = state.squad[targetSlotKey] || null;

  try {
    if (resolved.source === "pitch" && resolved.slotKey === targetSlotKey) return true;

    if (resolved.source === "pitch") {
      if (targetCardId && targetCardId !== cardId) {
        const displaced = getCardById(targetCardId);
        if (!displaced || !isCardCompatibleForSlot(displaced, resolved.slotKey)) {
          setStatus("Swap blocked: displaced player is not compatible with the source slot.");
          return false;
        }

        await api("/v1/squad/unequip", { method: "POST", body: JSON.stringify({ slot: targetSlotKey }) });
        delete state.squad[targetSlotKey];
        await api("/v1/squad/equip", { method: "POST", body: JSON.stringify({ slot: targetSlotKey, cardId }) });
        state.squad[targetSlotKey] = cardId;
        await api("/v1/squad/equip", { method: "POST", body: JSON.stringify({ slot: resolved.slotKey, cardId: targetCardId }) });
        state.squad[resolved.slotKey] = targetCardId;
      } else {
        await api("/v1/squad/equip", { method: "POST", body: JSON.stringify({ slot: targetSlotKey, cardId }) });
        delete state.squad[resolved.slotKey];
        state.squad[targetSlotKey] = cardId;
      }
    } else if (resolved.source === "bench") {
      if (targetCardId && targetCardId !== cardId) {
        await api("/v1/squad/unequip", { method: "POST", body: JSON.stringify({ slot: targetSlotKey }) });
        delete state.squad[targetSlotKey];
        await api("/v1/squad/equip", { method: "POST", body: JSON.stringify({ slot: targetSlotKey, cardId }) });
        state.squad[targetSlotKey] = cardId;
        state.bench[resolved.benchIndex] = targetCardId;
      } else {
        await api("/v1/squad/equip", { method: "POST", body: JSON.stringify({ slot: targetSlotKey, cardId }) });
        state.squad[targetSlotKey] = cardId;
        state.bench[resolved.benchIndex] = null;
      }
    } else {
      if (targetCardId && targetCardId !== cardId) {
        const emptyBench = firstEmptyBenchIndex();
        if (emptyBench === -1) {
          setStatus("Bench is full. Free a bench slot before replacing a starter.");
          return false;
        }

        await api("/v1/squad/unequip", { method: "POST", body: JSON.stringify({ slot: targetSlotKey }) });
        delete state.squad[targetSlotKey];
        await api("/v1/squad/equip", { method: "POST", body: JSON.stringify({ slot: targetSlotKey, cardId }) });
        state.squad[targetSlotKey] = cardId;
        removeCardFromBench(targetCardId);
        state.bench[emptyBench] = targetCardId;
      } else {
        await api("/v1/squad/equip", { method: "POST", body: JSON.stringify({ slot: targetSlotKey, cardId }) });
        state.squad[targetSlotKey] = cardId;
      }
    }

    removeCardFromBench(cardId);
    reconcileBenchWithState();
    state.selectedCardId = null;
    renderBench();
    renderSquad();
    renderInventory();
    renderPackResults(state.revealCards);
    renderSelectedCard();
    renderMarketSelected();
    renderTacticsShell();
    setStatus("Squad updated.");
    return true;
  } catch (e) {
    setStatus(e.message);
    return false;
  }
}

function cardHTML(card, opts = {}) {
  const c = normalizeCard(card);
  const vm = cardVisualModel(c);
  const selected = !!opts.selected;
  const listed = !!opts.listed;
  const compact = !!opts.compact;
  const selectable = opts.selectable !== false;
  const draggable = !!opts.draggable;

  return `
    <div
      class="kfCard ${rarityFrame(c.rarity)} ${selected ? "is-selected" : ""} ${listed ? "is-listed" : ""} ${compact ? "is-compact" : ""}"
      ${selectable ? `data-card-id="${c.id}"` : ""}
      ${draggable ? `draggable="true"` : ""}
    >
      <div class="kfCard__shine"></div>
      <div class="kfCard__top">
        <div class="kfCard__ovr">${vm.ovr}</div>
        <div class="kfCard__metaRight">
          <div class="kfCard__pos">${c.position}</div>
          <div class="kfCard__rarity">${rarityShort(c.rarity)}</div>
        </div>
      </div>

      <div class="kfCard__body">
        <div class="kfCard__name">${c.display_name}</div>
        <div class="kfCard__role">${c.role}</div>
      </div>

      <div class="kfCard__stats">
        <div class="kfStat"><span>PAC</span><strong>${vm.pace}</strong></div>
        <div class="kfStat"><span>PAS</span><strong>${vm.pass}</strong></div>
        <div class="kfStat"><span>ATT</span><strong>${vm.attack}</strong></div>
        <div class="kfStat"><span>DEF</span><strong>${vm.defense}</strong></div>
      </div>

      <div class="kfCard__footer">
        <div class="kfCard__badge ${rarityFrame(c.rarity)}">${c.rarity}</div>
        ${listed ? `<div class="kfCard__listed">LISTED</div>` : ``}
      </div>
    </div>
  `;
}

function bindSourceCardInteractions(rootSelector, opts = {}) {
  const jumpOnSelect = !!opts.jumpOnSelect;

  $$(`${rootSelector} [data-card-id]`).forEach((node) => {
    const id = node.getAttribute("data-card-id");

    node.onclick = () => {
      if (state.tacticsLocked) return;
      if (state.market.listedSet.has(id)) {
        setStatus("This card is listed on the market. Cancel listing first.");
        return;
      }

      state.selectedCardId = state.selectedCardId === id ? null : id;
      state.compareBench = false;
      renderSelectedCard();
      renderInventory();
      renderPackResults(state.revealCards);
      renderMarketSelected();
      refreshSlotStates();

      if (state.selectedCardId) {
        if (jumpOnSelect) {
          setActiveView("squad");
          scrollToAppShell();
        }
        pulseSelectedPanel();
      }
    };

    node.ondragstart = (e) => {
      if (state.tacticsLocked) {
        e.preventDefault();
        return;
      }
      if (state.market.listedSet.has(id)) {
        e.preventDefault();
        setStatus("This card is listed on the market. Cancel listing first.");
        return;
      }
      setDragPayload({ source: "inventory", cardId: id });
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", id);
    };

    node.ondragend = () => {
      clearDragPayload();
    };
  });
}

function benchCardHTML(card, idx) {
  const vm = cardVisualModel(card);
  const listed = state.market.listedSet.has(card.id);

  return `
    <div style="display:grid;gap:4px;justify-items:center;width:100%">
      <div style="font-family:var(--font-ui);font-size:10px;font-weight:900;letter-spacing:.05em;color:var(--gold-light);text-transform:uppercase">
        ${shortName(card.display_name)}
      </div>
      <div style="font-family:var(--font-ui);font-size:10px;color:var(--text-secondary)">
        ${card.position} • OVR ${vm.ovr}
      </div>
      <div style="font-family:var(--font-ui);font-size:9px;color:${listed ? "var(--alert-red)" : "var(--text-secondary)"};text-transform:uppercase">
        ${listed ? "Listed" : `B${idx + 1}`}
      </div>
    </div>
  `;
}

function renderBench() {
  ensureBenchState();
  const slots = [...$$(".benchRow .benchSlot")];
  if (!slots.length) return;

  slots.forEach((node, idx) => {
    const cardId = state.bench[idx] || null;
    const card = getCardById(cardId);

    node.dataset.benchIndex = String(idx);
    node.onclick = () => onBenchClick(idx);

    if (!card) {
      node.innerHTML = `B${idx + 1}`;
      node.draggable = false;
      node.style.cursor = "pointer";
    } else {
      node.innerHTML = benchCardHTML(card, idx);
      node.draggable = !state.tacticsLocked;
      node.style.cursor = state.tacticsLocked ? "default" : "grab";
    }

    node.ondragstart = card ? (e) => {
      if (state.tacticsLocked) {
        e.preventDefault();
        return;
      }
      setDragPayload({ source: "bench", benchIndex: idx, cardId: card.id });
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", card.id);
    } : null;

    node.ondragend = () => {
      clearDragPayload();
    };

    node.ondragover = (e) => {
      if (!state.dragPayload) return;
      e.preventDefault();
      const ok = canDropOnBench(idx, state.dragPayload);
      paintDropNode(node, ok ? "ok" : "bad");
      e.dataTransfer.dropEffect = ok ? "move" : "none";
    };

    node.ondragleave = () => clearDropNodeStyle(node);

    node.ondrop = async (e) => {
      e.preventDefault();
      clearAllDropStates();
      const payload = state.dragPayload;
      clearDragPayload();
      if (!payload) return;
      if (!canDropOnBench(idx, payload)) return;
      await moveCardToBench(payload.cardId, idx, payload);
    };
  });
}

function slotLabel(k) {
  return String(k).replace("1", "").replace("2", "");
}

function shortName(name) {
  if (!name) return "Unknown";
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1]}`;
}

function formatFormationLabel(code) {
  return String(code || "433").split("").join("-");
}

function seedXI() {
  const grid = el("xi");
  if (!grid) return;
  grid.innerHTML = "";

  SLOT_KEYS.forEach((slotKey) => {
    const d = document.createElement("div");
    d.className = "slot";
    d.dataset.slot = slotKey;
    d.innerHTML = `<div class="p">${slotLabel(slotKey)}</div><div class="n muted">Empty</div>`;
    d.onclick = () => onSlotClick(slotKey);
    grid.appendChild(d);
  });

  applyFormationLayout();
  refreshSlotStates();
}

function applyFormationLayout() {
  const grid = el("xi");
  if (!grid) return;
  const layout = FORMATION_LAYOUTS[state.formation] || FORMATION_LAYOUTS["433"];

  [...grid.querySelectorAll(".slot")].forEach((node) => {
    const slot = node.dataset.slot;
    const pos = layout[slot] || FORMATION_LAYOUTS["433"][slot] || { x: 50, y: 50 };
    node.style.left = `${pos.x}%`;
    node.style.top = `${pos.y}%`;
    node.style.right = "auto";
    node.style.transform = "translateX(-50%)";
    const cardId = state.squad[slot];
    node.classList.toggle("slot-selected", !!cardId && cardId === state.selectedCardId);
  });
}

function refreshSlotStates() {
  const grid = el("xi");
  if (!grid) return;
  const armed = canEquipSelected() && !state.tacticsLocked;

  [...grid.querySelectorAll(".slot")].forEach((node) => {
    const k = node.dataset.slot;
    const cardId = state.squad[k];
    node.classList.toggle("armed", armed);
    node.classList.toggle("equipped", !!cardId);
    node.draggable = !!cardId && !state.tacticsLocked;
    node.style.cursor = !!cardId && !state.tacticsLocked ? "grab" : "pointer";
  });
}

function attachPitchDragListeners() {
  const grid = el("xi");
  if (!grid) return;

  [...grid.querySelectorAll(".slot")].forEach((node) => {
    const slotKey = node.dataset.slot;
    const cardId = state.squad[slotKey] || null;

    node.ondragstart = cardId ? (e) => {
      if (state.tacticsLocked) {
        e.preventDefault();
        return;
      }
      setDragPayload({ source: "pitch", slotKey, cardId });
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", cardId);
    } : null;

    node.ondragend = () => clearDragPayload();

    node.ondragover = (e) => {
      if (!state.dragPayload) return;
      e.preventDefault();
      const ok = canDropOnPitch(slotKey, state.dragPayload);
      paintDropNode(node, ok ? "ok" : "bad");
      e.dataTransfer.dropEffect = ok ? "move" : "none";
    };

    node.ondragleave = () => clearDropNodeStyle(node);

    node.ondrop = async (e) => {
      e.preventDefault();
      clearAllDropStates();
      const payload = state.dragPayload;
      clearDragPayload();
      if (!payload) return;
      if (!canDropOnPitch(slotKey, payload)) return;
      await moveCardToPitch(payload.cardId, slotKey, payload);
    };
  });
}

function renderSquad() {
  const grid = el("xi");
  if (!grid) return;

  applyFormationLayout();

  [...grid.querySelectorAll(".slot")].forEach((node) => {
    const k = node.dataset.slot;
    const cardId = state.squad[k];
    const meta = getSlotMeta(k);
    const roleLine = getShortRoleDisplay(k);

    if (!cardId) {
      node.innerHTML = `
        <div class="p">${slotLabel(k)}</div>
        <div class="n muted">${getFriendlyTacticalRole(meta?.role)}</div>
      `;
      return;
    }

    const c = getCardById(cardId);
    if (!c) {
      node.innerHTML = `<div class="p">${slotLabel(k)}</div><div class="n muted">Equipped</div>`;
      return;
    }

    const vm = cardVisualModel(c);
    node.innerHTML = `
      <div class="p">${slotLabel(k)}</div>
      <div class="n">${shortName(c.display_name)}</div>
      <div class="muted tiny">${c.position} • OVR ${vm.ovr}</div>
      <div class="muted tiny">${roleLine}</div>
    `;
  });

  state.teamValidation = validateTeamModel(buildTeamModel());
  refreshSlotStates();
  attachPitchDragListeners();
  updateSynergy();
}

async function onSlotClick(slotKey) {
  if (state.tacticsLocked) {
    setStatus("Tactics are locked for the next fixture.");
    return;
  }

  const occupiedCardId = state.squad[slotKey] || null;

  if (state.selectedCardId) {
    await moveCardToPitch(state.selectedCardId, slotKey, { source: "inventory", cardId: state.selectedCardId });
    return;
  }

  if (occupiedCardId) {
    state.selectedCardId = occupiedCardId;
    state.compareBench = false;
    renderSelectedCard();
    renderInventory();
    renderPackResults(state.revealCards);
    renderMarketSelected();
    pulseSelectedPanel();
  }
}

async function onBenchClick(index) {
  if (state.tacticsLocked && state.selectedCardId) {
    setStatus("Tactics are locked for the next fixture.");
    return;
  }

  const occupiedCardId = state.bench[index] || null;

  if (state.selectedCardId && !occupiedCardId) {
    await moveCardToBench(state.selectedCardId, index, { source: "inventory", cardId: state.selectedCardId });
    return;
  }

  if (occupiedCardId) {
    state.selectedCardId = occupiedCardId;
    state.compareBench = false;
    renderSelectedCard();
    renderInventory();
    renderPackResults(state.revealCards);
    renderMarketSelected();
    pulseSelectedPanel();
  }
}

function renderInventory() {
  const list = el("invList");
  if (!list) return;

  const items = state.inventory.filter((c) => (state.filter === "ALL" ? true : normalizeRarity(c.rarity) === state.filter));

  if (!items.length) {
    list.innerHTML = `<div class="muted tiny">No cards yet. Open your first KickForge pack.</div>`;
    return;
  }

  list.innerHTML = `
    <div class="kfCollectionGrid">
      ${items.map((c) => cardHTML(c, {
        selected: state.selectedCardId === c.id,
        listed: state.market.listedSet.has(c.id),
        compact: false,
        selectable: true,
        draggable: !state.tacticsLocked
      })).join("")}
    </div>
  `;

  bindSourceCardInteractions("#invList", { jumpOnSelect: true });
}

function buildStatsRowsHTML(stats, prefix) {
  return stats.map((s) => `
    <div style="display:grid;grid-template-columns:44px 1fr 38px;gap:8px;align-items:center;margin-top:8px">
      <div style="font-family:var(--font-ui);font-size:12px;font-weight:800;letter-spacing:.05em;color:var(--text-secondary);text-transform:uppercase">${s.key}</div>
      <div style="height:8px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);overflow:hidden;clip-path:polygon(8px 0,100% 0,100% 100%,0 100%,0 8px)">
        <div data-stat-fill="${prefix}-${s.key}" data-fill-to="${s.value}" style="height:100%;width:0%;background:linear-gradient(90deg,var(--emerald),var(--gold));transition:width .6s ease-out"></div>
      </div>
      <div style="font-family:var(--font-display);font-size:18px;line-height:1;color:#fff;text-align:right">${s.value}</div>
    </div>
  `).join("");
}

function animateStatBars() {
  const fills = $$("[data-stat-fill]");
  fills.forEach((fill, idx) => {
    fill.style.width = "0%";
    const to = Number(fill.getAttribute("data-fill-to") || 0);
    setTimeout(() => {
      fill.style.width = `${Math.max(0, Math.min(100, to))}%`;
    }, 20 + idx * 45);
  });
}

function renderSelectedCard() {
  const box = el("selectedCard");
  if (!box) return;

  const c = state.selectedCardId ? getCardById(state.selectedCardId) : null;

  if (!c) {
    box.innerHTML = `
      <div class="muted tiny">Selected Player</div>
      <div style="font-weight:900;margin-top:6px">None</div>
      <div class="muted tiny" style="margin-top:6px">
        ${state.tacticsLocked
          ? "Tactics are locked. Wait for the next open window to edit your squad."
          : "Use Collection or Latest Pack. Click a card, then click a pitch slot or empty bench slot. You can also drag bench ↔ pitch."}
      </div>
    `;
    return;
  }

  const vm = cardVisualModel(c);
  const detailStats = getDetailedStats(c);
  const traits = generateCardTraits(c);
  const isListed = state.market.listedSet.has(c.id);
  const squadSlot = getSquadSlotOfCard(c.id);
  const benchIndex = findBenchIndexByCardId(c.id);
  const firstFit = findFirstCompatibleEmptySlot(c.id);
  const nation = getCardNation(c) || "—";
  const serial = getSerialText(c);
  const roleMeta = squadSlot ? getSlotMeta(squadSlot) : null;
  const roleOptions = roleMeta ? (ROLE_OPTIONS[roleMeta.role] || []) : [];
  const roleOverride = squadSlot ? getSlotRoleOverride(squadSlot) : "";
  const bestBench = squadSlot ? getBestBenchComparison(squadSlot, c.id) : null;
  const showCompare = !!(state.compareBench && bestBench && squadSlot);
  const compareStats = showCompare ? getDetailedStats(bestBench.card) : [];
  const benchLabel = bestBench ? `Best Bench: ${bestBench.card.display_name} (B${bestBench.idx + 1})` : "No compatible bench comparison";

  box.innerHTML = `
    <div style="display:grid;gap:14px">
      <div class="muted tiny">Selected Player</div>

      <div style="display:grid;grid-template-columns:210px 1fr;gap:14px;align-items:start">
        <div style="display:flex;justify-content:center">
          ${cardHTML(c, { selected: true, listed: isListed, compact: true, selectable: false })}
        </div>

        <div style="padding:12px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02);clip-path:polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)">
          <div style="font-family:var(--font-display);font-size:38px;line-height:.88;color:var(--gold-light);letter-spacing:.03em;text-transform:uppercase">${c.display_name}</div>
          <div style="margin-top:8px;color:var(--text-secondary);font-size:14px;letter-spacing:.02em">${c.position} • ${nation} • ${c.rarity} • ${serial}</div>

          <div style="display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:end;margin-top:10px">
            <div style="font-family:var(--font-display);font-size:54px;line-height:.85;color:#fff">OVR ${vm.ovr}</div>
            <div style="font-family:var(--font-ui);font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--text-secondary)">
              ${squadSlot ? `Pitch Slot: ${slotLabel(squadSlot)}` : benchIndex !== -1 ? `Bench Slot: B${benchIndex + 1}` : "Collection / Latest Pack"}
            </div>
          </div>

          <div style="margin-top:12px">${buildStatsRowsHTML(detailStats, "main")}</div>

          <div style="margin-top:14px">
            <div style="font-family:var(--font-ui);font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--text-secondary)">Traits</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
              ${traits.length
                ? traits.map((t) => `
                  <div title="${t.desc}" style="padding:6px 8px;border:1px solid rgba(232,184,75,.28);background:rgba(232,184,75,.10);color:var(--gold-light);font-family:var(--font-ui);font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)">
                    ${t.key}
                  </div>
                `).join("")
                : `<div class="muted tiny">No traits.</div>`}
            </div>
          </div>

          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">
            <button class="smallBtn primary" id="btn-selected-auto" ${state.tacticsLocked || isListed || !firstFit ? "disabled" : ""}>Auto Place</button>
            <button class="smallBtn ghost" id="btn-selected-bench" ${state.tacticsLocked || isListed ? "disabled" : ""}>Send Bench</button>
            <button class="smallBtn ghost" id="btn-selected-market" ${isListed ? "disabled" : ""}>List on Market</button>
          </div>
        </div>
      </div>

      <div style="padding:12px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02);clip-path:polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap">
          <div>
            <div style="font-family:var(--font-ui);font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--text-secondary)">Role Selector</div>
            <div class="muted tiny" style="margin-top:4px">${squadSlot ? "Changes the role label saved for this pitch token." : "Place the player in the XI to enable role override."}</div>
          </div>
          <div>
            <select id="selected-role-select" ${!squadSlot || state.tacticsLocked ? "disabled" : ""} style="min-height:40px;padding:8px 12px;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.03);color:var(--text-primary);clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)">
              <option value="">${roleMeta ? getFriendlyTacticalRole(roleMeta.role) : "No Slot"}</option>
              ${roleOptions.map((r) => `<option value="${r}" ${roleOverride === r ? "selected" : ""}>${r}</option>`).join("")}
            </select>
          </div>
        </div>
      </div>

      <div style="padding:12px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02);clip-path:polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap">
          <div>
            <div style="font-family:var(--font-ui);font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--text-secondary)">Compare With Bench</div>
            <div class="muted tiny" style="margin-top:4px">${benchLabel}</div>
          </div>
          <button class="smallBtn ${showCompare ? "primary" : "ghost"}" id="btn-toggle-compare" ${!bestBench ? "disabled" : ""}>
            ${showCompare ? "Comparison On" : "Comparison Off"}
          </button>
        </div>

        ${showCompare ? `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
            <div style="padding:10px;border:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.14);clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)">
              <div style="font-family:var(--font-ui);font-size:13px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:var(--gold-light)">${shortName(c.display_name)}</div>
              <div class="muted tiny" style="margin-top:4px">${c.position} • OVR ${vm.ovr}</div>
              <div style="margin-top:8px">${buildStatsRowsHTML(detailStats, "cmp-a")}</div>
            </div>

            <div style="padding:10px;border:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.14);clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)">
              <div style="font-family:var(--font-ui);font-size:13px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:var(--gold-light)">${shortName(bestBench.card.display_name)}</div>
              <div class="muted tiny" style="margin-top:4px">B${bestBench.idx + 1} • ${bestBench.card.position} • OVR ${cardVisualModel(bestBench.card).ovr}</div>
              <div style="margin-top:8px">${buildStatsRowsHTML(compareStats, "cmp-b")}</div>
            </div>
          </div>
        ` : ""}
      </div>

      <div class="muted tiny">
        ${state.tacticsLocked
          ? "TACTICS LOCKED — changes are blocked until the next fixture window opens."
          : isListed
            ? "LISTED — cancel the market listing before using this card in your squad."
            : squadSlot
              ? `In Starting XI — ${slotLabel(squadSlot)}. Role saved as: ${getSlotRoleDisplay(squadSlot)}.`
              : benchIndex !== -1
                ? `On Bench — B${benchIndex + 1}.`
                : `Quick sell reference: ${getQuickSellValue(c)} FC.`}
      </div>
    </div>
  `;

  el("btn-selected-bench")?.addEventListener("click", async () => {
    const currentBench = findBenchIndexByCardId(c.id);
    if (currentBench !== -1) {
      setStatus("Player is already on the bench.");
      return;
    }
    const emptyIdx = firstEmptyBenchIndex();
    if (emptyIdx === -1) {
      setStatus("Bench is full.");
      return;
    }
    await moveCardToBench(c.id, emptyIdx, { source: "inventory", cardId: c.id });
  });

  el("btn-selected-auto")?.addEventListener("click", async () => {
    if (!firstFit) {
      setStatus("No compatible empty slot found.");
      return;
    }
    await moveCardToPitch(c.id, firstFit, { source: "inventory", cardId: c.id });
  });

  el("btn-selected-market")?.addEventListener("click", () => {
    jumpToView("market");
    setMarketTab("players");
    renderMarketSelected();
    setStatus("Set a price and list the selected card.");
  });

  el("btn-toggle-compare")?.addEventListener("click", () => {
    state.compareBench = !state.compareBench;
    renderSelectedCard();
  });

  el("selected-role-select")?.addEventListener("change", (e) => {
    if (!squadSlot) return;
    setSlotRoleOverride(squadSlot, e.target.value);
    renderSquad();
    renderSelectedCard();
    setStatus(e.target.value ? `Role override saved: ${e.target.value}` : "Role override cleared.");
  });

  setTimeout(() => animateStatBars(), 25);
}

function updateSynergy() {
  const pct = el("chemPct");
  const fill = el("chemFill");
  const note = el("chemNote");

  const team = buildTeamModel();
  const validation = validateTeamModel(team);
  const synergy = buildSynergyModel(team);

  safeText(pct, `${synergy.overall}%`);
  if (fill) fill.style.width = `${synergy.overall}%`;

  if (!team.equippedCount) {
    safeText(note, "Nation INACTIVE • Role INACTIVE • Rarity INACTIVE • Street Kings OFF");
    return;
  }

  const nationText = synergy.nation.available
    ? `Nation ${synergy.nation.status} ${synergy.nation.count}/${team.equippedCount}`
    : "Nation INACTIVE";

  const streetKingsText = synergy.streetKings.active ? "Street Kings ACTIVE" : "Street Kings OFF";
  const missingText = validation.missingSlots.length ? ` • Missing: ${validation.missingSlots.length}` : "";
  const offRoleText = validation.offPositionAssignments.length ? ` • Off-role: ${validation.offPositionAssignments.length}` : "";

  safeText(
    note,
    `Role ${synergy.role.status} ${synergy.role.count}/${team.equippedCount} • ` +
    `Rarity ${synergy.rarity.status} ${synergy.rarity.count}/${team.equippedCount} • ` +
    `${nationText} • ${streetKingsText}${missingText}${offRoleText}`
  );
}

function renderPackResults(cards) {
  const wrap = el("cards");
  if (!wrap) return;
  const normalized = (cards || []).map(normalizeCard).filter(Boolean);

  wrap.innerHTML = normalized.length
    ? `<div class="kfPackGrid">${normalized.map((c) => cardHTML(c, {
        compact: true,
        selectable: true,
        draggable: !state.tacticsLocked,
        selected: state.selectedCardId === c.id,
        listed: state.market.listedSet.has(c.id)
      })).join("")}</div>`
    : "";

  bindSourceCardInteractions("#cards", { jumpOnSelect: false });
}

function syncSquadPdfCopy() {
  const synergyRowText = document.querySelector(".synergyPanel .row .muted.tiny");
  if (synergyRowText) synergyRowText.textContent = "Nation / Role / Rarity synergies.";

  const chipRow = document.querySelector(".squadChipRow");
  if (chipRow) chipRow.style.display = "none";

  const benchTiny = document.querySelector(".benchShell .row .muted.tiny");
  if (benchTiny) benchTiny.textContent = "Drag between bench and pitch. Collection and Latest Pack cards can be selected first, then placed.";

  const pitchFooter = document.querySelector(".pitchFooter .muted.tiny");
  if (pitchFooter) pitchFooter.textContent = "Drag compatible players between bench and pitch. Clicking a pitch token opens the detailed player panel.";
}

/* =========================
   LEAGUE ENGINE
========================= */

function getRegistrationCountdownDate(now = new Date()) {
  const d = new Date(now);
  d.setUTCHours(20, 0, 0, 0);
  if (now >= d) d.setUTCDate(d.getUTCDate() + 1);
  d.setUTCDate(d.getUTCDate() + 3);
  return d;
}

function getDefaultJoinedSeasonStart(now = new Date()) {
  const d = new Date(now);
  d.setUTCHours(20, 0, 0, 0);
  if (now < d) d.setUTCDate(d.getUTCDate() - 4);
  else d.setUTCDate(d.getUTCDate() - 5);
  return d;
}

function getUserTeamStrength() {
  const team = buildTeamModel();
  const validation = validateTeamModel(team);
  const synergy = buildSynergyModel(team);

  let strength = team.avgOvr || 62;
  strength += Math.round((synergy.overall - 50) / 12);
  strength -= validation.missingSlots.length * 2.5;
  strength -= validation.offPositionAssignments.length * 1.1;
  if (team.equippedCount === 11) strength += 2;
  if (state.isPro) strength += 1;

  return clamp(Math.round(strength), 55, 93);
}

function getLeagueTeams() {
  return LEAGUE_TEAM_POOL.map((team) => {
    if (team.id === "you") {
      return { ...team, base: getUserTeamStrength(), bot: false };
    }
    let bonus = 0;
    if (state.isPro) bonus += 1;
    return { ...team, base: clamp(team.base + bonus, 60, 92) };
  });
}

function getLeagueTeamsById(teams) {
  return Object.fromEntries(teams.map((t) => [t.id, t]));
}

function generateRoundRobinPairs(teamIds) {
  const ids = teamIds.slice();
  if (ids.length % 2 === 1) ids.push("BYE");

  const rounds = [];
  const fixed = ids[0];
  let rotating = ids.slice(1);

  for (let round = 0; round < ids.length - 1; round++) {
    const left = [fixed, ...rotating.slice(0, (ids.length / 2) - 1)];
    const right = rotating.slice((ids.length / 2) - 1).reverse();
    const pairs = [];

    for (let i = 0; i < left.length; i++) {
      let home = left[i];
      let away = right[i];

      if (round % 2 === 1) [home, away] = [away, home];
      if (i % 2 === 1) [home, away] = [away, home];

      if (home !== "BYE" && away !== "BYE") pairs.push({ homeId: home, awayId: away });
    }

    rounds.push(pairs);
    rotating = [rotating[rotating.length - 1], ...rotating.slice(0, rotating.length - 1)];
  }

  return rounds;
}

function buildLeagueSchedule(teams, seasonStartIso) {
  const firstLeg = generateRoundRobinPairs(teams.map((t) => t.id));
  const secondLeg = firstLeg.map((round) => round.map((f) => ({ homeId: f.awayId, awayId: f.homeId })));
  const allRounds = firstLeg.concat(secondLeg);
  const start = new Date(seasonStartIso);

  return allRounds.map((round, idx) => {
    const kickoff = new Date(start);
    kickoff.setUTCDate(start.getUTCDate() + idx);

    return {
      md: idx + 1,
      kickoffIso: kickoff.toISOString(),
      fixtures: round.map((f, fi) => ({
        id: `md${idx + 1}-${fi + 1}-${f.homeId}-${f.awayId}`,
        md: idx + 1,
        kickoffIso: kickoff.toISOString(),
        homeId: f.homeId,
        awayId: f.awayId
      }))
    };
  });
}

function sampleGoals(expected, rnd) {
  let goals = 0;
  const c1 = clamp(expected / 2.2, 0.05, 0.82);
  const c2 = clamp(expected / 3.0, 0.04, 0.70);
  const c3 = clamp(expected / 4.0, 0.03, 0.55);
  const c4 = clamp(expected / 5.2, 0.02, 0.42);
  const c5 = clamp(expected / 6.4, 0.01, 0.28);

  if (rnd() < c1) goals++;
  if (rnd() < c2) goals++;
  if (rnd() < c3) goals++;
  if (rnd() < c4) goals++;
  if (rnd() < c5) goals++;

  return clamp(goals, 0, 5);
}

function simulateFixtureResult(fixture, teamsById) {
  const seed = hashString(`league|${state.league.seasonNumber}|${fixture.md}|${fixture.homeId}|${fixture.awayId}`);
  const rnd = mulberry32(seed);

  const homeTeam = teamsById[fixture.homeId];
  const awayTeam = teamsById[fixture.awayId];
  const homeStrength = homeTeam.base + 3;
  const awayStrength = awayTeam.base;

  const expectedHome = clamp(1.12 + ((homeStrength - awayStrength) / 18) + (rnd() - 0.5) * 0.45, 0.25, 3.45);
  const expectedAway = clamp(0.98 + ((awayStrength - homeStrength) / 18) + (rnd() - 0.5) * 0.45, 0.20, 3.20);

  const homeGoals = sampleGoals(expectedHome, rnd);
  const awayGoals = sampleGoals(expectedAway, rnd);

  return { homeGoals, awayGoals };
}

function buildStandings(teams, playedFixtures) {
  const map = new Map();

  teams.forEach((team) => {
    map.set(team.id, {
      teamId: team.id,
      name: team.name,
      bot: team.bot,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      pts: 0,
      base: team.base
    });
  });

  playedFixtures.forEach((f) => {
    const home = map.get(f.homeId);
    const away = map.get(f.awayId);
    if (!home || !away) return;

    home.played += 1;
    away.played += 1;
    home.gf += f.homeGoals;
    home.ga += f.awayGoals;
    away.gf += f.awayGoals;
    away.ga += f.homeGoals;

    if (f.homeGoals > f.awayGoals) {
      home.won += 1;
      home.pts += 3;
      away.lost += 1;
    } else if (f.homeGoals < f.awayGoals) {
      away.won += 1;
      away.pts += 3;
      home.lost += 1;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.pts += 1;
      away.pts += 1;
    }
  });

  const table = [...map.values()].map((row) => ({ ...row, gd: row.gf - row.ga }));

  table.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.name.localeCompare(b.name);
  });

  return table.map((row, idx) => ({ ...row, pos: idx + 1 }));
}

function formatDateShortUTC(date) {
  const d = new Date(date);
  const month = d.toLocaleString("en-GB", { month: "short", timeZone: "UTC" }).toUpperCase();
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${day} ${month}`;
}

function formatTimeUtc(date) {
  const d = new Date(date);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} UTC`;
}

function setLeagueActiveMd(md, userSelected = true) {
  state.activeMatchday = md;
  state.league.userSelectedMd = userSelected;
  localStorage.setItem("kf_active_md", String(md));
  saveLeagueState();
}

function getLeagueTierDescriptor(runtime) {
  if (!runtime.registered) {
    return {
      badge: state.isPro ? "PRO" : "OPEN",
      name: state.isPro ? "Pro Access Available" : "Open Division",
      copy: state.isPro
        ? "Battle Pass active • register to enter the current league ladder."
        : "Free ladder access • register to enter the current season."
    };
  }

  const yourRow = runtime.standings.find((x) => x.teamId === "you");
  if (state.isPro && yourRow && yourRow.pos <= 2) {
    return {
      badge: "PRO",
      name: "Pro Division",
      copy: "Top 2 currently on Champions Cup qualification path."
    };
  }

  if (state.isPro) {
    return {
      badge: "PRO",
      name: "Pro Division",
      copy: "Battle Pass access active • compete for Elite qualification and Champions Cup path."
    };
  }

  return {
    badge: "OPEN",
    name: "Open Division",
    copy: "Free ladder access • top performance pushes toward Pro and Elite competition."
  };
}

function buildLeagueRuntime(now = new Date()) {
  if (!state.league.joined || !state.league.seasonStartIso) {
    return {
      registered: false,
      registrationDate: getRegistrationCountdownDate(now),
      standings: [],
      rounds: [],
      nextFixture: null,
      currentMd: 1,
      activeMd: 1
    };
  }

  const teams = getLeagueTeams();
  const teamsById = getLeagueTeamsById(teams);
  const rounds = buildLeagueSchedule(teams, state.league.seasonStartIso).map((round) => {
    const kickoff = new Date(round.kickoffIso);
    const played = now >= kickoff;

    return {
      ...round,
      kickoff,
      fixtures: round.fixtures.map((fixture) => {
        const result = played ? simulateFixtureResult(fixture, teamsById) : null;
        return { ...fixture, kickoff, played, ...(result || {}) };
      })
    };
  });

  const playedFixtures = rounds.flatMap((r) => r.fixtures.filter((f) => f.played));
  const standings = buildStandings(teams, playedFixtures);

  const nextFixture = rounds.flatMap((r) => r.fixtures).find((f) => (f.homeId === "you" || f.awayId === "you") && !f.played) || null;
  const currentMd = nextFixture ? nextFixture.md : rounds.length;
  const activeMd = state.activeMatchday > 0 ? clamp(state.activeMatchday, 1, rounds.length) : currentMd;

  return {
    registered: true,
    teams,
    teamsById,
    rounds,
    standings,
    playedFixtures,
    nextFixture,
    currentMd,
    activeMd
  };
}

function getFixturePerspectiveClass(fixture) {
  if (!fixture.played) return "result-live";
  const involvesYou = fixture.homeId === "you" || fixture.awayId === "you";
  if (!involvesYou) {
    if (fixture.homeGoals === fixture.awayGoals) return "result-draw";
    return "result-win";
  }

  const myGoals = fixture.homeId === "you" ? fixture.homeGoals : fixture.awayGoals;
  const oppGoals = fixture.homeId === "you" ? fixture.awayGoals : fixture.homeGoals;

  if (myGoals > oppGoals) return "result-win";
  if (myGoals < oppGoals) return "result-loss";
  return "result-draw";
}

function getFixtureDisplayScore(fixture) {
  if (!fixture.played) return formatTimeUtc(fixture.kickoff);
  return `${fixture.homeGoals} - ${fixture.awayGoals}`;
}

function renderHomeLeagueStanding(runtime) {
  const wrap = el("standingsHome");
  if (!wrap) return;

  if (!runtime.registered) {
    wrap.innerHTML = `
      <div class="standingRow standingHead">
        <div>#</div>
        <div>Club</div>
        <div>Pts</div>
      </div>
      <div class="standingRow is-you">
        <div>—</div>
        <div>Your Club</div>
        <div>—</div>
      </div>
      <div class="standingRow">
        <div>?</div>
        <div>Register for Season 4</div>
        <div>→</div>
      </div>
    `;
    const note = document.querySelector(".standingNote");
    if (note) note.textContent = "Join a league to see live standings.";
    return;
  }

  const yourIndex = runtime.standings.findIndex((x) => x.teamId === "you");
  const start = Math.max(0, Math.min(yourIndex - 1, runtime.standings.length - 4));
  const rows = runtime.standings.slice(start, start + 4);

  wrap.innerHTML = `
    <div class="standingRow standingHead">
      <div>#</div>
      <div>Club</div>
      <div>Pts</div>
    </div>
    ${rows.map((row) => `
      <div class="standingRow ${row.teamId === "you" ? "is-you" : ""}">
        <div>${row.pos}</div>
        <div>${row.name}${row.bot ? " BOT" : ""}</div>
        <div>${row.pts}</div>
      </div>
    `).join("")}
  `;

  const note = document.querySelector(".standingNote");
  if (note) note.textContent = "League table now syncs with the League Hub state.";
}

function renderHomeMatchCard(runtime) {
  const btnPrimary = el("btn-lock-tactics");
  const btnSecondary = el("btn-home-arena");

  if (!runtime.registered) {
    safeText(el("home-match-title"), "Register for a League");
    safeText(el("home-match-sub"), "Season 4 starts in 3 days. Join now to lock your place.");
    safeText(el("cd-days"), "03");
    safeText(el("cd-hours"), "00");
    safeText(el("cd-mins"), "00");

    if (btnPrimary) {
      btnPrimary.textContent = "Register League";
      btnPrimary.disabled = false;
      btnPrimary.onclick = registerForLeague;
    }
    if (btnSecondary) {
      btnSecondary.textContent = "Play Arena";
      btnSecondary.disabled = false;
      btnSecondary.onclick = async () => {
        jumpToView("squad");
        await playArena();
      };
    }
    return;
  }

  if (!runtime.nextFixture) {
    safeText(el("home-match-title"), "Season Complete");
    safeText(el("home-match-sub"), "No more fixtures left in the current schedule.");
    safeText(el("cd-days"), "00");
    safeText(el("cd-hours"), "00");
    safeText(el("cd-mins"), "00");
  } else {
    const oppId = runtime.nextFixture.homeId === "you" ? runtime.nextFixture.awayId : runtime.nextFixture.homeId;
    const opp = runtime.teamsById[oppId];
    const kickoff = runtime.nextFixture.kickoff;
    const lockTime = new Date(kickoff.getTime() - 3600000);

    safeText(el("home-match-title"), opp?.name || "League Opponent");
    safeText(el("home-match-sub"), `Kickoff ${kickoff.toUTCString().replace("GMT", "UTC")} • lock ${formatTimeUtc(lockTime)}`);

    const diff = Math.max(0, kickoff.getTime() - Date.now());
    safeText(el("cd-days"), String(Math.floor(diff / 86400000)).padStart(2, "0"));
    safeText(el("cd-hours"), String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0"));
    safeText(el("cd-mins"), String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"));
  }

  if (btnPrimary) {
    btnPrimary.textContent = state.tacticsLocked ? "Locked" : "Lock Tactics";
    btnPrimary.disabled = state.tacticsLocked;
    btnPrimary.onclick = handleLockTactics;
  }
  if (btnSecondary) {
    btnSecondary.textContent = "Play Arena";
    btnSecondary.disabled = false;
    btnSecondary.onclick = async () => {
      jumpToView("squad");
      await playArena();
    };
  }
}

function renderLeagueMatchdayTabs(runtime) {
  const wrap = el("leagueMatchdays");
  if (!wrap) return;

  if (!runtime.registered) {
    wrap.innerHTML = `<button class="fixtureTab is-active" type="button">MD1</button>`;
    return;
  }

  wrap.innerHTML = runtime.rounds.map((round) => `
    <button class="fixtureTab ${round.md === runtime.activeMd ? "is-active" : ""}" data-md="${round.md}">
      MD${round.md}
    </button>
  `).join("");

  wrap.querySelectorAll("[data-md]").forEach((btn) => {
    btn.onclick = () => {
      setLeagueActiveMd(Number(btn.dataset.md), true);
      renderLeagueShell();
      renderHomeCountdown();
    };
  });
}

function renderLeagueFixtures(runtime) {
  const wrap = el("leagueFixtures");
  if (!wrap) return;

  if (!runtime.registered) {
    const regDate = getRegistrationCountdownDate();
    wrap.innerHTML = `
      <div class="fixtureRow result-live">
        <div class="fixtureDate">${formatDateShortUTC(regDate)}</div>
        <div class="fixtureTeams">Season 4 registration window</div>
        <div class="fixtureScore">20:00</div>
      </div>
    `;
    return;
  }

  const round = runtime.rounds.find((r) => r.md === runtime.activeMd);
  if (!round) {
    wrap.innerHTML = `<div class="muted tiny">No fixtures.</div>`;
    return;
  }

  wrap.innerHTML = round.fixtures.map((fixture) => {
    const home = runtime.teamsById[fixture.homeId];
    const away = runtime.teamsById[fixture.awayId];
    return `
      <div class="fixtureRow ${getFixturePerspectiveClass(fixture)}">
        <div class="fixtureDate">${formatDateShortUTC(fixture.kickoff)}</div>
        <div class="fixtureTeams">${home.name} vs ${away.name}</div>
        <div class="fixtureScore">${getFixtureDisplayScore(fixture)}</div>
      </div>
    `;
  }).join("");
}

function renderLeagueTable(runtime) {
  const wrap = el("leagueTable");
  if (!wrap) return;

  if (!runtime.registered) {
    wrap.innerHTML = `
      <div class="leagueTableHead">
        <div>#</div>
        <div>Club</div>
        <div>P</div>
        <div>GD</div>
        <div>Pts</div>
      </div>
      <div class="leagueTableRow your-row">
        <div class="leaguePos">—</div>
        <div class="leagueClub">Your Club</div>
        <div>0</div>
        <div>0</div>
        <div>0</div>
      </div>
    `;
    return;
  }

  wrap.innerHTML = `
    <div class="leagueTableHead">
      <div>#</div>
      <div>Club</div>
      <div>P</div>
      <div>GD</div>
      <div>Pts</div>
    </div>
    ${runtime.standings.map((row) => `
      <div class="leagueTableRow ${row.teamId === "you" ? "your-row" : ""} ${row.pos <= 2 ? "cup-zone" : ""} ${row.pos > runtime.standings.length - 3 ? "relegation-zone" : ""}">
        <div class="leaguePos ${row.pos <= 2 ? "top" : ""}">${row.pos}</div>
        <div class="leagueClub">${row.name}${row.bot ? ` <span class="botTag">BOT</span>` : ""}</div>
        <div>${row.played}</div>
        <div>${row.gd >= 0 ? `+${row.gd}` : row.gd}</div>
        <div>${row.pts}</div>
      </div>
    `).join("")}
  `;
}

function renderLeagueRegistrationPanel(runtime) {
  const panel = el("leagueRegisterEmpty");
  if (!panel) return;

  if (!runtime.registered) {
    const regDate = runtime.registrationDate;
    panel.innerHTML = `
      <div class="muted tiny">League Registration</div>
      <div class="sectionTitle">Season ${state.league.seasonNumber} Starts In 3 Days</div>
      <div class="muted tiny">Register now to secure your place before the fixture calendar opens.</div>
      <div class="muted tiny">Opening kickoff: ${regDate.toUTCString().replace("GMT", "UTC")}</div>
      <button class="btn primary" id="btn-register-league">Register Now</button>
    `;
    el("btn-register-league")?.addEventListener("click", registerForLeague);
    return;
  }

  const yourRow = runtime.standings.find((x) => x.teamId === "you");
  panel.innerHTML = `
    <div class="muted tiny">League Registration</div>
    <div class="sectionTitle">Registered For Season ${state.league.seasonNumber}</div>
    <div class="muted tiny">Current rank: ${yourRow ? `#${yourRow.pos}` : "—"} • Played: ${yourRow ? yourRow.played : 0} • Points: ${yourRow ? yourRow.pts : 0}</div>
    <button class="btn ghost" id="btn-league-jump-home">Open Dashboard</button>
  `;
  el("btn-league-jump-home")?.addEventListener("click", () => jumpToView("home"));
}

function renderLeagueRules(runtime) {
  const list = document.querySelector(".leagueRulesList");
  if (!list) return;

  const tier = getLeagueTierDescriptor(runtime);

  list.innerHTML = `
    <div class="leagueRuleItem">
      <span>Tier Stack</span>
      <strong>Open → Pro → Elite → Champions Cup</strong>
    </div>
    <div class="leagueRuleItem">
      <span>Cadence</span>
      <strong>1 Match / Day • 20:00 UTC</strong>
    </div>
    <div class="leagueRuleItem">
      <span>Lock Rule</span>
      <strong>1 Hour Before Kickoff</strong>
    </div>
    <div class="leagueRuleItem">
      <span>Division</span>
      <strong>${tier.name}</strong>
    </div>
  `;
}

function renderLeagueShell() {
  const runtime = buildLeagueRuntime(new Date());
  const tier = getLeagueTierDescriptor(runtime);

  safeText(el("league-tier-badge"), tier.badge);
  safeText(el("league-tier-name"), tier.name);
  safeText(el("league-tier-copy"), tier.copy);
  safeText(el("league-status-badge"), !runtime.registered ? "NOT REGISTERED" : state.tacticsLocked ? "LOCK WINDOW" : "SEASON LIVE");

  const lockBtn = el("btn-league-lock");

  if (!runtime.registered) {
    const regDate = runtime.registrationDate;
    safeText(el("league-next-opponent"), "Register for Season 4");
    safeText(el("league-next-kickoff"), `Registration closes near first kickoff • ${regDate.toUTCString().replace("GMT", "UTC")}`);
    safeText(el("league-lock-status"), "Waiting");
    safeText(el("league-lock-clock"), "Join a league to unlock the daily fixture calendar.");
    safeText(el("league-cd-days"), "03");
    safeText(el("league-cd-hours"), "00");
    safeText(el("league-cd-mins"), "00");

    if (lockBtn) {
      lockBtn.textContent = "Register League";
      lockBtn.disabled = false;
      lockBtn.onclick = registerForLeague;
    }
  } else if (!runtime.nextFixture) {
    safeText(el("league-next-opponent"), "Season Complete");
    safeText(el("league-next-kickoff"), "All scheduled fixtures have been played.");
    safeText(el("league-lock-status"), "Closed");
    safeText(el("league-lock-clock"), "No remaining fixtures this season.");
    safeText(el("league-cd-days"), "00");
    safeText(el("league-cd-hours"), "00");
    safeText(el("league-cd-mins"), "00");

    if (lockBtn) {
      lockBtn.textContent = "Open Tactics Room";
      lockBtn.disabled = false;
      lockBtn.onclick = handleLockTactics;
    }
  } else {
    const kickoff = runtime.nextFixture.kickoff;
    const lockTime = new Date(kickoff.getTime() - 3600000);
    const diff = Math.max(0, kickoff.getTime() - Date.now());

    safeText(el("league-next-opponent"), `${runtime.teamsById[runtime.nextFixture.homeId].name} vs ${runtime.teamsById[runtime.nextFixture.awayId].name}`);
    safeText(el("league-next-kickoff"), `Kickoff ${kickoff.toUTCString().replace("GMT", "UTC")}`);
    safeText(el("league-lock-status"), state.tacticsLocked ? "Locked" : "Open");
    safeText(el("league-lock-clock"), state.tacticsLocked ? `Locked until ${kickoff.toUTCString().replace("GMT", "UTC")}` : `Open now • lock at ${formatTimeUtc(lockTime)}`);

    safeText(el("league-cd-days"), String(Math.floor(diff / 86400000)).padStart(2, "0"));
    safeText(el("league-cd-hours"), String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0"));
    safeText(el("league-cd-mins"), String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"));

    if (lockBtn) {
      lockBtn.textContent = "Open Tactics Room";
      lockBtn.disabled = false;
      lockBtn.onclick = handleLockTactics;
    }
  }

  if (runtime.registered && !state.league.userSelectedMd) {
    setLeagueActiveMd(runtime.currentMd, false);
  }

  renderLeagueTable(runtime);
  renderLeagueMatchdayTabs(runtime);
  renderLeagueFixtures(runtime);
  renderLeagueRegistrationPanel(runtime);
  renderLeagueRules(runtime);
}

function renderHomeCountdown() {
  const runtime = buildLeagueRuntime(new Date());
  renderHomeMatchCard(runtime);
  renderHomeLeagueStanding(runtime);
}

function startHomeCountdown() {
  if (state.countdownTimer) clearInterval(state.countdownTimer);
  renderHomeCountdown();
  renderLeagueShell();
  state.countdownTimer = setInterval(() => {
    renderHomeCountdown();
    renderTacticsShell();
    renderLeagueShell();
  }, 1000);
}

function registerForLeague() {
  state.league.joined = true;
  state.league.tier = state.isPro ? "PRO" : "OPEN";
  state.league.seasonStartIso = getDefaultJoinedSeasonStart().toISOString();
  state.league.userSelectedMd = false;
  saveLeagueState();
  setLeagueActiveMd(1, false);
  renderHomeCountdown();
  renderLeagueShell();
  setStatus("League registration confirmed.");
}
/* =========================
   OVERLAY / PACKS / DAILY / MARKET / BOOT
========================= */

function getPackPityProgress(packKey) {
  const product = PACK_MARKET_PRODUCTS[packKey] || PACK_MARKET_PRODUCTS.kickoff;
  const current = Number(state.packPity?.[packKey] || 0);
  return {
    current,
    base: product.pityBase,
    triggerAt: product.pityBase + 1
  };
}

function bumpPackPity(packKey) {
  if (!PACK_MARKET_PRODUCTS[packKey]) return;
  const progress = getPackPityProgress(packKey);
  const next = progress.current + 1 >= progress.triggerAt ? 0 : progress.current + 1;
  state.packPity[packKey] = next;
  savePackPityState();
}

function showOverlay() {
  const o = el("revealOverlay");
  if (!o) return;
  o.classList.remove("hidden");
  o.setAttribute("aria-hidden", "false");
}

function hideOverlay() {
  const o = el("revealOverlay");
  if (!o) return;
  o.classList.add("hidden");
  o.setAttribute("aria-hidden", "true");
}

function showPackOddsOverlay(packKey) {
  const overlay = el("packOddsOverlay");
  const table = el("packOddsTable");
  const pity = el("packOddsPity");
  const title = el("packOddsTitle");
  const sub = el("packOddsSub");
  const product = PACK_MARKET_PRODUCTS[packKey] || PACK_MARKET_PRODUCTS.kickoff;
  const progress = getPackPityProgress(packKey);

  if (!overlay || !table || !pity || !title || !sub) return;

  safeText(title, `${product.title} Odds`);
  safeText(sub, "Probability table and pity tracker");

  table.innerHTML = `
    <div class="packOddsRow packOddsHead">
      <div>Rarity</div>
      <div>Chance</div>
    </div>
    ${product.odds.map((row) => `
      <div class="packOddsRow">
        <div><span class="packOddsDot ${normalizeRarity(row.rarity).toLowerCase()}"></span>${normalizeRarity(row.rarity)}</div>
        <div>${row.chance}</div>
      </div>
    `).join("")}
  `;

  safeText(
    pity,
    `You have opened ${progress.current} / ${product.pityBase} ${product.title}s — pity activates at ${progress.triggerAt}.`
  );

  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
}

function hidePackOddsOverlay() {
  const overlay = el("packOddsOverlay");
  if (!overlay) return;
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
}

function setOverlaySub(t) {
  safeText(el("overlaySub"), t);
}

function resetRevealUI() {
  state.revealIndex = 0;
  state.revealing = false;

  const inner = el("overlayInner");
  if (inner) inner.classList.remove("legendaryBurst");

  const claim = el("btn-claim");
  if (claim) {
    claim.disabled = true;
    claim.textContent = "Claim";
  }

  safeText(el("revealHint"), "Tap to reveal");

  const pack = el("revealPack");
  if (pack) pack.classList.add("shake");

  const list = el("revealCards");
  if (!list) return;

  list.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const card = document.createElement("div");
    card.className = "flipCard";
    card.dataset.i = String(i);
    card.innerHTML = `
      <div class="flipInner">
        <div class="flipFace flipBack">
          <div class="q">?</div>
          <div class="t">Reveal</div>
        </div>
        <div class="flipFace flipFront">
          <div class="cardTop">
            <div>
              <div class="cardName">Unknown</div>
              <div class="cardMeta">— • —</div>
            </div>
            <div class="badge">—</div>
          </div>
          <div class="kfRevealStats">
            <div class="kfStat"><span>PAC</span><strong>--</strong></div>
            <div class="kfStat"><span>PAS</span><strong>--</strong></div>
            <div class="kfStat"><span>ATT</span><strong>--</strong></div>
            <div class="kfStat"><span>DEF</span><strong>--</strong></div>
          </div>
          <div class="cardFooter"><span class="muted">KICKFORGE</span><span class="muted">v1</span></div>
        </div>
      </div>
    `;
    list.appendChild(card);
  }
}

function injectRevealData(cards) {
  const list = el("revealCards");
  if (!list) return;

  [...list.querySelectorAll(".flipCard")].forEach((node, i) => {
    const c = normalizeCard(cards[i]);
    if (!c) return;

    const vm = cardVisualModel(c);
    const badge = node.querySelector(".badge");
    const name = node.querySelector(".cardName");
    const meta = node.querySelector(".cardMeta");
    const statsWrap = node.querySelector(".kfRevealStats");

    node.classList.remove("rCommon", "rRare", "rEpic", "rLegend");
    node.classList.add(rarityClass(c.rarity));

    if (badge) badge.textContent = c.rarity;
    if (name) name.textContent = c.display_name;
    if (meta) meta.textContent = `${c.position} • ${c.role}`;
    if (statsWrap) {
      statsWrap.innerHTML = `
        <div class="kfStat"><span>PAC</span><strong>${vm.pace}</strong></div>
        <div class="kfStat"><span>PAS</span><strong>${vm.pass}</strong></div>
        <div class="kfStat"><span>ATT</span><strong>${vm.attack}</strong></div>
        <div class="kfStat"><span>DEF</span><strong>${vm.defense}</strong></div>
      `;
    }
  });
}

function legendaryBurst() {
  const inner = el("overlayInner");
  if (!inner) return;
  inner.classList.remove("legendaryBurst");
  void inner.offsetWidth;
  inner.classList.add("legendaryBurst");
}

async function flipNext() {
  if (state.revealing) return;
  if (state.revealIndex >= state.revealCards.length) return;
  state.revealing = true;

  const i = state.revealIndex;
  const card = normalizeCard(state.revealCards[i]);
  const node = el("revealCards")?.querySelector(`.flipCard[data-i="${i}"]`);
  if (node) node.classList.add("flipped");

  const rr = normalizeRarity(card?.rarity);
  if (rr === "ICON") {
    legendaryBurst();
    setOverlaySub("Icon pull.");
  } else if (rr === "LEGENDARY") {
    legendaryBurst();
    setOverlaySub("Legendary pull.");
  } else if (rr === "EPIC") {
    setOverlaySub("Epic pull.");
  } else if (rr === "RARE") {
    setOverlaySub("Rare pull.");
  } else if (rr === "UNCOMMON") {
    setOverlaySub("Uncommon pull.");
  } else {
    setOverlaySub("Common pull.");
  }

  await sleep(550);
  state.revealIndex += 1;
  state.revealing = false;

  if (state.revealIndex >= state.revealCards.length) {
    const pack = el("revealPack");
    if (pack) pack.classList.remove("shake");
    setOverlaySub("Pack complete.");
    const claim = el("btn-claim");
    if (claim) claim.disabled = false;
    safeText(el("revealHint"), "Done");
  }
}

async function openPack(packKind = "kickoff") {
  const btn = el("btn-pack");
  const btnHome = el("btn-home-pack");

  [btn, btnHome].forEach((b) => {
    if (b) {
      b.disabled = true;
      b.textContent = "Opening…";
    }
  });

  showOverlay();
  resetRevealUI();
  setOverlaySub("Generating pack…");

  try {
    await ensureSession();
    const data = await api("/v1/packs/open", { method: "POST", body: JSON.stringify({ kind: "DAILY" }) });
    state.revealCards = (data.cards || []).map(normalizeCard).filter(Boolean);
    injectRevealData(state.revealCards);
    renderPackResults(state.revealCards);
    bumpPackPity(packKind);
    await loadDaily();
    jumpToView("squad");
  } catch (e) {
    hideOverlay();
    alert(e.message);
  } finally {
    [btn, btnHome].forEach((b) => {
      if (b) {
        b.disabled = false;
        b.textContent = "Open Pack";
      }
    });
  }
}

function updateBattlePassUI(bp) {
  if (!bp) return;
  state.battlepass = bp;

  const pct = Math.round((bp.xp / bp.need) * 100);

  safeText(el("bp-level"), `Lv ${bp.level}`);
  if (el("bpFill")) el("bpFill").style.width = `${pct}%`;
  safeText(el("bpText"), `${bp.xp} / ${bp.need} XP`);

  safeText(el("bp-level-home"), `Lv ${bp.level}`);
  if (el("bpFillHome")) el("bpFillHome").style.width = `${pct}%`;
  safeText(el("bpTextHome"), `${bp.xp} / ${bp.need} XP`);
  safeText(el("home-bp"), `Lv ${bp.level}`);
}

async function loadMe() {
  const data = await api("/v1/me", { method: "GET" });
  setCoins(data.coins);
  updateBattlePassUI(data.battlepass);
}

async function loadPro() {
  const data = await api("/v1/pro/status", { method: "GET" });
  state.isPro = !!data.isPro;
  safeText(el("proTag"), state.isPro ? "PRO" : "FREE");
}

async function playArena() {
  const log = el("arenaLog");
  const btn = el("btn-arena");
  const homeBtn = el("btn-home-arena");

  [btn, homeBtn].forEach((b) => {
    if (b) {
      b.disabled = true;
      b.textContent = "Playing…";
    }
  });

  safeText(log, "Match starting…");

  try {
    const res = await api("/v1/arena/play", {
      method: "POST",
      body: JSON.stringify({ mode: state.arenaMode, style: state.style })
    });

    safeText(
      log,
      `${res.result} • Team ${res.teamRating} vs Opp ${res.oppRating} • +${res.rewards.coins} coins • +${res.rewards.bpXp} BP XP`
    );

    setCoins(res.coins);
    updateBattlePassUI(res.battlepass);
    await loadDaily();
  } catch (e) {
    safeText(log, e.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Play Match";
    }
    if (homeBtn) {
      homeBtn.disabled = false;
      homeBtn.textContent = "Play Arena";
    }
  }
}

function attachDailyClaimHandlers(rootSelector, attrName) {
  $$(`${rootSelector} [${attrName}]`).forEach((btn) => {
    btn.addEventListener("click", async () => {
      const key = btn.getAttribute(attrName);
      btn.disabled = true;
      try {
        const res = await api("/v1/challenges/claim", { method: "POST", body: JSON.stringify({ taskKey: key }) });
        setCoins(res.coins);
        updateBattlePassUI(res.battlepass);
        await loadDaily();
      } catch (e) {
        alert(e.message);
      }
    });
  });
}

async function loadDaily() {
  const d = await api("/v1/challenges/today", { method: "GET" });
  state.daily = d;
  renderDaily(d);
  renderDailyHome(d);
}

function dailyRowHTML(t, attrName) {
  const done = t.completed;
  const canClaim = done && !t.claimed;
  const status = t.claimed ? "CLAIMED" : done ? "READY" : "IN PROGRESS";

  return `
    <div class="dailyItem">
      <div>
        <div style="font-weight:900">${t.title}</div>
        <div class="dailyMeta">${t.desc}</div>
        <div class="dailyMeta">Reward: +${t.rewardCoins}c • +${t.rewardBpXp} XP</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
        <div class="dailyProg">${t.progress}/${t.target}</div>
        <button class="smallBtn ${canClaim ? "primary" : "ghost"}" ${attrName}="${t.key}" ${canClaim ? "" : "disabled"}>${status}</button>
      </div>
    </div>
  `;
}

function renderDaily(d) {
  const date = el("daily-date");
  const list = el("dailyList");
  const chestBtn = el("btn-chest");
  const chestStatus = el("chestStatus");

  safeText(date, d.date || "—");
  if (list) {
    list.innerHTML = (d.tasks || []).map((t) => dailyRowHTML(t, "data-claim")).join("");
    attachDailyClaimHandlers("#view-progress", "data-claim");
  }

  if (chestBtn) chestBtn.disabled = !(d.chest?.available) || d.chest?.opened;

  if (chestStatus) {
    if (d.chest?.opened) chestStatus.textContent = d.chest.duplicate ? "Chest opened — duplicate converted into coins." : "Chest opened — new cosmetic unlocked.";
    else if (d.chest?.available) chestStatus.textContent = "All challenges complete. Open your daily chest.";
    else chestStatus.textContent = "Complete + claim all 3 to unlock.";
  }

  if (chestBtn) {
    chestBtn.onclick = async () => {
      chestBtn.disabled = true;
      try {
        const res = await api("/v1/challenges/chest/open", { method: "POST", body: JSON.stringify({}) });
        if (res.coins != null) setCoins(res.coins);
        await loadCosmetics();
        await loadDaily();
      } catch (e) {
        alert(e.message);
      }
    };
  }
}

function renderDailyHome(d) {
  safeText(el("daily-date-home"), d.date || "—");
  const list = el("dailyListHome");
  if (!list) return;

  list.innerHTML = (d.tasks || []).map((t) => dailyRowHTML(t, "data-claim-home")).join("");
  attachDailyClaimHandlers("#view-home", "data-claim-home");
}

function applyTheme(themeKey) {
  document.body.classList.remove("theme-obsidian", "theme-neon", "theme-emerald");
  document.body.classList.add(`theme-${themeKey || "obsidian"}`);
}

async function loadCosmetics() {
  const data = await api("/v1/cosmetics", { method: "GET" });
  state.cosmetics = data.items || [];
  renderCosmetics(state.cosmetics);
}

function renderCosmetics(items) {
  const wrap = el("cosList");
  if (!wrap) return;

  const theme = items.find((x) => x.type === "THEME" && x.equipped);
  applyTheme(theme?.meta?.theme || "obsidian");

  wrap.innerHTML = items.length ? items.map((c) => {
    const eq = c.equipped;
    return `
      <div class="cosItem">
        <div>
          <div class="cosName">${c.name}</div>
          <div class="cosMeta">${c.type} • ${c.rarity}</div>
        </div>
        <button class="smallBtn ${eq ? "ghost" : "primary"}" data-equip="${c.id}" ${eq ? "disabled" : ""}>
          ${eq ? "EQUIPPED" : "EQUIP"}
        </button>
      </div>
    `;
  }).join("") : `<div class="muted tiny">No cosmetics yet.</div>`;

  $$("[data-equip]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-equip");
      btn.disabled = true;
      try {
        await api("/v1/cosmetics/equip", { method: "POST", body: JSON.stringify({ cosmeticId: id }) });
        await loadCosmetics();
      } catch (e) {
        alert(e.message);
      }
    });
  });
}

function renderMarketSelected() {
  const n = el("mk-selected");
  const min = el("mk-min");
  const btn = el("btn-list");
  const c = state.selectedCardId ? getCardById(state.selectedCardId) : null;

  if (!c) {
    safeText(n, "None");
    safeText(min, "Min: —");
    if (btn) btn.disabled = false;
    return;
  }

  const isListed = state.market.listedSet.has(c.id);
  const minP = minPriceFor(c.rarity);

  safeText(n, `${c.display_name} (${c.rarity})`);
  safeText(min, `Min: ${minP} coins`);
  if (btn) btn.disabled = isListed;
}

function synthesizePulseData() {
  const trades = state.market.trades || [];
  const listings = state.market.listings || [];
  const source = trades.length
    ? trades.slice(0, 24).map((x) => Number(x.price || 0))
    : listings.slice(0, 24).map((x) => Number(x.price || 0));

  const base = source.length ? Math.max(20, Math.round(source.reduce((a, b) => a + b, 0) / source.length)) : 1200;
  const seed = hashString(`pulse|${base}|${source.length}|${state.userId || "guest"}`);
  const rnd = mulberry32(seed);

  const points = [];
  let current = base;
  for (let i = 0; i < 24; i++) {
    const drift = Math.round((rnd() - 0.46) * Math.max(8, base * 0.03));
    current = Math.max(10, current + drift);
    points.push({ price: current });
  }

  const first = points[0]?.price || base;
  const last = points[points.length - 1]?.price || base;
  const chg24h = first ? Math.round(((last - first) / first) * 100) : 0;

  return { last, chg24h, points };
}

function ensurePulseData() {
  const pulse = state.market.pulse || {};
  const pts = Array.isArray(pulse.points) ? pulse.points : [];
  if (!pts.length) {
    state.market.pulse = synthesizePulseData();
    return;
  }

  const last = pulse.last ?? pts[pts.length - 1]?.price ?? null;
  const first = pts[0]?.price ?? null;
  const chg24h = pulse.chg24h ?? (first ? Math.round(((last - first) / first) * 100) : 0);

  state.market.pulse = { last, chg24h, points: pts };
}

function renderLineChart(svgId, points, width = 300, height = 64) {
  const svg = el(svgId);
  if (!svg) return;

  const vals = (points || []).map((p) => Number(p.price || p.value || 0)).filter((n) => Number.isFinite(n));
  if (!vals.length) {
    svg.innerHTML = `<path d="M0 ${height - 8} L${width} ${height - 8}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="2"/>`;
    return;
  }

  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = Math.max(1, max - min);
  const yOf = (v) => (height - 10) - ((v - min) / span) * (height - 18);

  if (vals.length === 1) {
    const y = yOf(vals[0]);
    svg.innerHTML = `
      <path d="M0 ${y.toFixed(2)} L${width} ${y.toFixed(2)}" fill="none" stroke="rgba(232,184,75,.90)" stroke-width="2.2"/>
      <path d="M0 ${y.toFixed(2)} L${width} ${y.toFixed(2)} L${width} ${height} L0 ${height} Z" fill="rgba(232,184,75,.10)"/>
      <circle cx="${width - 8}" cy="${y.toFixed(2)}" r="3.4" fill="rgba(0,230,118,.90)"/>
    `;
    return;
  }

  const step = width / (vals.length - 1);
  const d = vals.map((v, i) => {
    const x = i * step;
    const y = yOf(v);
    return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");

  svg.innerHTML = `
    <path d="${d}" fill="none" stroke="rgba(232,184,75,.90)" stroke-width="2.2"/>
    <path d="${d} L${width} ${height} L0 ${height} Z" fill="rgba(232,184,75,.10)"/>
  `;
}

function renderOnePulse(svgId, lastId, chgId) {
  ensurePulseData();
  safeText(el(lastId), state.market.pulse.last == null ? "—" : priceFmt(state.market.pulse.last));
  safeText(
    el(chgId),
    state.market.pulse.chg24h == null
      ? "—"
      : `${state.market.pulse.chg24h > 0 ? "+" : ""}${state.market.pulse.chg24h}%`
  );
  renderLineChart(svgId, state.market.pulse.points, 300, 64);
}

function renderMarketChart() {
  ensurePulseData();
  const points = (state.market.pulse.points || []).slice(-30);
  renderLineChart("marketChartSvg", points.length ? points : synthesizePulseData().points.slice(-30), 360, 150);
}

function renderPulse() {
  renderOnePulse("sparkSvg", "m-last", "m-chg");
  renderOnePulse("sparkSvgHome", "m-last-home", "m-chg-home");
  renderMarketChart();
}

function buildTickerText() {
  const trades = state.market.trades || [];
  if (trades.length) {
    const top = trades
      .slice()
      .sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
      .slice(0, 3)
      .map((x) => `${shortName(x.display_name)} — ${priceFmt(x.price)}`);
    return `Most Expensive Sale Today: ${top.join(" • ")}`;
  }

  const listings = state.market.listings || [];
  if (listings.length) {
    const top = listings
      .slice()
      .sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
      .slice(0, 3)
      .map((x) => `${shortName(x.display_name)} ${priceFmt(x.price)}`);
    return `Live Listings: ${top.join(" • ")}`;
  }

  return "Most Expensive Sale Today: M. Velenz — 62,000 FC";
}

function renderTicker() {
  safeText(el("marketTickerTrack"), buildTickerText());
}

function getFilteredMarketListings() {
  const query = String(state.market.query || "").trim().toLowerCase();
  const rarity = state.market.rarityFilter || "ALL";
  const pos = state.market.positionFilter || "ALL";
  const sort = state.market.sort || "PRICE_ASC";

  const rows = (state.market.listings || []).filter((x) => {
    const qOk = !query || [x.display_name, x.position, x.role, x.rarity].some((v) => String(v || "").toLowerCase().includes(query));
    const rOk = rarity === "ALL" || normalizeRarity(x.rarity) === rarity;
    const pOk = pos === "ALL" || normalizePosition(x.position) === pos;
    return qOk && rOk && pOk;
  });

  rows.sort((a, b) => {
    if (sort === "PRICE_ASC") return Number(a.price || 0) - Number(b.price || 0);
    if (sort === "PRICE_DESC") return Number(b.price || 0) - Number(a.price || 0);
    if (sort === "RARITY_DESC") return (RARITY_ORDER[normalizeRarity(b.rarity)] || 0) - (RARITY_ORDER[normalizeRarity(a.rarity)] || 0);
    if (sort === "OVR_DESC") return cardVisualModel(b).ovr - cardVisualModel(a).ovr;
    if (sort === "NEWEST") return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    return 0;
  });

  return rows;
}

function listingMomentum(listing, idx = 0) {
  const seed = hashString(`${listing.listing_id || listing.card_id || listing.id}|${listing.price}|${idx}`);
  const rnd = mulberry32(seed);
  const pct = Math.round(((rnd() * 18) - 5) * 10) / 10;
  return pct;
}

function marketListingCardHTML(x, idx = 0) {
  const vm = cardVisualModel(x);
  const momentum = listingMomentum(x, idx);
  const up = momentum >= 0;
  const trend = `${up ? "▲" : "▼"} ${up ? "+" : ""}${Math.abs(momentum)}% this week`;

  return `
    <div class="marketListingCard">
      <div class="marketListingTop">
        <div>
          <div class="marketListingName">${x.display_name}</div>
          <div class="marketListingMeta">${x.position} • ${x.rarity}</div>
        </div>
        <div class="marketBidTag">${x.seller_user_id === state.userId ? "YOURS" : "BUY"}</div>
      </div>

      <div class="marketListingBody">
        <div class="marketListingStats">
          <div class="marketListingStat"><span>OVR</span><strong>${vm.ovr}</strong></div>
          <div class="marketListingStat"><span>POS</span><strong>${x.position}</strong></div>
          <div class="marketListingStat"><span>PAC</span><strong>${vm.pace}</strong></div>
          <div class="marketListingStat"><span>ATT</span><strong>${vm.attack}</strong></div>
        </div>
        <div class="marketListingMeta" style="color:${up ? "var(--emerald)" : "var(--alert-red)"}">${trend}</div>
      </div>

      <div class="marketListingFooter">
        <div class="marketPrice">${Number(x.price || 0).toLocaleString("en-GB")}</div>
        <button class="smallBtn primary" data-buy-market="${x.listing_id}">Buy</button>
      </div>
    </div>
  `;
}

function intelRowHTML(name, meta, value) {
  return `
    <div class="intelRow">
      <div class="intelRowHead">
        <div class="intelRowName">${name}</div>
        <div class="intelRowMeta">${meta}</div>
      </div>
      <div class="intelRowValue">${value}</div>
    </div>
  `;
}

function renderMarketPlayersGrid() {
  const wrap = el("marketPlayersGrid");
  if (!wrap) return;

  const rows = getFilteredMarketListings();
  safeText(el("market-player-count"), `${rows.length} LISTINGS`);

  if (!rows.length) {
    wrap.innerHTML = `<div class="muted tiny">No player listings match your current filters.</div>`;
    return;
  }

  wrap.innerHTML = rows.map((x, idx) => marketListingCardHTML(x, idx)).join("");

  $$("[data-buy-market]", wrap).forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-buy-market");
      btn.disabled = true;
      try {
        const res = await api("/v1/market/buy", { method: "POST", body: JSON.stringify({ listingId: id }) });
        setCoins(res.coins);
        await loadInventory();
        await loadMarket();
        await loadDaily();
        setStatus(`Purchase complete. Paid ${res.paid} coins.`);
      } catch (e) {
        setStatus(e.message);
      } finally {
        btn.disabled = false;
      }
    });
  });
}

function myListingHTML(x) {
  return `
    <div class="listing">
      <div>
        <div style="font-weight:900">${x.display_name || "Unknown"}</div>
        <div class="listingMeta">${x.position} • ${x.role} • ${x.rarity}</div>
      </div>
      <div class="listingRight">
        <div class="priceTag">${Number(x.price || 0).toLocaleString("en-GB")}c</div>
        <button class="smallBtn danger" data-cancel-market="${x.listing_id}">Cancel</button>
      </div>
    </div>
  `;
}

function renderMyListings() {
  const wrap = el("myListings");
  if (!wrap) return;

  const mine = (state.market.mine || []).filter((x) => x.status === "OPEN");
  safeText(el("myCount"), `(${mine.length}/${state.market.rules.maxOpenListings})`);

  wrap.innerHTML = mine.length
    ? mine.map(myListingHTML).join("")
    : `<div class="muted tiny">No active listings.</div>`;

  $$("[data-cancel-market]", wrap).forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-cancel-market");
      btn.disabled = true;
      try {
        await api("/v1/market/cancel", { method: "POST", body: JSON.stringify({ listingId: id }) });
        await loadMarket();
        setStatus("Listing cancelled.");
      } catch (e) {
        setStatus(e.message);
      } finally {
        btn.disabled = false;
      }
    });
  });
}

function renderTrades() {
  const wrap = el("tradeList");
  if (!wrap) return;

  const rows = state.market.trades || [];
  wrap.innerHTML = rows.length
    ? rows.map((x) => `
      <div class="tradeRow">
        <div>
          <div style="font-weight:900">${x.display_name}</div>
          <div class="tradeMeta">${x.position} • ${x.role} • ${x.rarity} • ${formatAgo(x.created_at)}</div>
        </div>
        <div class="priceTag">${Number(x.price || 0).toLocaleString("en-GB")}c</div>
      </div>
    `).join("")
    : `<div class="muted tiny">No trades yet.</div>`;
}

function formatAgo(ts) {
  const stamp = typeof ts === "string" ? new Date(ts).getTime() : Number(ts || 0);
  const s = Math.max(1, Math.floor((Date.now() - stamp) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

function renderHomeMovers() {
  const wrap = el("moversHome");
  if (!wrap) return;

  const source = getFilteredMarketListings().slice(0, 3);
  if (!source.length) {
    wrap.innerHTML = `
      <div class="moverRow"><div class="moverDot rare"></div><div class="moverName">M. Velenz</div><div class="moverPct up">+12%</div></div>
      <div class="moverRow"><div class="moverDot epic"></div><div class="moverName">R. Ibarra</div><div class="moverPct up">+8%</div></div>
      <div class="moverRow"><div class="moverDot common"></div><div class="moverName">D. Kanez</div><div class="moverPct down">-5%</div></div>
    `;
    return;
  }

  wrap.innerHTML = source.map((x, i) => {
    const pct = i === 2 ? -5 : Math.max(4, Math.round((listingMomentum(x, i) + 9)));
    const cls = pct >= 0 ? "up" : "down";
    const sign = pct >= 0 ? "+" : "";
    const rr = normalizeRarity(x.rarity);
    const dotClass = rr === "ICON" || rr === "LEGENDARY" ? "legendary" : rr === "EPIC" ? "epic" : rr === "RARE" || rr === "UNCOMMON" ? "rare" : "common";

    return `
      <div class="moverRow">
        <div class="moverDot ${dotClass}"></div>
        <div class="moverName">${shortName(x.display_name)}</div>
        <div class="moverPct ${cls}">${sign}${pct}%</div>
      </div>
    `;
  }).join("");
}

function renderMarketIntel() {
  const listings = getFilteredMarketListings();
  const trades = state.market.trades || [];

  const risingWrap = el("marketRisingStars");
  const moversWrap = el("marketMoversFeed");
  const mostWrap = el("marketMostTraded");

  if (risingWrap) {
    const rising = listings
      .slice()
      .sort((a, b) => {
        const aScore = cardVisualModel(a).ovr / Math.max(1, Number(a.price || 1));
        const bScore = cardVisualModel(b).ovr / Math.max(1, Number(b.price || 1));
        return bScore - aScore;
      })
      .slice(0, 4);

    risingWrap.innerHTML = rising.length
      ? rising.map((x) => intelRowHTML(shortName(x.display_name), `${x.rarity} • OVR ${cardVisualModel(x).ovr}`, priceFmt(x.price))).join("")
      : `<div class="muted tiny">No rising stars yet.</div>`;
  }

  if (moversWrap) {
    const movers = listings
      .slice()
      .sort((a, b) => Math.abs(listingMomentum(b)) - Math.abs(listingMomentum(a)))
      .slice(0, 4);

    moversWrap.innerHTML = movers.length
      ? movers.map((x, idx) => {
          const mv = listingMomentum(x, idx);
          return intelRowHTML(shortName(x.display_name), `${x.position} • ${x.rarity}`, `${mv > 0 ? "+" : ""}${mv}%`);
        }).join("")
      : `<div class="muted tiny">No mover data yet.</div>`;
  }

  if (mostWrap) {
    const map = new Map();
    trades.forEach((t) => {
      const key = t.display_name || "Unknown";
      map.set(key, (map.get(key) || 0) + 1);
    });

    const most = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);

    mostWrap.innerHTML = most.length
      ? most.map(([name, count]) => intelRowHTML(shortName(name), "Trade volume", `${count}x`)).join("")
      : listings.slice(0, 4).map((x) => intelRowHTML(shortName(x.display_name), "Open interest", "Live")).join("");
  }
}

function setMarketTab(tab) {
  const nextTab = MARKET_TABS.includes(tab) ? tab : "players";
  state.market.activeTab = nextTab;
  $$(".marketTopTab").forEach((btn) => btn.classList.toggle("is-active", btn.dataset.marketTab === nextTab));
  $$(".marketZone").forEach((zone) => zone.classList.toggle("is-active", zone.dataset.marketZone === nextTab));
}

function initMarketTabs() {
  $$(".marketTopTab").forEach((btn) => {
    btn.addEventListener("click", () => {
      setMarketTab(btn.dataset.marketTab);
    });
  });
}

function initMarketControls() {
  const q = el("mk-search");
  const rarity = el("mk-rarity-filter");
  const pos = el("mk-position-filter");
  const sort = el("mk-sort");

  if (q) q.value = state.market.query || "";
  if (rarity) rarity.value = state.market.rarityFilter || "ALL";
  if (pos) pos.value = state.market.positionFilter || "ALL";
  if (sort) sort.value = state.market.sort || "PRICE_ASC";

  const refreshPlayers = debounce(() => {
    renderMarketPlayersGrid();
    renderMarketIntel();
    renderHomeMovers();
  }, 300);

  q?.addEventListener("input", () => {
    state.market.query = q.value || "";
    refreshPlayers();
  });

  rarity?.addEventListener("change", () => {
    state.market.rarityFilter = rarity.value || "ALL";
    renderMarketPlayersGrid();
    renderMarketIntel();
    renderHomeMovers();
  });

  pos?.addEventListener("change", () => {
    state.market.positionFilter = pos.value || "ALL";
    renderMarketPlayersGrid();
    renderMarketIntel();
    renderHomeMovers();
  });

  sort?.addEventListener("change", () => {
    state.market.sort = sort.value || "PRICE_ASC";
    renderMarketPlayersGrid();
    renderMarketIntel();
    renderHomeMovers();
  });
}

function initPackMarketShell() {
  $$(".marketOddsLink").forEach((btn) => {
    btn.addEventListener("click", () => {
      showPackOddsOverlay(btn.dataset.packOdds || "kickoff");
    });
  });

  $$(".marketPackBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const oddsBtn = btn.parentElement?.querySelector("[data-pack-odds]");
      const packKey = oddsBtn?.dataset.packOdds || "kickoff";

      if (packKey === "kickoff") {
        await openPack("kickoff");
        return;
      }

      showPackOddsOverlay(packKey);
      setStatus(`${PACK_MARKET_PRODUCTS[packKey]?.title || "Pack"} checkout/resale flow is shell-ready. Stripe/resale execution comes in the next integration pass.`);
    });
  });
}

function initCoinExchangeShell() {
  const rows = $$(".coinExchangeRow");
  const confirmBtn = el("btn-confirm-coin-purchase");

  rows.forEach((row) => {
    const activate = () => {
      const key = row.dataset.coinBundle;
      state.market.selectedCoinBundle = key;
      rows.forEach((r) => r.classList.toggle("is-selected", r.dataset.coinBundle === key));
      $$(".coinBundleSelectBtn").forEach((btn) => {
        btn.classList.remove("primary");
        btn.classList.add("ghost");
        btn.textContent = "Select";
      });

      const ownBtn = row.querySelector(".coinBundleSelectBtn");
      if (ownBtn) {
        ownBtn.classList.remove("ghost");
        ownBtn.classList.add("primary");
        ownBtn.textContent = "Selected";
      }

      if (confirmBtn) confirmBtn.disabled = false;
    };

    row.addEventListener("click", activate);
    row.querySelector(".coinBundleSelectBtn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      activate();
    });
  });

  confirmBtn?.addEventListener("click", () => {
    const bundle = COIN_BUNDLE_DATA[state.market.selectedCoinBundle];
    if (!bundle) {
      setStatus("Select a Forge Coin bundle first.");
      return;
    }
    setStatus(`Stripe hosted checkout shell ready for ${bundle.name} (${bundle.price}). Webhook grant flow comes next.`);
  });
}

async function listSelected() {
  const price = Number(el("mk-price")?.value || 0);

  if (!state.selectedCardId) {
    setStatus("Select a card first.");
    return;
  }

  const c = getCardById(state.selectedCardId);
  const minP = minPriceFor(c?.rarity);

  if (!Number.isFinite(price) || price < minP) {
    setStatus(`Min price for ${c?.rarity} is ${minP}.`);
    return;
  }

  const btn = el("btn-list");
  if (btn) btn.disabled = true;

  try {
    await api("/v1/market/list", { method: "POST", body: JSON.stringify({ cardId: state.selectedCardId, price }) });
    setStatus("Listed successfully.");
    if (el("mk-price")) el("mk-price").value = "";
    await loadMarket();
    await loadDaily();
  } catch (e) {
    setStatus(e.message);
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function loadMarket() {
  const [rules, pulse, open, mine, trades] = await Promise.all([
    api("/v1/market/rules", { method: "GET" }).catch(() => DEFAULT_RULES),
    api("/v1/market/pulse?limit=60", { method: "GET" }).catch(() => ({ last: null, chg24h: null, points: [] })),
    api("/v1/market/listings?limit=60", { method: "GET" }),
    api("/v1/market/my", { method: "GET" }),
    api("/v1/market/trades?limit=20", { method: "GET" }).catch(() => ({ trades: [] }))
  ]);

  state.market.rules = { ...DEFAULT_RULES, ...(rules || {}) };
  state.market.rules.minPrice = { ...DEFAULT_RULES.minPrice, ...(rules?.minPrice || {}) };
  state.market.pulse = pulse || { last: null, chg24h: null, points: [] };
  state.market.trades = trades.trades || [];

  const allOpen = (open.listings || []).map(normalizeCard);
  state.market.listings = allOpen.filter((x) => x.seller_user_id !== state.userId);

  state.market.mine = (mine.listings || []).map(normalizeCard);
  const openMine = state.market.mine.filter((x) => x.status === "OPEN");
  state.market.listedSet = new Set(openMine.map((x) => x.card_id));

  reconcileBenchWithState();
  renderPulse();
  renderTicker();
  renderMarketPlayersGrid();
  renderMyListings();
  renderTrades();
  renderMarketIntel();
  renderHomeMovers();
  renderInventory();
  renderBench();
  renderSelectedCard();
  refreshSlotStates();
  renderMarketSelected();
  renderTacticsShell();
}

async function loadInventory() {
  const data = await api("/v1/inventory", { method: "GET" });
  state.inventory = (data.cards || []).map(normalizeCard).filter(Boolean);
  state.inventoryLoaded = true;
  reconcileBenchWithState();
  renderInventory();
  renderBench();
  renderSelectedCard();
  renderSquad();
  renderMarketSelected();
}

async function loadSquad() {
  const data = await api("/v1/squad", { method: "GET" });
  state.squad = data.slots || {};
  reconcileBenchWithState();
  renderBench();
  renderSquad();
}

function renderTacticsShell() {
  const runtime = buildLeagueRuntime(new Date());
  const nextKickoff = runtime.registered && runtime.nextFixture ? runtime.nextFixture.kickoff : null;
  const lockTime = nextKickoff ? new Date(nextKickoff.getTime() - 3600000) : null;
  state.tacticsLocked = !!(lockTime && Date.now() >= lockTime.getTime() && Date.now() < nextKickoff.getTime());

  $$("[data-formation]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.formation === state.formation);
  });

  $$("[data-tactic-mode]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.tacticMode === state.tacticMode);
  });

  const cards = document.querySelectorAll(".tacticsTopStrip .tacticsTopCard");
  safeText(cards[0]?.querySelector(".sectionTitle"), formatFormationLabel(state.formation));
  safeText(cards[1]?.querySelector(".sectionTitle"), savedTemplateLabel());

  const validation = validateTeamModel(buildTeamModel());
  const statusLabel = state.tacticsLocked ? "Locked" : validation.isReady ? "Ready" : validation.isComplete ? "Open" : "Incomplete";
  safeText(cards[2]?.querySelector(".sectionTitle"), statusLabel);
  safeText(
    cards[2]?.querySelector(".muted.tiny:last-child"),
    state.tacticsLocked
      ? "Current window locked until kickoff."
      : validation.isReady
        ? "Squad is valid and ready for the next lock window."
        : "Complete the XI and fix conflicts before the next fixture."
  );

  const desc = tacticDescriptors(state.tacticMode);
  safeText(el("tactic-front-shape"), desc.front);
  safeText(el("tactic-mid-core"), desc.mid);
  safeText(el("tactic-def-line"), desc.def);

  [el("btn-lock-tactics"), el("btn-lock-tactics-side")].forEach((btn) => {
    if (!btn) return;
    btn.textContent = state.tacticsLocked ? "Locked" : "Lock Tactics";
    btn.disabled = state.tacticsLocked && runtime.registered;
  });

  state.teamValidation = validation;
  syncSquadPdfCopy();
  applyFormationLayout();
  refreshSlotStates();
  renderSelectedCard();
  updateSynergy();
}

function initChips() {
  $$("[data-filter]").forEach((b) => {
    b.addEventListener("click", () => {
      state.filter = b.dataset.filter;
      $$("[data-filter]").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      renderInventory();
    });
  });

  $$("[data-style]").forEach((b) => {
    if (b.dataset.style === state.style) b.classList.add("active");
    b.addEventListener("click", () => {
      state.style = b.dataset.style;
      localStorage.setItem("cx_style", state.style);
      $$("[data-style]").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      updateSynergy();
    });
  });

  $$("[data-arena]").forEach((b) => {
    if (b.dataset.arena === state.arenaMode) b.classList.add("active");
    b.addEventListener("click", () => {
      state.arenaMode = b.dataset.arena;
      $$("[data-arena]").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      safeText(el("arena-mode"), state.arenaMode);
    });
  });

  $$("[data-formation]").forEach((b) => {
    if (b.dataset.formation === state.formation) b.classList.add("is-active");
    b.addEventListener("click", () => {
      if (state.tacticsLocked) return;
      if (!FORMATIONS.includes(b.dataset.formation)) return;
      state.formation = b.dataset.formation;
      localStorage.setItem("kf_formation", state.formation);
      renderTacticsShell();
      renderSquad();
    });
  });

  $$("[data-tactic-mode]").forEach((b) => {
    if (b.dataset.tacticMode === state.tacticMode) b.classList.add("is-active");
    b.addEventListener("click", () => {
      if (state.tacticsLocked) return;
      if (!TACTIC_MODES.includes(b.dataset.tacticMode)) return;
      state.tacticMode = b.dataset.tacticMode;
      localStorage.setItem("kf_tactic_mode", state.tacticMode);
      renderTacticsShell();
      renderSquad();
      renderSelectedCard();
    });
  });
}

function initViewTabs() {
  $$("[data-view-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setActiveView(btn.dataset.viewTab);
    });
  });

  $$("[data-view-tab-jump]").forEach((btn) => {
    btn.addEventListener("click", () => {
      jumpToView(btn.dataset.viewTabJump);
    });
  });
}

function handleLockTactics() {
  jumpToView("squad");
  renderTacticsShell();
}

async function enterKickForge() {
  const ok = await healthCheck();
  if (!ok) {
    alert("API offline. Check your Worker.");
    return;
  }

  await ensureSession();
  if (el("btn-pack")) el("btn-pack").disabled = false;

  try {
    await Promise.all([
      loadInventory(),
      loadSquad(),
      loadMe(),
      loadPro(),
      loadMarket(),
      loadDaily(),
      loadCosmetics()
    ]);

    renderBench();
    renderTacticsShell();
    renderHomeCountdown();
    renderLeagueShell();
    updateSynergy();
    setActiveView("home");
    scrollToAppShell();
    startHomeCountdown();
  } catch (e) {
    alert(e.message);
  }
}

(function boot() {
  ensureBenchState();
  seedXI();
  renderBench();
  setUserLabel();
  initChips();
  initViewTabs();
  initMarketTabs();
  initMarketControls();
  initPackMarketShell();
  initCoinExchangeShell();
  setMarketTab(state.market.activeTab || "players");

  setActiveView("home");
  safeText(el("arena-mode"), state.arenaMode);
  renderMarketSelected();
  renderHomeCountdown();
  renderTacticsShell();
  renderLeagueShell();
  renderPulse();
  renderTicker();
  renderMarketPlayersGrid();
  renderMyListings();
  renderTrades();
  renderMarketIntel();
  renderHomeMovers();
  healthCheck();

  el("btn-play")?.addEventListener("click", enterKickForge);
  el("btn-pack")?.addEventListener("click", () => openPack("kickoff"));
  el("btn-home-pack")?.addEventListener("click", () => openPack("kickoff"));

  el("btn-arena")?.addEventListener("click", playArena);
  el("btn-home-arena")?.addEventListener("click", async () => {
    jumpToView("squad");
    await playArena();
  });

  el("btn-lock-tactics")?.addEventListener("click", handleLockTactics);
  el("btn-lock-tactics-side")?.addEventListener("click", handleLockTactics);
  el("btn-league-lock")?.addEventListener("click", handleLockTactics);

  el("btn-list")?.addEventListener("click", listSelected);

  el("btn-refresh-market")?.addEventListener("click", async () => {
    setStatus("Refreshing market…");
    try {
      await loadMarket();
      setStatus("Market refreshed.");
    } catch (e) {
      setStatus(e.message);
    }
  });

  el("btn-close")?.addEventListener("click", hideOverlay);
  el("btn-close-pack-odds")?.addEventListener("click", hidePackOddsOverlay);

  el("revealOverlay")?.addEventListener("click", (e) => {
    if (e.target?.id === "revealOverlay") hideOverlay();
  });

  el("packOddsOverlay")?.addEventListener("click", (e) => {
    if (e.target?.id === "packOddsOverlay") hidePackOddsOverlay();
  });

  el("btn-claim")?.addEventListener("click", async () => {
    hideOverlay();
    try {
      await Promise.all([
        loadInventory(),
        loadSquad(),
        loadMe(),
        loadMarket(),
        loadDaily(),
        loadCosmetics()
      ]);
      renderBench();
      renderTacticsShell();
      renderHomeCountdown();
      renderLeagueShell();
    } catch (e) {
      alert(e.message);
    }
  });

  const revealAction = async () => {
    if (!state.revealCards?.length) return;
    await flipNext();
  };

  el("revealPack")?.addEventListener("click", revealAction);
  el("revealCards")?.addEventListener("click", revealAction);

  window.KickForgeDebug = {
    buildTeamModel,
    validateTeamModel,
    buildSynergyModel,
    buildLeagueRuntime,
    generateCardTraits,
    renderMarketPlayersGrid,
    renderMarketIntel,
    showPackOddsOverlay
  };
})();
