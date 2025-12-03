const dangerInfo = {
  elec: {
    title: "Electrical hazard in an office",
    text: "You work with computers, printers and many electrical devices in an office. Damaged cables, overloaded multi-plugs or broken insulation can cause electric shocks or even a fire. To protect yourself, always check cables, never overload sockets, unplug equipment when possible and report any damaged electrical device."
  },
  fire: {
    title: "Fire hazard at work",
    text: "Fire can start if equipment overheats, if electrical devices are damaged, or if flammable products are stored near a heat source. To stay safe, keep your workspace clean, avoid overloading electrical plugs, store chemicals correctly and always know where the fire extinguisher is."
  },
  chem: {
    title: "Chemical products and toxic risk",
    text: "In a garden or workshop, you may use pesticides, cleaning products or other chemical substances. They can irritate your skin, eyes or lungs, and some are dangerous if you breathe them. Wear gloves, goggles and a mask, read all safety labels and ventilate the area when using these products."
  },
  slip: {
    title: "Slips, trips and falls on a construction site",
    text: "Construction sites contain uneven ground, tools, cables and elevated areas. Workers can easily fall from height or trip on obstacles. Use safety shoes, keep the floor clear, secure ladders and always wear a safety harness when working at height."
  },
  cuts: {
    title: "Dangerous machines and cut hazard",
    text: "In a factory, machines often have sharp parts or strong moving components. A simple mistake can cause cuts or serious injuries. Always use protective gloves, follow the safety instructions of the machine, never remove security guards and turn off the machine before any maintenance."
  }
};

// Récupération des éléments
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalText = document.getElementById("modal-text");
const modalImg = document.getElementById("modal-img"); 

// --- 1. Gestion des cartes "Texte" ---
document.querySelectorAll(".card-content").forEach(card => {
  card.addEventListener("click", () => {
    const type = card.dataset.type;

    // Cache l'image, affiche le texte
    if(modalImg) modalImg.style.display = "none";
    modalTitle.style.display = "block";
    modalText.style.display = "block";

    // Remplit le texte
    modalTitle.textContent = dangerInfo[type].title;
    modalText.textContent = dangerInfo[type].text;

    modal.classList.add("show");
  });
});

const diagBtn = document.querySelector(".diag-button");

if (diagBtn) {
  diagBtn.addEventListener("click", (e) => {
    e.preventDefault(); 
    
    // Cache le texte, affiche l'image
    modalTitle.style.display = "none";
    modalText.style.display = "none";
    
    if(modalImg) {
        modalImg.style.display = "block";
        modalImg.src = "diagram Malheude Lucas.drawio.png"; 
    }

    modal.classList.add("show");
  });
}

// --- 3. Fermeture ---
function closeModal() {
  modal.classList.remove("show");
  setTimeout(() => {
     if(modalImg) modalImg.src = ""; 
  }, 300);
}

document.getElementById("modal-close").addEventListener("click", closeModal);

document.getElementById("modal").addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});