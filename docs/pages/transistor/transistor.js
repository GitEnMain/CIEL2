const images = document.querySelectorAll(".zoomImg"); // toutes les images avec la classe zoomImg

images.forEach(img => {
  img.style.transition = "transform 0.3s ease-in-out"; // transition pour le zoom
  img.addEventListener("mouseover", () => img.style.transform = "scale(2.5)"); // zoom
  img.addEventListener("mouseout", () => img.style.transform = "scale(1)");    // retour
});



const fonctionDivs = document.querySelectorAll(".fonctions, .fonctions2");// On sélectionne toutes les bulles 


const observer = new IntersectionObserver((entries) => { // observe si l'élément/bulle entre dans la fenêtre
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show"); // déclenche le CSS
      observer.unobserve(entry.target);   // arrête l'observation
    }
  });
}, {
  threshold: 0.6,               // à partir de 60% on voit l'élément/bulle
  rootMargin: "0px 0px -50px 0px" // décalage pour déclencher plus tôt
});


fonctionDivs.forEach(fonctionDiv => {//observer chaque bulle
  observer.observe(fonctionDiv); // observe la bulle
});



