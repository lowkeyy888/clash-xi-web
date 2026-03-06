// CLASH XI — Step 6.5 Market Integrity + Trades + Listed badge
const API_BASE = "https://clash-xi-api.lowkeyy9191.workers.dev";

const el = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SLOT_KEYS = ["GK","LB","CB1","CB2","RB","CM1","CM2","CAM","LW","ST","RW"];
const slotLabel = (k) => k.replace("1","").replace("2","");

const DEFAULT_RULES = {
  maxOpenListings: 5,
  feeBps: 500,
  minPrice: { COMMON: 10, RARE: 25, EPIC: 60, LEGENDARY: 150 }
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

  market: {
    listings: [],
    mine: [],
    trades: [],
    pulse: { last: null, chg24h: null, points: [] },
    rules: DEFAULT_RULES,
    listedSet: new Set()
  }
};

function setConn(ok){ const n=el("pill-conn"); if(n) n.textContent = ok ? "API: Connected" : "API: Offline"; }
function setUserLabel(){ const n=el("pill-user"); if(n) n.textContent = state.userId ? `User: ${state.userId.slice(0,8)}` : "Guest"; }
function setCoins(coins){ const n=el("pill-coins"); if(n) n.textContent = `Coins: ${coins ?? "—"}`; }

function rarityClass(r){
  return r === "LEGENDARY" ? "rLegend" : r === "EPIC" ? "rEpic" : r === "RARE" ? "rRare" : "rCommon";
}

function minPriceFor(r){
  const rules = state.market.rules || DEFAULT_RULES;
  return (rules.minPrice?.[String(r||"COMMON").toUpperCase()] ?? 10);
}

async function api(path, opts={}){
  const headers = opts.headers || {};
  if(state.token) headers["Authorization"] = `Bearer ${state.token}`;
  headers["Content-Type"] = "application/json";
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  const txt = await res.text();
  let json=null; try{ json=JSON.parse(txt); }catch{}
  if(!res.ok) throw new Error(json?.error || txt || "API error");
  return json;
}

async function healthCheck(){
  try{ await api("/health",{method:"GET"}); setConn(true); return true; }
  catch{ setConn(false); return false; }
}

async function ensureSession(){
  if(state.token && state.userId) return;
  const s = await api("/v1/session",{method:"POST", body: JSON.stringify({})});
  state.token=s.token; state.userId=s.userId;
  localStorage.setItem("cx_token", state.token);
  localStorage.setItem("cx_user", state.userId);
  setUserLabel();
}

function canEquipSelected(){
  if(!state.selectedCardId) return false;
  return !state.market.listedSet.has(state.selectedCardId);
}

/* =========================
   XI / SQUAD
   ========================= */
function seedXI(){
  const grid=el("xi"); if(!grid) return;
  grid.innerHTML="";
  SLOT_KEYS.forEach(slotKey=>{
    const d=document.createElement("div");
    d.className="slot";
    d.dataset.slot=slotKey;
    d.innerHTML=`<div class="p">${slotLabel(slotKey)}</div><div class="n muted">Empty</div>`;
    d.addEventListener("click", ()=> onSlotClick(slotKey));
    grid.appendChild(d);
  });
  refreshSlotStates();
}

function refreshSlotStates(){
  const grid=el("xi"); if(!grid) return;
  const armed = canEquipSelected();
  [...grid.querySelectorAll(".slot")].forEach(node=>{
    const k=node.dataset.slot;
    node.classList.toggle("armed", armed);
    node.classList.toggle("equipped", !!state.squad[k]);
  });
}

function getCardById(id){ return state.inventory.find(c=>c.id===id) || null; }

function renderSquad(){
  const grid=el("xi"); if(!grid) return;
  [...grid.querySelectorAll(".slot")].forEach(node=>{
    const k=node.dataset.slot;
    const cardId=state.squad[k];
    if(!cardId){
      node.innerHTML=`<div class="p">${slotLabel(k)}</div><div class="n muted">Empty</div>`;
      return;
    }
    const c=getCardById(cardId);
    if(!c){
      node.innerHTML=`<div class="p">${slotLabel(k)}</div><div class="n muted">Equipped</div>`;
      return;
    }
    node.innerHTML=`
      <div class="p">${slotLabel(k)}</div>
      <div class="n">${c.display_name}</div>
      <div class="muted tiny">${c.position} • ${c.role} • ${c.rarity}</div>
    `;
  });
  refreshSlotStates();
  updateSynergy();
}

