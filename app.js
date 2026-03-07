const API_BASE = "https://clash-xi-api.lowkeyy9191.workers.dev";

const el = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SLOT_KEYS = ["GK", "LB", "CB1", "CB2", "RB", "CM1", "CM2", "CAM", "LW", "ST", "RW"];
const DEFAULT_RULES = {
  maxOpenListings: 5,
  feeBps: 500,
  minPrice: { COMMON: 10, RARE: 25, EPIC: 60, LEGENDARY: 150 }
};

const FORMATIONS = ["343", "433", "442", "451", "4231", "352"];
const TACTIC_MODES = ["balanced", "highpress", "counter", "control"];

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
    GK: { x: 50, y: 85 },
    LB: { x: 16, y: 70 },
    CB1: { x: 38, y: 72 },
    CB2: { x: 62, y: 72 },
    RB: { x: 84, y: 70 },
    CM1: { x: 28, y: 50 },
    CM2: { x: 72, y: 50 },
    CAM: { x: 50, y: 38 },
    LW: { x: 18, y: 16 },
    ST: { x: 50, y: 10 },
    RW: { x: 82, y: 16 }
  },
  "442": {
    GK: { x: 50, y: 85 },
    LB: { x: 16, y: 70 },
    CB1: { x: 38, y: 72 },
    CB2: { x: 62, y: 72 },
    RB: { x: 84, y: 70 },
    LW: { x: 16, y: 48 },
    CM1: { x: 38, y: 50 },
    CM2: { x: 62, y: 50 },
    RW: { x: 84, y: 48 },
    CAM: { x: 40, y: 18 },
    ST: { x: 60, y: 18 }
  },
  "451": {
    GK: { x: 50, y: 85 },
    LB: { x: 16, y: 70 },
    CB1: { x: 38, y: 72 },
    CB2: { x: 62, y: 72 },
    RB: { x: 84, y: 70 },
    LW: { x: 12, y: 46 },
    CM1: { x: 32, y: 50 },
    CAM: { x: 50, y: 46 },
    CM2: { x: 68, y: 50 },
    RW: { x: 88, y: 46 },
    ST: { x: 50, y: 12 }
  },
  "4231": {
    GK: { x: 50, y: 85 },
    LB: { x: 16, y: 70 },
    CB1: { x: 38, y: 72 },
    CB2: { x: 62, y: 72 },
    RB: { x: 84, y: 70 },
    CM1: { x: 40, y: 56 },
    CM2: { x: 60, y: 56 },
    LW: { x: 18, y: 34 },
    CAM: { x: 50, y: 34 },
    RW: { x: 82, y: 34 },
    ST: { x: 50, y: 12 }
  },
  "343": {
    GK: { x: 50, y: 85 },
    CB1: { x: 28, y: 70 },
    CB2: { x: 50, y: 72 },
    RB: { x: 72, y: 70 },
    LB: { x: 18, y: 48 },
    CM1: { x: 40, y: 50 },
    CM2: { x: 60, y: 50 },
    CAM: { x: 82, y: 48 },
    LW: { x: 18, y: 16 },
    ST: { x: 50, y: 10 },
    RW: { x: 82, y: 16 }
  },
  "352": {
    GK: { x: 50, y: 85 },
    CB1: { x: 28, y: 70 },
    CB2: { x: 50, y: 72 },
    RB: { x: 72, y: 70 },
    LB: { x: 16, y: 48 },
    CM1: { x: 36, y: 50 },
    CAM: { x: 50, y: 42 },
    CM2: { x: 64, y: 50 },
    RW: { x: 84, y: 48 },
    LW: { x: 40, y: 16 },
    ST: { x: 60, y: 16 }
  }
};

const LEAGUE_FIXTURES = {
  1: [
    { date: "12 MAR", home: "Your Club", away: "Dockside SC", score: "2 - 0", cls: "result-win" },
    { date: "12 MAR", home: "North XI", away: "East Borough", score: "1 - 1", cls: "result-draw" },
    { date: "12 MAR", home: "Topside FC", away: "Iron Eleven", score: "3 - 1", cls: "result-win" }
  ],
  2: [
    { date: "13 MAR", home: "North XI", away: "Your Club", score: "1 - 1", cls: "result-draw" },
    { date: "13 MAR", home: "Iron Eleven", away: "Dockside SC", score: "2 - 0", cls: "result-win" },
    { date: "13 MAR", home: "Topside FC", away: "East Borough", score: "4 - 0", cls: "result-win" }
  ],
  3: [
    { date: "14 MAR", home: "Topside FC", away: "Your Club", score: "3 - 1", cls: "result-loss" },
    { date: "14 MAR", home: "North XI", away: "Dockside SC", score: "2 - 0", cls: "result-win" },
    { date: "14 MAR", home: "East Borough", away: "Iron Eleven", score: "0 - 2", cls: "result-loss" }
  ],
  4: [
    { date: "15 MAR", home: "Your Club", away: "Iron Eleven", score: "20:00", cls: "result-live" },
    { date: "15 MAR", home: "Topside FC", away: "Dockside SC", score: "20:00", cls: "result-live" },
    { date: "15 MAR", home: "North XI", away: "East Borough", score: "20:00", cls: "result-live" }
  ],
  5: [
    { date: "16 MAR", home: "Your Club", away: "East Borough", score: "20:00", cls: "result-live" },
    { date: "16 MAR", home: "Dockside SC", away: "Iron Eleven", score: "20:00", cls: "result-live" },
    { date: "16 MAR", home: "Topside FC", away: "North XI", score: "20:00", cls: "result-live" }
  ],
  6: [
    { date: "17 MAR", home: "Dockside SC", away: "Your Club", score: "20:00", cls: "result-live" },
    { date: "17 MAR", home: "North XI", away: "Iron Eleven", score: "20:00", cls: "result-live" },
    { date: "17 MAR", home: "Topside FC", away: "East Borough", score: "20:00", cls: "result-live" }
  ]
};

