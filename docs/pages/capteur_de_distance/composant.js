// Effet 1 : Changer la couleur du texte quand la souris passe dessus
document.querySelectorAll("p, h2, h3, li").forEach(el => {
    el.addEventListener("mouseover", () => {
      el.style.color = "cyan";
      el.style.transition = "0.3s";
    });
  
    el.addEventListener("mouseout", () => {
      el.style.color = ""; // retour à la couleur CSS par défaut
    });
  });
  
  // Effet 2 : Faire clignoter un titre automatiquement
  let titre = document.querySelector("h1");
  if (titre) {
    setInterval(() => {
      titre.style.color = titre.style.color === "red" ? "yellow" : "red";
    }, 700);
  }
  
  // Effet 3 : Animation au scroll (fade in)
  const elements = document.querySelectorAll(".fade");
  window.addEventListener("scroll", () => {
    elements.forEach(el => {
      let position = el.getBoundingClientRect().top;
      if (position < window.innerHeight - 50) {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }
    });
  });
  