async function onSlotClick(slotKey){
  const status=el("mk-status");

  if(!state.selectedCardId){
    if(!state.squad[slotKey]) return;
    await api("/v1/squad/unequip",{method:"POST", body: JSON.stringify({slot: slotKey})});
    delete state.squad[slotKey];
    renderSquad();
    return;
  }

  if(state.market.listedSet.has(state.selectedCardId)){
    if(status) status.textContent = "This card is LISTED. Cancel listing before equipping.";
    return;
  }

  const cardId=state.selectedCardId;
  await api("/v1/squad/equip",{method:"POST", body: JSON.stringify({slot: slotKey, cardId})});

  for(const k of Object.keys(state.squad)){
    if(state.squad[k]===cardId) delete state.squad[k];
  }
  state.squad[slotKey]=cardId;

  state.selectedCardId=null;
  renderSelectedCard();
  renderInventory();
  renderSquad();
  renderMarketSelected();
}

/* =========================
   LOCKER
   ========================= */
function renderInventory(){
  const list=el("invList"); if(!list) return;

  const items = state.inventory.filter(c => (state.filter==="ALL" ? true : c.rarity===state.filter));
  list.innerHTML="";

  if(!items.length){
    list.innerHTML = `<div class="muted tiny">No cards yet. Open a pack.</div>`;
    return;
  }

  items.forEach(c=>{
    const isListed = state.market.listedSet.has(c.id);

    const row=document.createElement("div");
    row.className="invItem";
    if(state.selectedCardId===c.id) row.classList.add("selected");

    row.addEventListener("click", ()=>{
      state.selectedCardId = (state.selectedCardId===c.id) ? null : c.id;
      renderSelectedCard();
      renderInventory();
      refreshSlotStates();
      renderMarketSelected();
    });

    row.innerHTML=`
      <div>
        <div class="invName">${c.display_name}</div>
        <div class="invMeta">${c.position} • ${c.role}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
        <div class="rarity ${rarityClass(c.rarity)}">${c.rarity}</div>
        ${isListed ? `<div class="badgeSm">LISTED</div>` : ``}
      </div>
    `;
    list.appendChild(row);
  });
}

function renderSelectedCard(){
  const box=el("selectedCard"); if(!box) return;
  const c = state.selectedCardId ? getCardById(state.selectedCardId) : null;

  if(!c){
    box.innerHTML = `
      <div class="muted tiny">Selected</div>
      <div style="font-weight:900;margin-top:6px">None</div>
      <div class="muted tiny" style="margin-top:6px">Pick a card to arm slots.</div>
    `;
    return;
  }

  const isListed = state.market.listedSet.has(c.id);

  box.innerHTML=`
    <div class="muted tiny">Selected</div>
    <div style="font-weight:900;margin-top:6px">${c.display_name}</div>
    <div class="muted tiny" style="margin-top:6px">${c.position} • ${c.role}</div>
    <div class="muted tiny" style="margin-top:6px">${isListed ? "LISTED — cancel before equipping." : "Tap a slot to equip."}</div>
    <div style="margin-top:10px" class="rarity ${rarityClass(c.rarity)}">${c.rarity}</div>
  `;
}

/* =========================
   SYNERGY
   ========================= */
function roleStyle(role){
  const r=(role||"").toLowerCase();
  if(r.includes("press")||r.includes("ball winner")||r.includes("aggressive")||r.includes("overlap")) return "PRESS";
  if(r.includes("playmaking")||r.includes("tempo")||r.includes("ball-playing")) return "POSSESSION";
  if(r.includes("poacher")||r.includes("direct")||r.includes("ghost")) return "COUNTER";
  return "PRESS";
}

function updateSynergy(){
  const pct=el("chemPct"), fill=el("chemFill"), note=el("chemNote");
  const equippedIds = Object.values(state.squad).filter(Boolean);
  const equipped = equippedIds.map(getCardById).filter(Boolean);

  if(!equipped.length){
    if(pct) pct.textContent="0%";
    if(fill) fill.style.width="0%";
    if(note) note.textContent="Equip players to build synergy.";
    return;
  }

  const matches = equipped.filter(c=> roleStyle(c.role)===state.style).length;
  const p=Math.round((matches/equipped.length)*100);
  if(pct) pct.textContent=`${p}%`;
  if(fill) fill.style.width=`${p}%`;
  if(note) note.textContent=`Style: ${state.style} • Matching roles: ${matches}/${equipped.length}`;
}

