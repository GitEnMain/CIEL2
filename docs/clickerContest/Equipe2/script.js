// --- Etat du jeu ---
const state = {
score: 0,
totalEarned: 0,
clickPower: 1,
cps: 0,
items: {
// id: {name, basePrice, count, type, effect}
cursor: { name: "Cursor", desc: "+1 power par achat", basePrice: 15, count: 0, type: "power", effect: 1 },
autoclicker: { name: "Autoclicker", desc: "+0.5 CPS par achat", basePrice: 100, count: 0, type: "cps", effect: 0.5 },
multiplier: { name: "Multiplicateur", desc: "x2 power (cumulatif)", basePrice: 500, count: 0, type: "mult", effect: 2 }
},
lastSaved: null
};

// --- DOM ---
const scoreEl = document.getElementById('score');
const cpsEl = document.getElementById('cps');
const powerEl = document.getElementById('power');
const shopEl = document.getElementById('shop');
const cookie = document.getElementById('cookie');
const totalEarnedEl = document.getElementById('totalEarned');
const lastSaveEl = document.getElementById('lastSave');
const toastEl = document.getElementById('toast');

// --- sauvegarde clé ---
const STORAGE_KEY = 'simple_clicker_v1';

// --- utilitaires ---
function formatNumber(n){
if(n >= 1e9) return (n/1e9).toFixed(2)+'B';
if(n >= 1e6) return (n/1e6).toFixed(2)+'M';
if(n >= 1e3) return (n/1e3).toFixed(1)+'k';
return Math.round(n*100)/100;
}
function showToast(txt, ms=1500){
toastEl.textContent = txt; toastEl.style.display='block';
clearTimeout(showToast._t); showToast._t = setTimeout(()=> toastEl.style.display='none', ms);
}

// --- logic shop price scaling (exponential) ---
function priceFor(item){
// scaling: base * 1.15^count, rounded
return Math.round(item.basePrice * Math.pow(1.15, item.count));
}

// --- rebuild shop UI ---
function renderShop(){
shopEl.innerHTML = '';
for(const id of Object.keys(state.items)){
const it = state.items[id];
const price = priceFor(it);
const itemDiv = document.createElement('div');
itemDiv.className = 'item';
itemDiv.innerHTML = `
<div class="left">
<div class="name">${it.name} <span style="font-weight:500;color:var(--muted)">x${it.count}</span></div>
<div class="desc">${it.desc}</div>
</div>
<div class="right row">
<div class="price">${formatNumber(price)}</div>
<button class="btn buy" data-id="${id}">Acheter</button>
</div>
`;
shopEl.appendChild(itemDiv);
}

// bind buy buttons
shopEl.querySelectorAll('.buy').forEach(b => {
b.onclick = () => buyItem(b.dataset.id);
});
}

// --- apply item effects to state ---
function recalcDerived(){
// clickPower starts at 1, add cursor effects, apply multipliers
let basePower = 1;
if(state.items.cursor) basePower += state.items.cursor.count * state.items.cursor.effect;
// apply multiplier items multiplicatively
let multiplier = 1;
if(state.items.multiplier) multiplier *= Math.pow(state.items.multiplier.effect, state.items.multiplier.count);
state.clickPower = basePower * multiplier;

// cps from autoclickers and possible future cps items
let cps = 0;
if(state.items.autoclicker) cps += state.items.autoclicker.count * state.items.autoclicker.effect;
state.cps = Math.round(cps * 100)/100;
}

// --- purchase ---
function buyItem(id){
const item = state.items[id];
const price = priceFor(item);
if(state.score < price){
showToast("Pas assez de points");
return;
}
state.score -= price;
item.count += 1;
recalcDerived();
updateUI();
showToast(`Acheté: ${item.name}`);
save();
}

// --- clicking ---
function doClick(n=1){
const gained = n * state.clickPower;
state.score = Math.round((state.score + gained) * 100)/100;
state.totalEarned = Math.round((state.totalEarned + gained) * 100)/100;
updateUI();
}

