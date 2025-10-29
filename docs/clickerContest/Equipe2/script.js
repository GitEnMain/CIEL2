(function() {

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
      multiplier: { name: "Multiplicateur", desc: "x1.2 power (cumulatif)", basePrice: 500, count: 0, type: "mult", effect: 1.2 }
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
  
  // Timer privé pour le toast (grâce à l'IIFE)
  let toastTimer = null;
  
  let audioCtx = null;

  // --- utilitaires ---
  function formatNumber(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k';
    return Math.round(n * 100) / 100;
  }

  function showToast(txt, ms = 1500) {
    toastEl.textContent = txt;
    toastEl.style.display = 'block';
    clearTimeout(toastTimer); // On utilise le timer privé
    toastTimer = setTimeout(() => toastEl.style.display = 'none', ms);
  }

  function initAudio() {
    // Initialise le contexte audio (doit être fait après une interaction utilisateur)
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.error("Web Audio API n'est pas supportée.", e);
      }
    }
  }

  function playBuySound() {
    if (!audioCtx) return; // Ne rien faire si l'audio n'est pas prêt

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    // Configuration du son (un "bip" aigu)
    oscillator.type = 'triangle'; // 'sine', 'square', 'sawtooth', 'triangle'
    oscillator.frequency.setValueAtTime(900, audioCtx.currentTime); // Fréquence (aiguë)
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime); // Volume (max 1)

    // Fade out rapide pour faire "bip"
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

    // Connexion des nœuds
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    // Démarrer et arrêter le son
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.1); // Durée de 100ms
  }


  // --- logic shop price scaling (exponential) ---
  function priceFor(item) {
    // scaling: base * 1.15^count, rounded
    return Math.round(item.basePrice * Math.pow(1.15, item.count));
  }

  // --- rebuild shop UI ---
  function renderShop() {
    shopEl.innerHTML = '';
    for (const id of Object.keys(state.items)) {
      const it = state.items[id];
      const price = priceFor(it);
      const itemDiv = document.createElement('div');
      itemDiv.className = 'item';
      // On vérifie si on peut acheter pour griser le bouton
      const canBuy = state.score >= price;
      
      itemDiv.innerHTML = `
        <div class="left">
          <div class="name">${it.name} <span style="font-weight:500;color:var(--muted)">x${it.count}</span></div>
          <div class="desc">${it.desc}</div>
        </div>
        <div class="right row">
          <div class="price">${formatNumber(price)}</div>
          <button class="btn buy" data-id="${id}" ${!canBuy ? 'disabled' : ''}>Acheter</button>
        </div>
      `;
      shopEl.appendChild(itemDiv);
    }
  }

  function recalcDerived() {
    let basePower = 1;
    let multiplier = 1;
    let cps = 0;

    for (const id in state.items) {
      const item = state.items[id];
      if (item.count === 0) continue;

      switch (item.type) {
        case "power":
          basePower += item.count * item.effect;
          break;
        case "cps":
          cps += item.count * item.effect;
          break;
        case "mult":
          multiplier *= Math.pow(item.effect, item.count);
          break;
      }
    }

    state.clickPower = basePower * multiplier;
    state.cps = Math.round(cps * 100) / 100;
  }

  // --- purchase ---
  function buyItem(id) {
    const item = state.items[id];
    if (!item) return; // Sécurité
    
    const price = priceFor(item);
    if (state.score < price) {
      showToast("Pas assez de points");
      return;
    }
    state.score -= price;
    item.count += 1;
    
    recalcDerived();
    renderFullUI(); // On fait un rendu complet après un achat
    showToast(`Acheté: ${item.name}`);
    
    playBuySound(); // Joue le son d'achat
    
    // La sauvegarde se fera par l'autosave
  }

  // --- clicking ---
  function doClick(n = 1) {
    // Initialise le contexte audio au premier clic
    if (!audioCtx) initAudio();

    const gained = n * state.clickPower;
    state.score = Math.round((state.score + gained) * 100) / 100;
    state.totalEarned = Math.round((state.totalEarned + gained) * 100) / 100;
    
    // Un clic ne met à jour que le score, pas besoin de redessiner la boutique
    updateDynamicUI(); 
  }

  function updateDynamicUI() {
    scoreEl.textContent = formatNumber(state.score);
    totalEarnedEl.textContent = formatNumber(state.totalEarned);
    
    // On met aussi à jour la boutique, mais juste pour l'état disabled
    shopEl.querySelectorAll('.buy').forEach(b => {
      const item = state.items[b.dataset.id];
      if (item) {
        b.disabled = state.score < priceFor(item);
      }
    });
  }

  function renderFullUI() {
    // Met à jour les stats
    cpsEl.textContent = formatNumber(state.cps);
    powerEl.textContent = formatNumber(state.clickPower);
    lastSaveEl.textContent = state.lastSaved ? new Date(state.lastSaved).toLocaleString() : '—';
    
    // Redessine la boutique
    renderShop();
    
    // Met à jour les éléments dynamiques (score, etc.)
    updateDynamicUI();
  }

  // --- autosave/load ---
  function save() {
    const toSave = {
      score: state.score,
      totalEarned: state.totalEarned,
      items: {},
      lastSaved: Date.now()
    };
    for (const k in state.items) toSave.items[k] = state.items[k].count;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    
    // On met juste à jour l'état et le texte de sauvegarde
    state.lastSaved = toSave.lastSaved;
    lastSaveEl.textContent = new Date(state.lastSaved).toLocaleString();
  }

  function load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const obj = JSON.parse(raw);
      state.score = obj.score || 0;
      state.totalEarned = obj.totalEarned || 0;
      for (const k in obj.items || {}) {
        if (state.items[k]) state.items[k].count = obj.items[k];
      }
      state.lastSaved = obj.lastSaved || null;
      recalcDerived(); // Important de recalculer après chargement
    } catch (e) {
      console.error("Erreur chargement", e);
    }
  }

  // --- reset ---
  function resetGame() {
    if (!confirm("Réinitialiser la progression ?")) return;
    localStorage.removeItem(STORAGE_KEY);
    
    // Reset state
    state.score = 0;
    state.totalEarned = 0;
    state.lastSaved = null;
    for (const k in state.items) { state.items[k].count = 0; }
    
    recalcDerived();
    renderFullUI(); // Rendu complet
    showToast("Progression réinitialisée");
  }

  // --- export/import JSON ---
  function exportJSON() {
    const data = JSON.stringify({
      score: state.score,
      totalEarned: state.totalEarned,
      items: Object.fromEntries(Object.entries(state.items).map(([k, v]) => [k, v.count])),
      exportedAt: Date.now()
    }, null, 2);
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clicker-save.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON() {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = 'application/json';
    inp.onchange = e => {
      const f = e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const obj = JSON.parse(ev.target.result);
          if (typeof obj.items === 'object') {
            for (const k in obj.items) {
              if (state.items[k]) state.items[k].count = obj.items[k];
            }
          }
          state.score = obj.score ?? state.score;
          state.totalEarned = obj.totalEarned ?? state.totalEarned;
          recalcDerived();
          renderFullUI(); // Rendu complet
          save(); // On sauvegarde l'état importé
          showToast("Importation réussie");
        } catch (err) {
          alert("Fichier JSON invalide");
        }
      };
      reader.readAsText(f);
    };
    inp.click();
  }

  // --- autoclick loop ---
  let lastTick = Date.now();
  function gameTick() {
    const now = Date.now();
    const dt = (now - lastTick) / 1000; // secondes
    lastTick = now;
    
    if (state.cps > 0) {
      const gain = state.cps * dt;
      state.score = Math.round((state.score + gain) * 100) / 100;
      state.totalEarned = Math.round((state.totalEarned + gain) * 100) / 100;
      
      updateDynamicUI();
    }
  }
  setInterval(gameTick, 200); // tick 5x/sec

  // autosave timer
  setInterval(save, 10000);

  // --- binds ---
  cookie.addEventListener('click', () => { doClick(1); });
  document.getElementById('saveBtn').addEventListener('click', () => { save(); showToast("Sauvegardé"); });
  document.getElementById('resetBtn').addEventListener('click', resetGame);
  document.getElementById('exportBtn').addEventListener('click', exportJSON);
  document.getElementById('importBtn').addEventListener('click', importJSON);

  shopEl.addEventListener('click', (e) => {
    // On cherche si le clic vient d'un bouton '.buy'
    const buyButton = e.target.closest('.buy');
    if (buyButton) {
      e.preventDefault();
      buyItem(buyButton.dataset.id);
    }
  });

  // small animation pulse on click
  cookie.addEventListener('mousedown', () => cookie.style.transform = 'scale(.96)');
  cookie.addEventListener('mouseup', () => cookie.style.transform = 'scale(1)');

  // keyboard support: space or enter to click
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      cookie.style.transform = 'scale(.96)'; // Simule le mousedown
      doClick(1);
    }
  });
  window.addEventListener('keyup', (e) => {
     if (e.code === 'Space' || e.code === 'Enter') {
       cookie.style.transform = 'scale(1)'; // Simule le mouseup
     }
  });

  // --- initial load ---
  load();
  recalcDerived();
  renderFullUI(); // On fait le premier rendu complet

  // expose for debugging (optional)
  window.__clicker = {
    state, save, load, resetGame, renderFullUI
  };

})();