/* =========================
   ME / BP / ARENA
   ========================= */
function updateBattlePassUI(bp){
  const bpLevel=el("bp-level"), bpFill=el("bpFill"), bpText=el("bpText");
  if(!bp) return;
  if(bpLevel) bpLevel.textContent=`Lv ${bp.level}`;
  if(bpFill) bpFill.style.width=`${Math.round((bp.xp/bp.need)*100)}%`;
  if(bpText) bpText.textContent=`${bp.xp} / ${bp.need} XP`;
}

async function loadMe(){
  const data=await api("/v1/me",{method:"GET"});
  setCoins(data.coins);
  updateBattlePassUI(data.battlepass);
}

async function playArena(){
  const log=el("arenaLog"), btn=el("btn-arena");
  if(btn){ btn.disabled=true; btn.textContent="Playing…"; }
  if(log) log.textContent="Match starting…";
  try{
    const res=await api("/v1/arena/play",{method:"POST", body: JSON.stringify({mode: state.arenaMode, style: state.style})});
    if(log) log.textContent = `${res.result} • Team ${res.teamRating} vs Opp ${res.oppRating} • +${res.rewards.coins} coins • +${res.rewards.bpXp} BP XP`;
    setCoins(res.coins);
    updateBattlePassUI(res.battlepass);
  }catch(e){
    if(log) log.textContent=e.message;
  }finally{
    if(btn){ btn.disabled=false; btn.textContent="Play Match"; }
  }
}

/* =========================
   MARKET
   ========================= */
function renderMarketSelected(){
  const n=el("mk-selected");
  const min=el("mk-min");
  const btn=el("btn-list");
  const status=el("mk-status");

  const c = state.selectedCardId ? getCardById(state.selectedCardId) : null;

  if(!c){
    if(n) n.textContent="None";
    if(min) min.textContent="Min: —";
    if(btn) btn.disabled=false;
    return;
  }

  const isListed = state.market.listedSet.has(c.id);
  const minP = minPriceFor(c.rarity);

  if(n) n.textContent=`${c.display_name} (${c.rarity})`;
  if(min) min.textContent=`Min: ${minP} coins`;

  if(btn) btn.disabled = isListed;
  if(isListed && status) status.textContent = "Selected card is LISTED. Cancel listing to use it.";
}

function listingHTML(x, isMine=false){
  const name = x.display_name || "Unknown";
  const meta = `${x.position} • ${x.role} • ${x.rarity}`;
  const price = x.price;

  const right = isMine
    ? `<button class="smallBtn danger" data-cancel="${x.listing_id}">Cancel</button>`
    : `<button class="smallBtn primary" data-buy="${x.listing_id}">Buy</button>`;

  return `
    <div class="listing">
      <div>
        <div style="font-weight:900">${name}</div>
        <div class="listingMeta">${meta}</div>
      </div>
      <div class="listingRight">
        <div class="priceTag">${price}c</div>
        ${right}
      </div>
    </div>
  `;
}

function formatAgo(ts){
  const s = Math.max(1, Math.floor((Date.now()-ts)/1000));
  if(s < 60) return `${s}s ago`;
  const m = Math.floor(s/60);
  if(m < 60) return `${m}m ago`;
  const h = Math.floor(m/60);
  return `${h}h ago`;
}

function renderTrades(){
  const wrap=el("tradeList"); if(!wrap) return;
  const t=state.market.trades || [];
  wrap.innerHTML = t.length ? t.map(x=>`
    <div class="tradeRow">
      <div>
        <div style="font-weight:900">${x.display_name}</div>
        <div class="tradeMeta">${x.position} • ${x.role} • ${x.rarity} • ${formatAgo(x.created_at)}</div>
      </div>
      <div class="priceTag">${x.price}c</div>
    </div>
  `).join("") : `<div class="muted tiny">No trades yet.</div>`;
}