const state = {
  token: localStorage.getItem("cx_token") || null,
  userId: localStorage.getItem("cx_user") || null,
  revealIndex: 0,
  revealCards: [],
  revealing: false,
  inventory: [],
  squad: {},
  selectedCardId: null,
  filter: "ALL",
  style: localStorage.getItem("cx_style") || "PRESS",
  arenaMode: "BRONZE",
  walletCoins: null,
  battlepass: null,
  market: {
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
  activeMatchday: 4,
  leagueRegistered: false,
  teamValidation: null
};

function normalizeCard(raw) {
  if (!raw) return null;
  return {
    ...raw,
    id: raw.id || raw.cardId || raw.card_id || crypto.randomUUID(),
    display_name: raw.display_name || raw.displayName || raw.name || "Unknown",
    role: raw.role || raw.playerRole || raw.archetype || "Utility Role",
    position: raw.position || raw.pos || "CM",
    rarity: String(raw.rarity || "COMMON").toUpperCase()
  };
}

function normalizePosition(pos) {
  return String(pos || "").trim().toUpperCase();
}

function getFormationRoleMap(formation) {
  return FORMATION_ROLE_MAP[formation] || FORMATION_ROLE_MAP["433"];
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

    if (seenCardIds.has(slot.cardId)) {
      duplicateCards.push(slot.cardId);
    } else {
      seenCardIds.add(slot.cardId);
    }

    if (state.market.listedSet.has(slot.cardId)) {
      listedConflicts.push(slot.slotKey);
    }

    if (!slot.isNaturalFit) {
      offPositionAssignments.push(slot.slotKey);
    }
  });

  if (rolelessSlots.length) {
    warnings.push(`Missing tactical role mapping for: ${rolelessSlots.join(", ")}`);
  }

  if (offPositionAssignments.length) {
    warnings.push(`Off-position assignments: ${offPositionAssignments.join(", ")}`);
  }

  const isComplete = missingSlots.length === 0;
  const isReady =
    isComplete &&
    duplicateCards.length === 0 &&
    listedConflicts.length === 0 &&
    rolelessSlots.length === 0;

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

