// Step 2 will give you the Worker URL. Leave this as-is for now:
const API_BASE = "REPLACE_WITH_YOUR_WORKER_URL";

const el = (id) => document.getElementById(id);
const state = {
  token: localStorage.getItem("cx_token") || null,
  userId: localStorage.getItem("cx_user") || null,
};

function setConn(ok) { el("pill-conn").textContent = ok ? "API: Connected" : "API: Offline"; }
function setUserLabel() { el("pill-user").textContent = state.userId ? `User: ${state.userId.slice(0,8)}` : "Guest"; }

function seedXI() {
  const grid = el("xi"); grid.innerHTML = "";
  const slots = ["GK","LB","CB","CB","RB","CM","CM","CAM","LW","ST","RW"];
  slots.forEach(p=>{
    const d=document.createElement("div");
    d.className="slot";
    d.innerHTML=`<div class="p">${p}</div><div class="n muted">Empty</div>`;
    grid.appendChild(d);
  });
}

async function api(path, opts={}) {
  const headers = opts.headers || {};
  if (state.token) headers["Authorization"] = `Bearer ${state.token}`;
  headers["Content-Type"] = "application/json";
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  const txt = await res.text();
  let json=null; try{json=JSON.parse(txt)}catch{}
  if(!res.ok) throw new Error(json?.error || txt || "API error");
  return json;
}

async function healthCheck(){
  try { await api("/health",{method:"GET"}); setConn(true); return true; }
  catch { setConn(false); return false; }
}

async function ensureSession(){
  if(state.token && state.userId) return;
  const s = await api("/v1/session",{method:"POST", body:JSON.stringify({})});
  state.token=s.token; state.userId=s.userId;
  localStorage.setItem("cx_token",state.token);
  localStorage.setItem("cx_user",state.userId);
  setUserLabel();
}

function renderCards(cards){
  const wrap=el("cards"); wrap.innerHTML="";
  cards.forEach(c=>{
    const row=document.createElement("div");
    row.className="cardRow";
    row.innerHTML=`<div><div style="font-weight:900">${c.displayName}</div>
      <div class="muted tiny">${c.position} • ${c.role}</div></div>
      <div style="font-weight:900;font-size:12px">${c.rarity}</div>`;
    wrap.appendChild(row);
  });
}

async function openPack(){
  const btn=el("btn-pack");
  btn.disabled=true; btn.textContent="Opening…";
  try{
    const data=await api("/v1/packs/open",{method:"POST", body:JSON.stringify({kind:"DAILY"})});
    renderCards(data.cards);
  }catch(e){ alert(e.message); }
  finally{ btn.textContent="Open Pack"; btn.disabled=false; }
}

(async function boot(){
  seedXI(); setUserLabel();
  el("btn-play").addEventListener("click", async ()=>{
    const ok = await healthCheck();
    if(!ok) return alert("API not deployed yet. Step 2 will create it.");
    await ensureSession();
    el("btn-pack").disabled=false;
  });
  el("btn-pack").addEventListener("click", openPack);
  await healthCheck();
})();
