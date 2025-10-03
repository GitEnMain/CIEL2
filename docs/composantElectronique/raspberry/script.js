document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  // Lire le thème stocké
  let theme = localStorage.getItem("theme") || "auto";
  applyTheme(theme);

  btn.addEventListener("click", () => {
    if (theme === "dark") theme = "light";
    else theme = "dark";
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  });

  function applyTheme(mode) {
    if (mode === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      btn.textContent = "🌙";
    } else if (mode === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      btn.textContent = "☀️";
    }
  }
});


(function () {
    function ready(fn) {
      if (document.readyState !== "loading") fn();
      else document.addEventListener("DOMContentLoaded", fn);
    }
  
    ready(function () {
      var help = document.getElementById("gpio-help");
      var legend = document.getElementById("gpio-legend");
  
      if (legend && help) {
        var EXPLAIN = {
          v5:  "5V : alimentation directe (danger si mal utilisée). Ne jamais brancher un capteur 3.3V dessus.",
          v33: "3.3V : alimentation capteurs/IC compatibles 3.3V. Courant limité.",
          gnd: "GND : masse (référence électrique). Toujours relier la masse entre les éléments d’un montage.",
          i2c: "I²C : bus série 2 fils (SDA/SCL) pour capteurs (ex : température, lumière). Adresses et pull-ups nécessaires.",
          spi: "SPI : bus rapide (MOSI/MISO/SCLK/CS) pour écrans, ADC, mémoires. Pleine-duplex, plusieurs périphériques via CS.",
          uart:"UART : communication série (TX/RX), typiquement 3.3V. Utile pour debug console et modules série.",
          gpio:"GPIO : broches d’entrées/sorties programmables (lecture capteurs, pilotage LED/relais, PWM, etc.)."
        };
  
        help.textContent = "Cliquez une pastille pour afficher l’explication.";
  
        legend.addEventListener("click", function (e) {
          var el = e.target;
          while (el && el !== legend && !(el.tagName === "BUTTON" && el.dataset && el.dataset.key)) {
            el = el.parentNode;
          }
          if (!el || el === legend) return;
  
          var btns = legend.querySelectorAll("button[data-key]");
          for (var i = 0; i < btns.length; i++) btns[i].classList.remove("active");
          el.classList.add("active");
  
          var key = el.dataset.key;
          help.textContent = EXPLAIN[key] || "Catégorie non documentée.";
        });
      }
  


      document.addEventListener('DOMContentLoaded', function () {
        var btn = document.getElementById('backToTop');
        if (!btn) return;
      
        // Affiche/masque selon la position de scroll
        function toggle() {
          var y = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
          if (y > 300) btn.classList.add('is-visible');
          else btn.classList.remove('is-visible');
        }
        toggle();
        window.addEventListener('scroll', toggle, { passive: true });
      
        // Remonter en douceur (avec fallback)
        btn.addEventListener('click', function () {
          try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } catch (e) {
            // fallback pour vieux navigateurs
            var c = document.documentElement.scrollTop || document.body.scrollTop;
            (function smooth() {
              if (c > 0) {
                window.scrollTo(0, c - Math.max(1, Math.floor(c / 10)));
                c = document.documentElement.scrollTop || document.body.scrollTop;
                requestAnimationFrame(smooth);
              }
            })();
          }
        });
      });
      
    });
  })();
  