function exportTeamForSimulation() {
  const team = buildTeamModel();
  const validation = validateTeamModel(team);

  return {
    formation: team.formation,
    tacticMode: team.tacticMode,
    style: team.style,
    locked: team.locked,
    equippedCount: team.equippedCount,
    avgOvr: team.avgOvr,
    validation,
    slots: team.slots.map((slot) => ({
      slotKey: slot.slotKey,
      tacticalRole: slot.tacticalRole,
      allowedPositions: slot.allowedPositions,
      cardId: slot.cardId,
      cardPosition: slot.cardPosition,
      isNaturalFit: slot.isNaturalFit
    }))
  };
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

function tacticModeLabel(mode) {
  if (mode === "highpress") return "High Press";
  if (mode === "counter") return "Counter";
  if (mode === "control") return "Control";
  return "Balanced";
}

function savedTemplateLabel() {
  if (state.tacticMode === "highpress") return "Aggressive Press";
  if (state.tacticMode === "counter") return "Fast Break";
  if (state.tacticMode === "control") return "Possession Control";
  return "Balanced Press";
}

function tacticDescriptors(mode) {
  if (mode === "highpress") {
    return {
      front: "Front Foot Press",
      mid: "Ball Winning Core",
      def: "High Line Trap"
    };
  }
  if (mode === "counter") {
    return {
      front: "Direct Runs",
      mid: "Vertical Outlet",
      def: "Compact Block"
    };
  }
  if (mode === "control") {
    return {
      front: "False Width",
      mid: "Tempo Control",
      def: "Patient Build"
    };
  }
  return {
    front: "Wide Forwards",
    mid: "Progressive Build",
    def: "Medium Block"
  };
}

function rarityClass(r) {
  return r === "LEGENDARY" ? "rLegend" : r === "EPIC" ? "rEpic" : r === "RARE" ? "rRare" : "rCommon";
}

function rarityFrame(r) {
  if (r === "LEGENDARY") return "kfCard--legendary";
  if (r === "EPIC") return "kfCard--epic";
  if (r === "RARE") return "kfCard--rare";
  return "kfCard--common";
}

function rarityShort(r) {
  if (r === "LEGENDARY") return "LEG";
  if (r === "EPIC") return "EPIC";
  if (r === "RARE") return "RARE";
  return "COM";
}

function minPriceFor(r) {
  const rules = state.market.rules || DEFAULT_RULES;
  return rules.minPrice?.[String(r || "COMMON").toUpperCase()] ?? 10;
}

function safeText(node, value) {
  if (node) node.textContent = value;
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
  document.querySelectorAll("[data-view-tab]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.viewTab === view);
  });
  document.querySelectorAll(".appView").forEach((panel) => {
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

function getCardById(id) {
  return state.inventory.find((c) => c.id === id) || null;
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

function roleStyle(role) {
  const r = (role || "").toLowerCase();
  if (r.includes("press") || r.includes("ball winner") || r.includes("aggressive") || r.includes("overlap")) return "PRESS";
  if (r.includes("playmaking") || r.includes("tempo") || r.includes("ball-playing")) return "POSSESSION";
  if (r.includes("poacher") || r.includes("direct") || r.includes("ghost")) return "COUNTER";
  return "PRESS";
}

function cardVisualModel(card) {
  const seed = hashString(`${card.id}|${card.display_name}|${card.position}|${card.role}|${card.rarity}`);
  const rnd = mulberry32(seed);

  const rarityBase = {
    COMMON: 62,
    RARE: 72,
    EPIC: 82,
    LEGENDARY: 91
  }[card.rarity] ?? 62;

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
  }[card.position] || { pace: 0, pass: 0, attack: 0, defense: 0 };

  const boost = roleStyle(card.role);
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

function cardHTML(card, opts = {}) {
  const c = normalizeCard(card);
  const vm = cardVisualModel(c);
  const selected = !!opts.selected;
  const listed = !!opts.listed;
  const compact = !!opts.compact;
  const selectable = opts.selectable !== false;

  return `
    <div class="kfCard ${rarityFrame(c.rarity)} ${selected ? "is-selected" : ""} ${listed ? "is-listed" : ""} ${compact ? "is-compact" : ""}" ${selectable ? `data-card-id="${c.id}"` : ""}>
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

function seedXI() {
  const grid = el("xi");
  if (!grid) return;
  grid.innerHTML = "";

  SLOT_KEYS.forEach((slotKey) => {
    const d = document.createElement("div");
    d.className = "slot";
    d.dataset.slot = slotKey;
    d.innerHTML = `<div class="p">${slotLabel(slotKey)}</div><div class="n muted">Empty</div>`;
    d.addEventListener("click", () => onSlotClick(slotKey));
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
  });
}

function refreshSlotStates() {
  const grid = el("xi");
  if (!grid) return;
  const armed = canEquipSelected() && !state.tacticsLocked;

  [...grid.querySelectorAll(".slot")].forEach((node) => {
    const k = node.dataset.slot;
    node.classList.toggle("armed", armed);
    node.classList.toggle("equipped", !!state.squad[k]);
  });
}

function renderSquad() {
  const grid = el("xi");
  if (!grid) return;

  applyFormationLayout();

  [...grid.querySelectorAll(".slot")].forEach((node) => {
    const k = node.dataset.slot;
    const cardId = state.squad[k];

    if (!cardId) {
      node.innerHTML = `<div class="p">${slotLabel(k)}</div><div class="n muted">Empty</div>`;
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
      <div class="muted tiny">${c.position} • ${c.rarity}</div>
      <div class="muted tiny">OVR ${vm.ovr}</div>
    `;
  });

  state.teamValidation = validateTeamModel(buildTeamModel());
  refreshSlotStates();
  updateSynergy();
}

async function onSlotClick(slotKey) {
  const status = el("mk-status");

  if (state.tacticsLocked) {
    if (status) status.textContent = "Tactics are locked for the next fixture.";
    return;
  }

  if (!state.selectedCardId) {
    if (!state.squad[slotKey]) return;
    try {
      await api("/v1/squad/unequip", { method: "POST", body: JSON.stringify({ slot: slotKey }) });
      delete state.squad[slotKey];
      renderSquad();
      renderSelectedCard();
    } catch (e) {
      if (status) status.textContent = e.message;
    }
    return;
  }

  if (state.market.listedSet.has(state.selectedCardId)) {
    if (status) status.textContent = "This card is listed on the market. Cancel listing first.";
    return;
  }

  const cardId = state.selectedCardId;

  try {
    await api("/v1/squad/equip", { method: "POST", body: JSON.stringify({ slot: slotKey, cardId }) });

    for (const k of Object.keys(state.squad)) {
      if (state.squad[k] === cardId) delete state.squad[k];
    }
    state.squad[slotKey] = cardId;

    state.selectedCardId = null;
    renderSelectedCard();
    renderInventory();
    renderSquad();
    renderMarketSelected();
  } catch (e) {
    if (status) status.textContent = e.message;
  }
}

function renderInventory() {
  const list = el("invList");
  if (!list) return;

  const items = state.inventory.filter((c) => (state.filter === "ALL" ? true : c.rarity === state.filter));

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
        selectable: true
      })).join("")}
    </div>
  `;

  list.querySelectorAll("[data-card-id]").forEach((node) => {
    node.addEventListener("click", () => {
      if (state.tacticsLocked) return;
      const id = node.getAttribute("data-card-id");
      state.selectedCardId = state.selectedCardId === id ? null : id;
      renderSelectedCard();
      renderInventory();
      refreshSlotStates();
      renderMarketSelected();

      if (state.selectedCardId) {
        setActiveView("squad");
        pulseSelectedPanel();
        scrollToAppShell();
      }
    });
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
          : "Choose a card in Collection. Then click a pitch slot to place that player."}
      </div>
    `;
    return;
  }

  const vm = cardVisualModel(c);
  const isListed = state.market.listedSet.has(c.id);
  const inSquad = Object.values(state.squad).includes(c.id);

  box.innerHTML = `
    <div class="kfSelected">
      <div class="kfSelected__cardWrap">
        ${cardHTML(c, { selected: true, listed: isListed, compact: true, selectable: false })}
      </div>

      <div class="kfSelected__panel">
        <div class="muted tiny">Selected Player</div>
        <div class="kfSelected__name">${c.display_name}</div>
        <div class="kfSelected__meta">${c.position} • ${c.role} • ${c.rarity}</div>

        <div class="kfSelected__ovr">OVR ${vm.ovr}</div>

        <div class="kfSelected__stats">
          <div><span>Pace</span><strong>${vm.pace}</strong></div>
          <div><span>Pass</span><strong>${vm.pass}</strong></div>
          <div><span>Attack</span><strong>${vm.attack}</strong></div>
          <div><span>Defense</span><strong>${vm.defense}</strong></div>
        </div>

        <div class="muted tiny" style="margin-top:10px">
          ${state.tacticsLocked
            ? "TACTICS LOCKED — changes are blocked until the next fixture window opens."
            : isListed
              ? "LISTED — cancel the market listing before using this card in your squad."
              : inSquad
                ? "Already equipped in your XI. Click another slot to move this player."
                : "Ready to equip — click any armed pitch slot now."}
        </div>
      </div>
    </div>
  `;
}

