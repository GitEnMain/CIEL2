const boutonAide = document.getElementById('bouton-aide');
const toutesLesCartes = document.querySelectorAll('.carte');

boutonAide.addEventListener('click', () => {
    alert("Click on a card to see details about the risk.");
});

toutesLesCartes.forEach(uneCarte => {
    uneCarte.addEventListener('click', () => {
        
        toutesLesCartes.forEach(autreCarte => {
            if (autreCarte !== uneCarte) {
                autreCarte.classList.remove('active');
            }
        });

        uneCarte.classList.toggle('active');
    });
});