async function loadMarket(){
  const [rules, pulse, open, mine, trades] = await Promise.all([
    api("/v1/market/rules",{method:"GET"}).catch(()=>DEFAULT_RULES),
    api("/v1/market/pulse?limit=60",{method:"GET"}),
    api("/v1/market/listings?limit=60",{method:"GET"}),
    api("/v1/market/my",{method:"GET"}),
    api("/v1/market/trades?limit=20",{method:"GET"}).catch(()=>({trades:[]}))
  ]);

  state.market.rules = rules || DEFAULT_RULES;
  state.market.pulse = pulse;
  state.market.trades = trades.trades || [];

  // hide my own listings from Open
  const allOpen = open.listings || [];
  state.market.listings = allOpen.filter(x => x.seller_user_id !== state.userId);

  state.market.mine = mine.listings || [];

  // build listed set from OPEN only
  const openMine = state.market.mine.filter(x=>x.status==="OPEN");
  state.market.listedSet = new Set(openMine.map(x=>x.card_id));

  const myCount=el("myCount");
  if(myCount) myCount.textContent = `(${openMine.length}/${state.market.rules.maxOpenListings})`;

  renderPulse();
  renderListings();
  renderTrades();
  renderInventory();
  renderSelectedCard();
  refreshSlotStates();
  renderMarketSelected();
}

function renderListings(){
  const openWrap=el("openListings");
  const myWrap=el("myListings");

  if(openWrap){
    openWrap.innerHTML = state.market.listings.length
      ? state.market.listings.map(x=>listingHTML(x,false)).join("")
      : `<div class="muted tiny">No listings yet.</div>`;
  }

  const openMine = state.market.mine.filter(x=>x.status==="OPEN");
  if(myWrap){
    myWrap.innerHTML = openMine.length
      ? openMine.map(x=>listingHTML(x,true)).join("")
      : `<div class="muted tiny">No listings yet.</div>`;
  }

  document.querySelectorAll("[data-buy]").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      const status=el("mk-status");
      const id=btn.getAttribute("data-buy");
      btn.disabled=true;
      try{
        const res=await api("/v1/market/buy",{method:"POST", body: JSON.stringify({listingId:id})});
        setCoins(res.coins);
        await loadInventory();
        await loadMarket();
        if(status) status.textContent = `Bought. Paid ${res.paid} coins. Fee ${res.fee}.`;
      }catch(e){
        if(status) status.textContent = e.message;
      }finally{
        btn.disabled=false;
      }
    });
  });

  document.querySelectorAll("[data-cancel]").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      const status=el("mk-status");
      const id=btn.getAttribute("data-cancel");
      btn.disabled=true;
      try{
        await api("/v1/market/cancel",{method:"POST", body: JSON.stringify({listingId:id})});
        await loadMarket();
        if(status) status.textContent = "Listing cancelled.";
      }catch(e){
        if(status) status.textContent = e.message;
      }finally{
        btn.disabled=false;
      }
    });
  });
}

async function listSelected(){
  const status=el("mk-status");
  const price = Number(el("mk-price")?.value || 0);
  if(!state.selectedCardId) return (status.textContent="Select a card first.");

  const c = getCardById(state.selectedCardId);
  const minP = minPriceFor(c?.rarity);

  if(!Number.isFinite(price) || price<minP) return (status.textContent=`Min price for ${c?.rarity} is ${minP}.`);

  const btn=el("btn-list");
  btn.disabled=true;
  try{
    await api("/v1/market/list",{method:"POST", body: JSON.stringify({cardId: state.selectedCardId, price})});
    status.textContent="Listed successfully.";
    el("mk-price").value="";
    await loadMarket();
  }catch(e){
    status.textContent=e.message;
  }finally{
    btn.disabled=false;
  }
}