function updateSynergy() {
  const pct = el("chemPct");
  const fill = el("chemFill");
  const note = el("chemNote");

  const equippedIds = Object.values(state.squad).filter(Boolean);
  const equipped = equippedIds.map(getCardById).filter(Boolean);

  if (!equipped.length) {
    safeText(pct, "0%");
    if (fill) fill.style.width = "0%";
    safeText(note, "Equip players to build synergy.");
    return;
  }

  const styleMatches = equipped.filter((c) => roleStyle(c.role) === state.style).length;
  const modeBonus = state.tacticMode === "highpress" || state.tacticMode === "counter" ? 6 : state.tacticMode === "control" ? 4 : 3;
  const raw = Math.round((styleMatches / equipped.length) * 100);
  const p = Math.min(100, raw + modeBonus);
  const avgOvr = Math.round(equipped.reduce((a, c) => a + cardVisualModel(c).ovr, 0) / equipped.length);

  safeText(pct, `${p}%`);
  if (fill) fill.style.width = `${p}%`;
  safeText(note, `Style: ${state.style} • mode: ${tacticModeLabel(state.tacticMode)} • fit ${styleMatches}/${equipped.length} • avg OVR ${avgOvr}`);
}

function renderPackResults(cards) {
  const wrap = el("cards");
  if (!wrap) return;
  const normalized = (cards || []).map(normalizeCard).filter(Boolean);
  wrap.innerHTML = normalized.length
    ? `<div class="kfPackGrid">${normalized.map((c) => cardHTML(c, { compact: true, selectable: false })).join("")}</div>`
    : "";
}

function getNextLeagueKickoff(now = new Date()) {
  const kickoff = new Date(now);
  kickoff.setUTCHours(20, 0, 0, 0);
  if (now >= kickoff) kickoff.setUTCDate(kickoff.getUTCDate() + 1);
  return kickoff;
}

function getNextLockTime(now = new Date()) {
  return new Date(getNextLeagueKickoff(now).getTime() - 3600000);
}

function formatTwo(n) {
  return String(n).padStart(2, "0");
}

