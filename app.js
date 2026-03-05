// CLASH XI — Step 5 (Arena + Battle Pass) on top of Step 4 (Locker + Equip) + Step 3 (Pack Reveal)
const API_BASE = "https://clash-xi-api.lowkeyy9191.workers.dev";

const el = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Unique slot keys (supports duplicates)
const SLOT_KEYS = ["GK","LB","CB1","CB2","RB","CM1","CM2","CAM","LW","ST","RW"];
const slotLabel = (k) => k.replace("1","").replace("2",""); // CB1->CB, CM2->CM

const state = {
  token: localStorage.getItem("cx_token") || null,
  userId: localStorage.getItem("cx_user") || null,

  // Step 3 reveal
  revealIndex: 0,
  revealCards: [],
  revealing: false,

  // Step 4 locker/squad
  inventory: [],
  squad: {},           // slotKey -> cardId
  selectedCardId: null,
  filter: "ALL",
  style: localStorage.getItem("cx_style") || "PRESS",

  // Step 5 arena/pass
  arenaMode: "BRONZE",
  me: null,
};

function setConn(ok) {
  const n = el("pill-conn");
  if (n) n.textContent = ok ? "API: Connected" : "API: Offline";
}
function setUserLabel() {
  const n = el("pill-user");
  if (!n) return;
  n.textContent = state.userId ? `User: ${state.userId.slice(0, 8)}` : "Guest";
}
function setCoins(coins) {
  const n = el("pill-coins");
  if (n) n.textContent = `Coins: ${coins ?? "—"}`;
}

function rarityClass(r) {
  return r === "LEGENDARY" ? "rLegend" : r === "EPIC" ? "rEpic" : r === "RARE" ? "rRare" : "rCommon";
}

async function api(path, opts = {}) {
  const headers = opts.headers || {};
  if (state.token) headers["Authorization"] = `Bearer ${state.token}`;
  headers["Content-Type"] = "application/json";
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  const txt = await res.text();
  let json = null;
  try { json = JSON.parse(txt); } catch {}
  if (!res.ok) throw new Error(json?.error || txt || "API error");
  return json;
}

async function healthCheck() {
  try { await api("/health", { method: "GET" }); setConn(true); return true; }
  catch { setConn(false); return false; }
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

/* =========================
   XI (SQUAD)
   ========================= */
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

  refreshSlotStates();
}

function refreshSlotStates() {
  const grid = el("xi");
  if (!grid) return;
  [...grid.querySelectorAll(".slot")].forEach((node) => {
    const slotKey = node.dataset.slot;
    node.classList.toggle("armed", !!state.selectedCardId);
    node.classList.toggle("equipped", !!state.squad[slotKey]);
  });
}

function getCardById(id) {
  return state.inventory.find((c) => c.id === id) || null;
}

function renderSquad() {
  const grid = el("xi");
  if (!grid) return;

  [...grid.querySelectorAll(".slot")].forEach((node) => {
    const slotKey = node.dataset.slot;
    const cardId = state.squad[slotKey];

    if (!cardId) {
      node.innerHTML = `<div class="p">${slotLabel(slotKey)}</div><div class="n muted">Empty</div>`;
      return;
    }

    const c = getCardById(cardId);
    if (!c) {
      node.innerHTML = `<div class="p">${slotLabel(slotKey)}</div><div class="n muted">Equipped</div>`;
      return;
    }

    node.innerHTML = `
      <div class="p">${slotLabel(slotKey)}</div>
      <div class="n">${c.display_name}</div>
      <div class="muted tiny">${c.position} • ${c.role} • ${c.rarity}</div>
    `;
  });

  refreshSlotStates();
  updateSynergy();
}