/* Pulse line (supports 1 point) */
function renderPulse(){
  const last=state.market.pulse.last;
  const chg=state.market.pulse.chg24h;
  const pts=state.market.pulse.points || [];

  if(el("m-last")) el("m-last").textContent = (last==null) ? "—" : String(last);
  if(el("m-chg"))  el("m-chg").textContent  = (chg==null) ? "—" : (chg>0?`+${chg}`:`${chg}`);

  const svg = el("sparkSvg");
  if(!svg) return;

  const w=300, h=64;

  if(!pts.length){
    svg.innerHTML = `<path d="M0 ${h-8} L${w} ${h-8}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="2"/>`;
    return;
  }

  const prices = pts.map(p=>p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const span = Math.max(1, max-min);
  const yOf = (price) => (h-10) - ((price-min)/span)*(h-18);

  if(pts.length === 1){
    const y = yOf(pts[0].price);
    svg.innerHTML = `
      <path d="M0 ${y.toFixed(2)} L${w} ${y.toFixed(2)}" fill="none" stroke="rgba(46,245,255,.65)" stroke-width="2.2" />
      <path d="M0 ${y.toFixed(2)} L${w} ${y.toFixed(2)} L${w} ${h} L0 ${h} Z" fill="rgba(46,245,255,.10)" />
      <circle cx="${w-8}" cy="${y.toFixed(2)}" r="3.4" fill="rgba(168,255,46,.85)" />
    `;
    return;
  }

  const step = w / (pts.length - 1);
  const d = pts.map((p,i)=>{
    const x = i*step;
    const y = yOf(p.price);
    return `${i===0?"M":"L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");

  svg.innerHTML = `
    <path d="${d}" fill="none" stroke="rgba(46,245,255,.65)" stroke-width="2.2" />
    <path d="${d} L${w} ${h} L0 ${h} Z" fill="rgba(46,245,255,.10)" />
  `;
}

/* =========================
   PACK REVEAL (same)
   ========================= */
function renderPackResults(cards){
  const wrap=el("cards"); if(!wrap) return;
  wrap.innerHTML="";
  cards.forEach(c=>{
    const row=document.createElement("div");
    row.className="cardRow";
    row.innerHTML=`
      <div>
        <div style="font-weight:900">${c.displayName}</div>
        <div class="muted tiny">${c.position} • ${c.role}</div>
      </div>
      <div class="rarity ${rarityClass(c.rarity)}">${c.rarity}</div>
    `;
    wrap.appendChild(row);
  });
}
function showOverlay(){ const o=el("revealOverlay"); if(o){o.classList.remove("hidden"); o.setAttribute("aria-hidden","false");} }
function hideOverlay(){ const o=el("revealOverlay"); if(o){o.classList.add("hidden"); o.setAttribute("aria-hidden","true");} }
function setOverlaySub(t){ const n=el("overlaySub"); if(n) n.textContent=t; }

function resetRevealUI(){
  state.revealIndex=0; state.revealCards=[]; state.revealing=false;
  const inner=el("overlayInner"); if(inner) inner.classList.remove("legendaryBurst");
  const claim=el("btn-claim"); if(claim){claim.disabled=true; claim.textContent="Claim";}
  const hint=el("revealHint"); if(hint) hint.textContent="Tap to reveal";
  const pack=el("revealPack"); if(pack) pack.classList.add("shake");
  const list=el("revealCards"); if(!list) return;
  list.innerHTML="";
  for(let i=0;i<3;i++){
    const card=document.createElement("div");
    card.className="flipCard";
    card.dataset.i=String(i);
    card.innerHTML=`
      <div class="flipInner">
        <div class="flipFace flipBack"><div class="q">?</div><div class="t">Reveal</div></div>
        <div class="flipFace flipFront">
          <div class="cardTop">
            <div><div class="cardName">Unknown</div><div class="cardMeta">— • —</div></div>
            <div class="badge">—</div>
          </div>
          <div class="cardFooter"><span class="muted">CLASH XI</span><span class="muted">v1</span></div>
        </div>
      </div>
    `;
    list.appendChild(card);
  }
}
function injectRevealData(cards){
  const list=el("revealCards"); if(!list) return;
  const nodes=[...list.querySelectorAll(".flipCard")];
  nodes.forEach((node,i)=>{
    const c=cards[i];
    node.classList.remove("rCommon","rRare","rEpic","rLegend");
    node.classList.add(rarityClass(c.rarity));
    const badge=node.querySelector(".badge");
    const name=node.querySelector(".cardName");
    const meta=node.querySelector(".cardMeta");
    if(badge) badge.textContent=c.rarity;
    if(name) name.textContent=c.displayName;
    if(meta) meta.textContent=`${c.position} • ${c.role}`;
  });
}
function legendaryBurst(){
  const inner=el("overlayInner"); if(!inner) return;
  inner.classList.remove("legendaryBurst"); void inner.offsetWidth; inner.classList.add("legendaryBurst");
}
async function flipNext(){
  if(state.revealing) return;
  if(state.revealIndex>=state.revealCards.length) return;
  state.revealing=true;

  const i=state.revealIndex;
  const card=state.revealCards[i];
  const node=el("revealCards")?.querySelector(`.flipCard[data-i="${i}"]`);
  if(node) node.classList.add("flipped");

  if(card?.rarity==="LEGENDARY"){ legendaryBurst(); setOverlaySub("SIGNATURE LEGENDARY!"); }
  else if(card?.rarity==="EPIC"){ setOverlaySub("Epic pull."); }
  else if(card?.rarity==="RARE"){ setOverlaySub("Rare pull."); }
  else { setOverlaySub("Common."); }

  await sleep(550);
  state.revealIndex += 1;
  state.revealing=false;

  if(state.revealIndex>=state.revealCards.length){
    const pack=el("revealPack"); if(pack) pack.classList.remove("shake");
    setOverlaySub("Pack complete.");
    const claim=el("btn-claim"); if(claim) claim.disabled=false;
    const hint=el("revealHint"); if(hint) hint.textContent="Done";
  }
}
async function openPack(){
  const btn=el("btn-pack");
  if(btn){btn.disabled=true; btn.textContent="Opening…";}
  showOverlay(); resetRevealUI(); setOverlaySub("Generating cards…");
  try{
    await ensureSession();
    const data=await api("/v1/packs/open",{method:"POST", body: JSON.stringify({kind:"DAILY"})});
    state.revealCards=data.cards||[];
    injectRevealData(state.revealCards);
    renderPackResults(state.revealCards);
  }catch(e){
    hideOverlay(); alert(e.message);
  }finally{
    if(btn){btn.disabled=false; btn.textContent="Open Pack";}
  }
}

/* Load base app data */
async function loadInventory(){
  const data=await api("/v1/inventory",{method:"GET"});
  state.inventory=data.cards||[];
  renderInventory();
  renderSelectedCard();
  renderSquad();
  renderMarketSelected();
}
async function loadSquad(){
  const data=await api("/v1/squad",{method:"GET"});
  state.squad=data.slots||{};
  renderSquad();
}

/* UI init */
function initChips(){
  document.querySelectorAll("[data-filter]").forEach(b=>{
    b.addEventListener("click", ()=>{
      state.filter=b.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      renderInventory();
    });
  });

  document.querySelectorAll("[data-style]").forEach(b=>{
    if(b.dataset.style===state.style) b.classList.add("active");
    b.addEventListener("click", ()=>{
      state.style=b.dataset.style;
      localStorage.setItem("cx_style", state.style);
      document.querySelectorAll("[data-style]").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      updateSynergy();
    });
  });

  document.querySelectorAll("[data-arena]").forEach(b=>{
    if(b.dataset.arena===state.arenaMode) b.classList.add("active");
    b.addEventListener("click", ()=>{
      state.arenaMode=b.dataset.arena;
      document.querySelectorAll("[data-arena]").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      const t=el("arena-mode"); if(t) t.textContent=state.arenaMode;
    });
  });
}

/* Boot */
(async function boot(){
  seedXI();
  setUserLabel();
  initChips();

  const ok=await healthCheck(); setConn(ok);

  el("btn-play")?.addEventListener("click", async ()=>{
    const ok2=await healthCheck();
    if(!ok2) return alert("API offline. Check Worker.");
    await ensureSession();
    el("btn-pack").disabled=false;

    await loadInventory();
    await loadSquad();
    await loadMe();
    await loadMarket();
    updateSynergy();
  });

  el("btn-pack")?.addEventListener("click", openPack);
  el("btn-arena")?.addEventListener("click", playArena);

  el("btn-refresh-market")?.addEventListener("click", async ()=>{
    const status=el("mk-status");
    if(status) status.textContent="Refreshing…";
    await loadMarket();
    if(status) status.textContent="Refreshed.";
  });

  el("btn-list")?.addEventListener("click", listSelected);

  el("btn-close")?.addEventListener("click", ()=> hideOverlay());
  el("btn-claim")?.addEventListener("click", async ()=>{
    hideOverlay();
    await loadInventory();
    await loadSquad();
    await loadMe();
    await loadMarket();
  });

  const revealAction = async ()=>{
    if(!state.revealCards?.length) return;
    await flipNext();
  };
  el("revealPack")?.addEventListener("click", revealAction);
  el("revealCards")?.addEventListener("click", revealAction);

  const t=el("arena-mode"); if(t) t.textContent=state.arenaMode;
  renderMarketSelected();
})();
