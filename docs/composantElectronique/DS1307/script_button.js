
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("BTN");

    btn.addEventListener("click", () => {
        window.location.href = "../../index.html";
    });

    const themeBtn = document.getElementById("themeToggle");
    if (!themeBtn) return;

    
    let theme = localStorage.getItem("theme") || "auto";
    applyTheme(theme);

    themeBtn.addEventListener("click", () => {
        if (theme === "dark") theme = "light";
        else theme = "dark";
        applyTheme(theme);
        localStorage.setItem("theme", theme);
    });

    function applyTheme(mode) {
        if (mode === "dark") {
            document.documentElement.setAttribute("data-theme", "dark");
            themeBtn.textContent = "🌙";
        } else if (mode === "light") {
            document.documentElement.setAttribute("data-theme", "light");
            themeBtn.textContent = "☀️";
        }
    }
});