async function onSlotClick(slotKey) {
  // If nothing selected: click equipped slot => unequip
  if (!state.selectedCardId) {
    if (!state.squad[slotKey]) return;
    await api("/v1/squad/unequip", { method: "POST", body: JSON.stringify({ slot: slotKey }) });
    delete state.squad[slotKey];
    renderSquad();
    return;
  }

  // Equip selected card to clicked slot
  const cardId = state.selectedCardId;
  await api("/v1/squad/equip", { method: "POST", body: JSON.stringify({ slot: slotKey, cardId }) });

  // Ensure a card can only be equipped once locally
  for (const k of Object.keys(state.squad)) {
    if (state.squad[k] === cardId) delete state.squad[k];
  }
  state.squad[slotKey] = cardId;

  state.selectedCardId = null;
  renderSelectedCard();
  renderInventory();
  renderSquad();
}

/* =========================
   LOCKER
   ========================= */
function renderInventory() {
  const list = el("invList");
  if (!list) return;

  const items = state.inventory.filter((c) => (state.filter === "ALL" ? true : c.rarity === state.filter));

  list.innerHTML = "";
  if (!items.length) {
    list.innerHTML = `<div class="muted tiny">No cards yet. Open a pack.</div>`;
    return;
  }

  items.forEach((c) => {
    const row = document.createElement("div");
    row.className = "invItem";
    if (state.selectedCardId === c.id) row.classList.add("selected");

    row.addEventListener("click", () => {
      state.selectedCardId = (state.selectedCardId === c.id) ? null : c.id;
      renderSelectedCard();
      renderInventory();
      refreshSlotStates();
    });

    row.innerHTML = `
      <div>
        <div class="invName">${c.display_name}</div>
        <div class="invMeta">${c.position} • ${c.role}</div>
      </div>
      <div class="rarity ${rarityClass(c.rarity)}">${c.rarity}</div>
    `;
    list.appendChild(row);
  });
}

function renderSelectedCard() {
  const box = el("selectedCard");
  if (!box) return;

  const c = state.selectedCardId ? getCardById(state.selectedCardId) : null;

  if (!c) {
    box.innerHTML = `
      <div class="muted tiny">Selected</div>
      <div style="font-weight:900; margin-top:6px">None</div>
      <div class="muted tiny" style="margin-top:6px">Pick a card to arm slots.</div>
    `;
    return;
  }

  box.innerHTML = `
    <div class="muted tiny">Selected</div>
    <div style="font-weight:900; margin-top:6px">${c.display_name}</div>
    <div class="muted tiny" style="margin-top:6px">${c.position} • ${c.role}</div>
    <div class="muted tiny" style="margin-top:6px">Tap a slot to equip.</div>
    <div style="margin-top:10px" class="rarity ${rarityClass(c.rarity)}">${c.rarity}</div>
  `;
}

/* =========================
   SYNERGY
   ========================= */
function roleStyle(role) {
  const r = (role || "").toLowerCase();
  if (r.includes("press") || r.includes("ball winner") || r.includes("aggressive") || r.includes("overlap")) return "PRESS";
  if (r.includes("playmaking") || r.includes("tempo") || r.includes("ball-playing")) return "POSSESSION";
  if (r.includes("poacher") || r.includes("direct") || r.includes("ghost")) return "COUNTER";
  return "PRESS";
}

function updateSynergy() {
  const pct = el("chemPct");
  const fill = el("chemFill");
  const note = el("chemNote");

  const equippedIds = Object.values(state.squad).filter(Boolean);
  const equipped = equippedIds.map(getCardById).filter(Boolean);

  if (!equipped.length) {
    if (pct) pct.textContent = "0%";
    if (fill) fill.style.width = "0%";
    if (note) note.textContent = "Equip players to build synergy.";
    return;
  }

  const matches = equipped.filter((c) => roleStyle(c.role) === state.style).length;
  const p = Math.round((matches / equipped.length) * 100);

  if (pct) pct.textContent = `${p}%`;
  if (fill) fill.style.width = `${p}%`;
  if (note) note.textContent = `Style: ${state.style} • Matching roles: ${matches}/${equipped.length}`;
}

