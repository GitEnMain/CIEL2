document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("BTN");

    btn.addEventListener("click", () => {
        window.location.href = "../../index.html";
    });
});


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
  