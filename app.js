// CLASH XI — Step 3 Pack Reveal
const API_BASE = "https://clash-xi-api.lowkeyy9191.workers.dev";

const el = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const state = {
  token: localStorage.getItem("cx_token") || null,
  userId: localStorage.getItem("cx_user") || null,
  revealIndex: 0,
  revealCards: [],
  revealing: false,
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

function seedXI() {
  const grid = el("xi");
  if (!grid) return;
  grid.innerHTML = "";
  const slots = ["GK","LB","CB","CB","RB","CM","CM","CAM","LW","ST","RW"];
  slots.forEach((p) => {
    const d = document.createElement("div");
    d.className = "slot";
    d.innerHTML = `<div class="p">${p}</div><div class="n muted">Empty</div>`;
    grid.appendChild(d);
  });
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

/* ---------- Pack Results list (below) ---------- */
function rarityClass(r) {
  return r === "LEGENDARY" ? "rLegend" : r === "EPIC" ? "rEpic" : r === "RARE" ? "rRare" : "rCommon";
}

function renderCards(cards) {
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

/* ---------- Reveal Overlay ---------- */
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
    const front = node.querySelector(".flipFront");
    const badge = node.querySelector(".badge");
    const name = node.querySelector(".cardName");
    const meta = node.querySelector(".cardMeta");

    node.classList.remove("rCommon","rRare","rEpic","rLegend");
    node.classList.add(rarityClass(c.rarity));

    if (badge) badge.textContent = c.rarity;
    if (name) name.textContent = c.displayName;
    if (meta) meta.textContent = `${c.position} • ${c.role}`;

    if (front) {
      front.style.borderColor =
        c.rarity === "LEGENDARY" ? "rgba(168,255,46,.28)" :
        c.rarity === "EPIC" ? "rgba(200,120,255,.28)" :
        c.rarity === "RARE" ? "rgba(46,245,255,.28)" :
        "rgba(255,255,255,.10)";
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

/* ---------- Main pack open ---------- */
async function openPack() {
  const btn = el("btn-pack");
  if (btn) { btn.disabled = true; btn.textContent = "Opening…"; }

  showOverlay();
  resetRevealUI();
  setOverlaySub("Connecting…");

  try {
    await ensureSession();

    setOverlaySub("Generating cards…");
    const data = await api("/v1/packs/open", {
      method: "POST",
      body: JSON.stringify({ kind: "DAILY" }),
    });

    state.revealCards = data.cards || [];
    injectRevealData(state.revealCards);

    setOverlaySub("Tap to reveal");
    const claim = el("btn-claim");
    if (claim) claim.disabled = true;

    renderCards(state.revealCards);

  } catch (e) {
    hideOverlay();
    alert(e.message);
  } finally {
    if (btn) { btn.textContent = "Open Pack"; btn.disabled = false; }
  }
}

/* ---------- Boot ---------- */
(async function boot() {
  seedXI();
  setUserLabel();

  const ok = await healthCheck();
  const playBtn = el("btn-play");
  const packBtn = el("btn-pack");

  if (playBtn) {
    playBtn.addEventListener("click", async () => {
      const ok2 = await healthCheck();
      if (!ok2) return alert("API offline. Check your Worker.");
      await ensureSession();
      if (packBtn) packBtn.disabled = false;
    });
  }

  if (packBtn) {
    packBtn.addEventListener("click", openPack);
  }

  const closeBtn = el("btn-close");
  const claimBtn = el("btn-claim");
  const pack = el("revealPack");

  if (closeBtn) closeBtn.addEventListener("click", () => hideOverlay());
  if (claimBtn) claimBtn.addEventListener("click", () => hideOverlay());

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

  const list = el("revealCards");
  if (list) list.addEventListener("click", revealAction);

  setConn(ok);
})();
