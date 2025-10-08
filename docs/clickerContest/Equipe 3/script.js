// script.js - logique du clicker
(function(){
    const countEl = document.getElementById('count');
    const clickBtn = document.getElementById('clickBtn');
    const doubleBtn = document.getElementById('doubleBtn');
    const resetBtn = document.getElementById('resetBtn');
    const persistCheckbox = document.getElementById('persist');
  
    const STORAGE_KEY = 'simple-clicker-count-v1';
    let count = 0;
  
    // Charger le compteur si présent
    function load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw !== null) {
          count = parseInt(raw, 10) || 0;
          persistCheckbox.checked = true;
        }
      } catch (e) {
        // Ignorer si localStorage bloqué
      }
      render();
    }
  
    function save() {
      try {
        if (persistCheckbox.checked) {
          localStorage.setItem(STORAGE_KEY, String(count));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {}
    }
  
    function render() {
      countEl.textContent = String(count);
    }
  
    function bumpAnimation() {
      countEl.classList.remove('bump');
      // Force reflow pour relancer l'animation CSS
      void countEl.offsetWidth;
      countEl.classList.add('bump');
    }
  
    function add(n = 1) {
      count += n;
      render();
      bumpAnimation();
      save();
    }
  
    function reset() {
      count = 0;
      render();
      save();
    }
  
    // Listeners
    clickBtn.addEventListener('click', () => add(1));

    resetBtn.addEventListener('click', () => {
      if (confirm('Réinitialiser le compteur ?')) reset();
    });
  
    // Sauvegarde checkbox change
    persistCheckbox.addEventListener('change', save);
  
    // Init
    load();
  })();