function syncCountdownSet(prefix, targetDate) {
  const now = new Date();
  const diff = Math.max(0, targetDate.getTime() - now.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  safeText(el(`${prefix}-days`), formatTwo(days));
  safeText(el(`${prefix}-hours`), formatTwo(hours));
  safeText(el(`${prefix}-mins`), formatTwo(mins));
}

function currentLeagueContext() {
  const fixtures = LEAGUE_FIXTURES[state.activeMatchday] || [];
  const next = fixtures.find((f) => f.home === "Your Club" || f.away === "Your Club") || fixtures[0] || null;
  return next;
}

function renderHomeCountdown() {
  const nextKickoff = getNextLeagueKickoff(new Date());
  const lockTime = getNextLockTime(new Date());
  syncCountdownSet("cd", nextKickoff);
  syncCountdownSet("league-cd", nextKickoff);

  const sub = `Next kickoff ${nextKickoff.toUTCString().replace("GMT", "UTC")} • lock ${formatTwo(lockTime.getUTCHours())}:00 UTC`;
  safeText(el("home-match-sub"), sub);
  safeText(el("league-next-kickoff"), sub);

  const ctx = currentLeagueContext();
  if (ctx) {
    const opponent = ctx.home === "Your Club" ? ctx.away : ctx.home;
    safeText(el("home-match-title"), opponent);
    safeText(el("league-next-opponent"), `${ctx.home} vs ${ctx.away}`);
  }
}

function startHomeCountdown() {
  if (state.countdownTimer) clearInterval(state.countdownTimer);
  renderHomeCountdown();
  state.countdownTimer = setInterval(() => {
    renderHomeCountdown();
    renderTacticsShell();
    renderLeagueShell();
  }, 1000);
}

function renderTacticsShell() {
  const now = new Date();
  const lockTime = getNextLockTime(now);
  state.tacticsLocked = now >= lockTime && now < getNextLeagueKickoff(now);

  document.querySelectorAll("[data-formation]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.formation === state.formation);
  });

  document.querySelectorAll("[data-tactic-mode]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.tacticMode === state.tacticMode);
  });

  const cards = document.querySelectorAll(".tacticsTopStrip .tacticsTopCard");
  safeText(cards[0]?.querySelector(".sectionTitle"), formatFormationLabel(state.formation));
  safeText(cards[1]?.querySelector(".sectionTitle"), savedTemplateLabel());
  safeText(cards[2]?.querySelector(".sectionTitle"), state.tacticsLocked ? "Locked" : "Open");
  safeText(cards[2]?.querySelector(".muted.tiny:last-child"), state.tacticsLocked ? "Current window locked until next daily cycle." : "Tactics lock 1 hour before kickoff.");

  const desc = tacticDescriptors(state.tacticMode);
  safeText(el("tactic-front-shape"), desc.front);
  safeText(el("tactic-mid-core"), desc.mid);
  safeText(el("tactic-def-line"), desc.def);

  [el("btn-lock-tactics"), el("btn-lock-tactics-side")].forEach((btn) => {
    if (!btn) return;
    btn.textContent = state.tacticsLocked ? "Locked" : "Lock Tactics";
    btn.disabled = state.tacticsLocked;
  });

  state.teamValidation = validateTeamModel(buildTeamModel());
  applyFormationLayout();
  refreshSlotStates();
  renderSelectedCard();
  updateSynergy();
}

function renderLeagueFixtures() {
  const wrap = el("leagueFixtures");
  if (!wrap) return;
  const rows = LEAGUE_FIXTURES[state.activeMatchday] || [];
  wrap.innerHTML = rows.map((f) => `
    <div class="fixtureRow ${f.cls}">
      <div class="fixtureDate">${f.date}</div>
      <div class="fixtureTeams">${f.home} vs ${f.away}</div>
      <div class="fixtureScore">${f.score}</div>
    </div>
  `).join("");
}