/* =========================
   PACK RESULTS PANEL
   ========================= */
function renderPackResults(cards) {
  const wrap = el("cards");
  if (!wrap) return;
  wrap.innerHTML = "";
  cards.forEach((c) => {
    const row = document.createElement("div");
    row.className = "cardRow";
    row.innerHTML = `
      <div>
        <div style="font-weight:900">${c.displayName}</div>
        <div class="muted tiny">${c.position} • ${c.role}</div>
      </div>
      <div class="rarity ${rarityClass(c.rarity)}">${c.rarity}</div>
    `;
    wrap.appendChild(row);
  });
}

/* =========================
   REVEAL OVERLAY (Step 3)
   ========================= */
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
function setOverlaySub(text) {
  const n = el("overlaySub");
  if (n) n.textContent = text;
}

function resetRevealUI() {
  state.revealIndex = 0;
  state.revealCards = [];
  state.revealing = false;

  const inner = el("overlayInner");
  if (inner) inner.classList.remove("legendaryBurst");

  const claim = el("btn-claim");
  if (claim) { claim.disabled = true; claim.textContent = "Claim"; }

  const hint = el("revealHint");
  if (hint) hint.textContent = "Tap to reveal";

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
          <div class="cardFooter">
            <span class="muted">CLASH XI</span>
            <span class="muted">v1</span>
          </div>
        </div>
      </div>
    `;
    list.appendChild(card);
  }
}

function injectRevealData(cards) {
  const list = el("revealCards");
  if (!list) return;

  const nodes = [...list.querySelectorAll(".flipCard")];
  nodes.forEach((node, i) => {
    const c = cards[i];
    const badge = node.querySelector(".badge");
    const name = node.querySelector(".cardName");
    const meta = node.querySelector(".cardMeta");

    node.classList.remove("rCommon","rRare","rEpic","rLegend");
    node.classList.add(rarityClass(c.rarity));

    if (badge) badge.textContent = c.rarity;
    if (name) name.textContent = c.displayName;
    if (meta) meta.textContent = `${c.position} • ${c.role}`;
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
  const card = state.revealCards[i];

  const list = el("revealCards");
  const node = list?.querySelector(`.flipCard[data-i="${i}"]`);
  if (node) node.classList.add("flipped");

  if (card?.rarity === "LEGENDARY") {
    legendaryBurst();
    setOverlaySub("SIGNATURE LEGENDARY!");
  } else if (card?.rarity === "EPIC") {
    setOverlaySub("Epic pull.");
  } else if (card?.rarity === "RARE") {
    setOverlaySub("Rare pull.");
  } else {
    setOverlaySub("Common.");
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
    const hint = el("revealHint");
    if (hint) hint.textContent = "Done";
  }
}

/* =========================
   LOAD DATA (Step 5)
   ========================= */
async function loadInventory() {
  const data = await api("/v1/inventory", { method: "GET" });
  state.inventory = data.cards || [];
  renderInventory();
  renderSelectedCard();
  renderSquad();
}

async function loadSquad() {
  const data = await api("/v1/squad", { method: "GET" });
  state.squad = data.slots || {};
  renderSquad();
}

function updateBattlePassUI(bp) {
  const bpLevel = el("bp-level");
  const bpFill  = el("bpFill");
  const bpText  = el("bpText");

  if (!bp) return;
  if (bpLevel) bpLevel.textContent = `Lv ${bp.level}`;
  if (bpFill)  bpFill.style.width = `${Math.round((bp.xp / bp.need) * 100)}%`;
  if (bpText)  bpText.textContent = `${bp.xp} / ${bp.need} XP`;
}

async function loadMe(){
  const data = await api("/v1/me", { method:"GET" });
  state.me = data;
  setCoins(data.coins);
  updateBattlePassUI(data.battlepass);
}

/* =========================
   ARENA (Step 5)
   ========================= */
async function playArena(){
  const log = el("arenaLog");
  const btn = el("btn-arena");

  if (btn) { btn.disabled = true; btn.textContent = "Playing…"; }
  if (log) log.textContent = "Match starting…";

  try{
    const res = await api("/v1/arena/play", {
      method:"POST",
      body: JSON.stringify({ mode: state.arenaMode, style: state.style })
    });

    if (log) {
      log.textContent =
        `${res.result} • Team ${res.teamRating} vs Opp ${res.oppRating} • +${res.rewards.coins} coins • +${res.rewards.bpXp} BP XP`;
    }

    setCoins(res.coins);
    updateBattlePassUI(res.battlepass);

  }catch(e){
    if (log) log.textContent = e.message;
  }finally{
    if (btn) { btn.disabled = false; btn.textContent = "Play Match"; }
  }
}

/* =========================
   PACK OPEN
   ========================= */
async function openPack() {
  const btn = el("btn-pack");
  if (btn) { btn.disabled = true; btn.textContent = "Opening…"; }

  showOverlay();
  resetRevealUI();
  setOverlaySub("Generating cards…");

  try {
    await ensureSession();
    const data = await api("/v1/packs/open", { method: "POST", body: JSON.stringify({ kind: "DAILY" }) });
    state.revealCards = data.cards || [];
    injectRevealData(state.revealCards);
    renderPackResults(state.revealCards);
  } catch (e) {
    hideOverlay();
    alert(e.message);
  } finally {
    if (btn) { btn.textContent = "Open Pack"; btn.disabled = false; }
  }
}

/* =========================
   CHIP INIT (Filter / Style / Arena)
   ========================= */
function initChips() {
  // Filter chips
  document.querySelectorAll("[data-filter]").forEach((b) => {
    b.addEventListener("click", () => {
      state.filter = b.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      renderInventory();
    });
  });

  // Style chips
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

  // Arena chips
  document.querySelectorAll("[data-arena]").forEach((b) => {
    if (b.dataset.arena === state.arenaMode) b.classList.add("active");
    b.addEventListener("click", () => {
      state.arenaMode = b.dataset.arena;
      document.querySelectorAll("[data-arena]").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      const t = el("arena-mode");
      if (t) t.textContent = state.arenaMode;
    });
  });
}

/* =========================
   BOOT
   ========================= */
(async function boot() {
  seedXI();
  setUserLabel();
  initChips();

  const ok = await healthCheck();
  setConn(ok);

  const playBtn = el("btn-play");
  const packBtn = el("btn-pack");

  if (playBtn) {
    playBtn.addEventListener("click", async () => {
      const ok2 = await healthCheck();
      if (!ok2) return alert("API offline. Check your Worker.");

      await ensureSession();
      if (packBtn) packBtn.disabled = false;

      // Load everything
      await loadInventory();
      await loadSquad();
      await loadMe();
      updateSynergy();
    });
  }

  if (packBtn) packBtn.addEventListener("click", openPack);

  // Arena button
  const arenaBtn = el("btn-arena");
  if (arenaBtn) arenaBtn.addEventListener("click", playArena);

  // Overlay controls
  const closeBtn = el("btn-close");
  const claimBtn = el("btn-claim");
  const pack = el("revealPack");
  const list = el("revealCards");

  if (closeBtn) closeBtn.addEventListener("click", () => hideOverlay());

  // Claim => refresh locker + squad + me
  if (claimBtn) claimBtn.addEventListener("click", async () => {
    hideOverlay();
    await loadInventory();
    await loadSquad();
    await loadMe();
  });

  const revealAction = async () => {
    if (!state.revealCards?.length) return;
    await flipNext();
  };

  if (pack) {
    pack.addEventListener("click", revealAction);
    pack.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") revealAction();
    });
  }
  if (list) list.addEventListener("click", revealAction);

  // set arena mode tag on load
  const t = el("arena-mode");
  if (t) t.textContent = state.arenaMode;
})();