// --- update UI ---
function updateUI(){
scoreEl.textContent = formatNumber(state.score);
cpsEl.textContent = formatNumber(state.cps);
powerEl.textContent = formatNumber(state.clickPower);
totalEarnedEl.textContent = formatNumber(state.totalEarned);
lastSaveEl.textContent = state.lastSaved ? new Date(state.lastSaved).toLocaleString() : '—';
renderShop();
}

// --- autosave/load ---
function save(){
const toSave = {
score: state.score,
totalEarned: state.totalEarned,
items: {},
lastSaved: Date.now()
};
for(const k in state.items) toSave.items[k] = state.items[k].count;
localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
state.lastSaved = toSave.lastSaved;
updateUI();
}

function load(){
const raw = localStorage.getItem(STORAGE_KEY);
if(!raw) return;
try{
const obj = JSON.parse(raw);
state.score = obj.score || 0;
state.totalEarned = obj.totalEarned || 0;
for(const k in obj.items || {}) if(state.items[k]) state.items[k].count = obj.items[k];
state.lastSaved = obj.lastSaved || null;
recalcDerived();
}catch(e){
console.error("Erreur chargement", e);
}
}

// --- reset ---
function resetGame(){
if(!confirm("Réinitialiser la progression ?")) return;
localStorage.removeItem(STORAGE_KEY);
// reset state
state.score = 0; state.totalEarned = 0; state.lastSaved = null;
for(const k in state.items){ state.items[k].count = 0; }
recalcDerived();
updateUI();
showToast("Progression réinitialisée");
}

// --- export/import JSON ---
function exportJSON(){
const data = JSON.stringify({
score: state.score,
totalEarned: state.totalEarned,
items: Object.fromEntries(Object.entries(state.items).map(([k,v])=>[k,v.count])),
exportedAt: Date.now()
}, null, 2);
// create downloadable blob
const blob = new Blob([data], {type:'application/json'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'clicker-save.json';
a.click();
URL.revokeObjectURL(url);
}
function importJSON(){
const inp = document.createElement('input');
inp.type='file';
inp.accept='application/json';
inp.onchange = e=>{
const f = e.target.files[0];
if(!f) return;
const reader = new FileReader();
reader.onload = ev=>{
try{
const obj = JSON.parse(ev.target.result);
if(typeof obj.items === 'object'){
for(const k in obj.items) if(state.items[k]) state.items[k].count = obj.items[k];
}
state.score = obj.score ?? state.score;
state.totalEarned = obj.totalEarned ?? state.totalEarned;
recalcDerived(); updateUI(); save();
showToast("Importation réussie");
}catch(err){
alert("Fichier JSON invalide");
}
};
reader.readAsText(f);
};
inp.click();
}

// --- autoclick loop ---
let lastTick = Date.now();
function gameTick(){
const now = Date.now();
const dt = (now - lastTick)/1000; // seconds
lastTick = now;
// gain from cps:
if(state.cps > 0){
const gain = state.cps * dt;
state.score = Math.round((state.score + gain) * 100)/100;
state.totalEarned = Math.round((state.totalEarned + gain) * 100)/100;
updateUI();
}
}
setInterval(gameTick, 200); // tick 5x/sec

// autosave timer
setInterval(save, 10000);

// --- binds ---
cookie.addEventListener('click', ()=>{ doClick(1); });
document.getElementById('saveBtn').addEventListener('click', ()=>{ save(); showToast("Sauvegardé"); });
document.getElementById('resetBtn').addEventListener('click', resetGame);
document.getElementById('exportBtn').addEventListener('click', exportJSON);
document.getElementById('importBtn').addEventListener('click', importJSON);

// initial load
load();
recalcDerived();
updateUI();

// small animation pulse on click
cookie.addEventListener('mousedown', ()=> cookie.style.transform='scale(.96)');
cookie.addEventListener('mouseup', ()=> cookie.style.transform='scale(1)');

// keyboard support: space or enter to click
window.addEventListener('keydown', (e)=> {
if(e.code === 'Space' || e.code === 'Enter'){ e.preventDefault(); doClick(1); }
});

// expose for debugging (optional)
window.__clicker = {
state, save, load, resetGame
};