function renderLeagueShell() {
  const nextKickoff = getNextLeagueKickoff(new Date());
  const lockTime = getNextLockTime(new Date());
  const tier = state.isPro ? "PRO" : "OPEN";
  const tierName = state.isPro ? "Pro Division" : "Open Division";
  const tierCopy = state.isPro
    ? "Battle Pass access active • compete for Elite qualification and Champions Cup path."
    : "Free ladder access • top performance pushes toward Pro and Elite competition.";

  safeText(el("league-tier-badge"), tier);
  safeText(el("league-status-badge"), state.tacticsLocked ? "LOCK WINDOW" : "SEASON LIVE");
  safeText(el("league-tier-name"), tierName);
  safeText(el("league-tier-copy"), tierCopy);
  safeText(el("league-lock-status"), state.tacticsLocked ? "Locked" : "Open");
  safeText(el("league-lock-clock"), state.tacticsLocked ? `Locked until ${nextKickoff.toUTCString().replace("GMT", "UTC")}` : `Open now • lock at ${formatTwo(lockTime.getUTCHours())}:00 UTC`);

  document.querySelectorAll("[data-md]").forEach((btn) => {
    btn.classList.toggle("is-active", Number(btn.dataset.md) === state.activeMatchday);
  });

  const ctx = currentLeagueContext();
  if (ctx) {
    safeText(el("league-next-opponent"), `${ctx.home} vs ${ctx.away}`);
  }

  const registerPanel = el("leagueRegisterEmpty");
  const registerBtn = el("btn-register-league");
  if (registerPanel && registerBtn) {
    if (state.leagueRegistered) {
      registerPanel.querySelector(".muted.tiny")?.replaceChildren(document.createTextNode("League Registration"));
      registerPanel.querySelector(".sectionTitle")?.replaceChildren(document.createTextNode("Registered For Season 4"));
      const texts = registerPanel.querySelectorAll(".muted.tiny");
      if (texts[1]) texts[1].textContent = "Your club is queued for the next season draw.";
      registerBtn.textContent = "Registered";
      registerBtn.disabled = true;
    } else {
      registerBtn.textContent = "Register Now";
      registerBtn.disabled = false;
    }
  }

  renderLeagueFixtures();
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

function setOverlaySub(t) {
  safeText(el("overlaySub"), t);
}

function resetRevealUI() {
  state.revealIndex = 0;
  state.revealCards = [];
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

  if (card?.rarity === "LEGENDARY") {
    legendaryBurst();
    setOverlaySub("Legendary pull.");
  } else if (card?.rarity === "EPIC") {
    setOverlaySub("Epic pull.");
  } else if (card?.rarity === "RARE") {
    setOverlaySub("Rare pull.");
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

async function openPack() {
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
    await loadDaily();
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
    [btn, homeBtn].forEach((b) => {
      if (b) {
        b.disabled = false;
        b.textContent = "Play Arena";
      }
    });
  }
}

function attachDailyClaimHandlers(rootSelector, attrName) {
  document.querySelectorAll(`${rootSelector} [${attrName}]`).forEach((btn) => {
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
    if (d.chest?.opened) {
      chestStatus.textContent = d.chest.duplicate
        ? "Chest opened — duplicate converted into coins."
        : "Chest opened — new cosmetic unlocked.";
    } else if (d.chest?.available) {
      chestStatus.textContent = "All challenges complete. Open your daily chest.";
    } else {
      chestStatus.textContent = "Complete + claim all 3 to unlock.";
    }
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

  document.querySelectorAll("[data-equip]").forEach((btn) => {
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
  const status = el("mk-status");

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
  if (isListed && status) status.textContent = "Selected card is listed. Cancel the listing to use it.";
}

function listingHTML(x, isMine = false) {
  const right = isMine
    ? `<button class="smallBtn danger" data-cancel="${x.listing_id}">Cancel</button>`
    : `<button class="smallBtn primary" data-buy="${x.listing_id}">Buy</button>`;

  return `
    <div class="listing">
      <div>
        <div style="font-weight:900">${x.display_name || "Unknown"}</div>
        <div class="listingMeta">${x.position} • ${x.role} • ${x.rarity}</div>
      </div>
      <div class="listingRight">
        <div class="priceTag">${x.price}c</div>
        ${right}
      </div>
    </div>
  `;
}

function formatAgo(ts) {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

function renderHomeMovers() {
  const wrap = el("moversHome");
  if (!wrap) return;

  const trades = state.market.trades || [];
  if (!trades.length) {
    wrap.innerHTML = `
      <div class="moverRow"><div class="moverDot rare"></div><div class="moverName">M. Velenz</div><div class="moverPct up">+12%</div></div>
      <div class="moverRow"><div class="moverDot epic"></div><div class="moverName">R. Ibarra</div><div class="moverPct up">+8%</div></div>
      <div class="moverRow"><div class="moverDot common"></div><div class="moverName">D. Kanez</div><div class="moverPct down">-5%</div></div>
    `;
    return;
  }

  const top = trades.slice(0, 3);
  wrap.innerHTML = top.map((x, i) => {
    const change = i === 2 ? -5 : 6 + ((x.price || 0) % 9);
    const cls = change >= 0 ? "up" : "down";
    const sign = change >= 0 ? "+" : "";
    const dotClass = String(x.rarity || "COMMON").toLowerCase() === "rare"
      ? "rare"
      : String(x.rarity || "COMMON").toLowerCase() === "epic"
        ? "epic"
        : String(x.rarity || "COMMON").toLowerCase() === "legendary"
          ? "legendary"
          : "common";

    return `
      <div class="moverRow">
        <div class="moverDot ${dotClass}"></div>
        <div class="moverName">${shortName(x.display_name)}</div>
        <div class="moverPct ${cls}">${sign}${change}%</div>
      </div>
    `;
  }).join("");
}

async function loadMarket() {
  const [rules, pulse, open, mine, trades] = await Promise.all([
    api("/v1/market/rules", { method: "GET" }).catch(() => DEFAULT_RULES),
    api("/v1/market/pulse?limit=60", { method: "GET" }),
    api("/v1/market/listings?limit=60", { method: "GET" }),
    api("/v1/market/my", { method: "GET" }),
    api("/v1/market/trades?limit=20", { method: "GET" }).catch(() => ({ trades: [] }))
  ]);

  state.market.rules = rules || DEFAULT_RULES;
  state.market.pulse = pulse || { last: null, chg24h: null, points: [] };
  state.market.trades = trades.trades || [];

  const allOpen = open.listings || [];
  state.market.listings = allOpen.filter((x) => x.seller_user_id !== state.userId);

  state.market.mine = mine.listings || [];
  const openMine = state.market.mine.filter((x) => x.status === "OPEN");
  state.market.listedSet = new Set(openMine.map((x) => x.card_id));

  safeText(el("myCount"), `(${openMine.length}/${state.market.rules.maxOpenListings})`);

  renderPulse();
  renderListings();
  renderTrades();
  renderHomeMovers();
  renderInventory();
  renderSelectedCard();
  refreshSlotStates();
  renderMarketSelected();
}

function renderListings() {
  const openWrap = el("openListings");
  const myWrap = el("myListings");

  if (openWrap) {
    openWrap.innerHTML = state.market.listings.length
      ? state.market.listings.map((x) => listingHTML(x, false)).join("")
      : `<div class="muted tiny">No open listings.</div>`;
  }

  const openMine = state.market.mine.filter((x) => x.status === "OPEN");
  if (myWrap) {
    myWrap.innerHTML = openMine.length
      ? openMine.map((x) => listingHTML(x, true)).join("")
      : `<div class="muted tiny">No active listings.</div>`;
  }

  document.querySelectorAll("[data-buy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const status = el("mk-status");
      const id = btn.getAttribute("data-buy");
      btn.disabled = true;
      try {
        const res = await api("/v1/market/buy", { method: "POST", body: JSON.stringify({ listingId: id }) });
        setCoins(res.coins);
        await loadInventory();
        await loadMarket();
        await loadDaily();
        if (status) status.textContent = `Purchase complete. Paid ${res.paid} coins.`;
      } catch (e) {
        if (status) status.textContent = e.message;
      } finally {
        btn.disabled = false;
      }
    });
  });

  document.querySelectorAll("[data-cancel]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const status = el("mk-status");
      const id = btn.getAttribute("data-cancel");
      btn.disabled = true;
      try {
        await api("/v1/market/cancel", { method: "POST", body: JSON.stringify({ listingId: id }) });
        await loadMarket();
        if (status) status.textContent = "Listing cancelled.";
      } catch (e) {
        if (status) status.textContent = e.message;
      } finally {
        btn.disabled = false;
      }
    });
  });
}

function renderTrades() {
  const wrap = el("tradeList");
  if (!wrap) return;

  const t = state.market.trades || [];
  wrap.innerHTML = t.length ? t.map((x) => `
    <div class="tradeRow">
      <div>
        <div style="font-weight:900">${x.display_name}</div>
        <div class="tradeMeta">${x.position} • ${x.role} • ${x.rarity} • ${formatAgo(x.created_at)}</div>
      </div>
      <div class="priceTag">${x.price}c</div>
    </div>
  `).join("") : `<div class="muted tiny">No trades yet.</div>`;
}

async function listSelected() {
  const status = el("mk-status");
  const price = Number(el("mk-price")?.value || 0);

  if (!state.selectedCardId) {
    if (status) status.textContent = "Select a card first.";
    return;
  }

  const c = getCardById(state.selectedCardId);
  const minP = minPriceFor(c?.rarity);

  if (!Number.isFinite(price) || price < minP) {
    if (status) status.textContent = `Min price for ${c?.rarity} is ${minP}.`;
    return;
  }

  const btn = el("btn-list");
  if (btn) btn.disabled = true;

  try {
    await api("/v1/market/list", { method: "POST", body: JSON.stringify({ cardId: state.selectedCardId, price }) });
    if (status) status.textContent = "Listed successfully.";
    if (el("mk-price")) el("mk-price").value = "";
    await loadMarket();
    await loadDaily();
  } catch (e) {
    if (status) status.textContent = e.message;
  } finally {
    if (btn) btn.disabled = false;
  }
}

function renderOnePulse(svgId, lastId, chgId) {
  safeText(el(lastId), state.market.pulse.last == null ? "—" : String(state.market.pulse.last));
  safeText(el(chgId), state.market.pulse.chg24h == null ? "—" : (state.market.pulse.chg24h > 0 ? `+${state.market.pulse.chg24h}` : `${state.market.pulse.chg24h}`));

  const pts = state.market.pulse.points || [];
  const svg = el(svgId);
  if (!svg) return;

  const w = 300;
  const h = 64;

  if (!pts.length) {
    svg.innerHTML = `<path d="M0 ${h - 8} L${w} ${h - 8}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="2"/>`;
    return;
  }

  const prices = pts.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const span = Math.max(1, max - min);
  const yOf = (price) => (h - 10) - ((price - min) / span) * (h - 18);

  if (pts.length === 1) {
    const y = yOf(pts[0].price);
    svg.innerHTML = `
      <path d="M0 ${y.toFixed(2)} L${w} ${y.toFixed(2)}" fill="none" stroke="rgba(232,184,75,.85)" stroke-width="2.2" />
      <path d="M0 ${y.toFixed(2)} L${w} ${y.toFixed(2)} L${w} ${h} L0 ${h} Z" fill="rgba(232,184,75,.10)" />
      <circle cx="${w - 8}" cy="${y.toFixed(2)}" r="3.4" fill="rgba(0,230,118,.90)" />
    `;
    return;
  }

  const step = w / (pts.length - 1);
  const d = pts.map((p, i) => {
    const x = i * step;
    const y = yOf(p.price);
    return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");

  svg.innerHTML = `
    <path d="${d}" fill="none" stroke="rgba(232,184,75,.90)" stroke-width="2.2" />
    <path d="${d} L${w} ${h} L0 ${h} Z" fill="rgba(232,184,75,.10)" />
  `;
}

function renderPulse() {
  renderOnePulse("sparkSvg", "m-last", "m-chg");
  renderOnePulse("sparkSvgHome", "m-last-home", "m-chg-home");
}

async function loadInventory() {
  const data = await api("/v1/inventory", { method: "GET" });
  state.inventory = (data.cards || []).map(normalizeCard).filter(Boolean);
  renderInventory();
  renderSelectedCard();
  renderSquad();
  renderMarketSelected();
}

async function loadSquad() {
  const data = await api("/v1/squad", { method: "GET" });
  state.squad = data.slots || {};
  renderSquad();
}

function initChips() {
  document.querySelectorAll("[data-filter]").forEach((b) => {
    b.addEventListener("click", () => {
      state.filter = b.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      renderInventory();
    });
  });

  document.querySelectorAll("[data-style]").forEach((b) => {
    if (b.dataset.style === state.style) b.classList.add("active");
    b.addEventListener("click", () => {
      state.style = b.dataset.style;
      localStorage.setItem("cx_style", state.style);
      document.querySelectorAll("[data-style]").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      updateSynergy();
    });
  });

  document.querySelectorAll("[data-arena]").forEach((b) => {
    if (b.dataset.arena === state.arenaMode) b.classList.add("active");
    b.addEventListener("click", () => {
      state.arenaMode = b.dataset.arena;
      document.querySelectorAll("[data-arena]").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      safeText(el("arena-mode"), state.arenaMode);
    });
  });

  document.querySelectorAll("[data-formation]").forEach((b) => {
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

  document.querySelectorAll("[data-tactic-mode]").forEach((b) => {
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

  document.querySelectorAll("[data-md]").forEach((b) => {
    b.addEventListener("click", () => {
      state.activeMatchday = Number(b.dataset.md) || 1;
      renderLeagueShell();
      renderHomeCountdown();
    });
  });
}

function initViewTabs() {
  document.querySelectorAll("[data-view-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setActiveView(btn.dataset.viewTab);
    });
  });

  document.querySelectorAll("[data-view-tab-jump]").forEach((btn) => {
    btn.addEventListener("click", () => {
      jumpToView(btn.dataset.viewTabJump);
    });
  });
}

function handleLockTactics() {
  jumpToView("squad");
  renderTacticsShell();
  if (!state.tacticsLocked) {
    const cards = document.querySelectorAll(".tacticsTopStrip .tacticsTopCard");
    safeText(cards[2]?.querySelector(".sectionTitle"), "Ready");
    safeText(cards[2]?.querySelector(".muted.tiny:last-child"), `Formation ${formatFormationLabel(state.formation)} • ${savedTemplateLabel()} saved for next lock window.`);
  }
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
    renderTacticsShell();
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
  seedXI();
  setUserLabel();
  initChips();
  initViewTabs();
  setActiveView("home");
  safeText(el("arena-mode"), state.arenaMode);
  renderMarketSelected();
  renderHomeCountdown();
  renderTacticsShell();
  renderLeagueShell();
  healthCheck();

  el("btn-play")?.addEventListener("click", enterKickForge);
  el("btn-pack")?.addEventListener("click", openPack);
  el("btn-home-pack")?.addEventListener("click", openPack);

  el("btn-arena")?.addEventListener("click", playArena);
  el("btn-home-arena")?.addEventListener("click", async () => {
    jumpToView("squad");
    await playArena();
  });

  el("btn-lock-tactics")?.addEventListener("click", handleLockTactics);
  el("btn-lock-tactics-side")?.addEventListener("click", handleLockTactics);
  el("btn-league-lock")?.addEventListener("click", handleLockTactics);

  el("btn-register-league")?.addEventListener("click", () => {
    state.leagueRegistered = true;
    renderLeagueShell();
  });

  el("btn-list")?.addEventListener("click", listSelected);

  el("btn-refresh-market")?.addEventListener("click", async () => {
    const status = el("mk-status");
    if (status) status.textContent = "Refreshing market…";
    try {
      await loadMarket();
      if (status) status.textContent = "Market refreshed.";
    } catch (e) {
      if (status) status.textContent = e.message;
    }
  });

  el("btn-close")?.addEventListener("click", () => hideOverlay());
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
      renderTacticsShell();
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
    exportTeamForSimulation
  };
})();
