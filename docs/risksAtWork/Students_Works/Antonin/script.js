// gestion oouverture cartes
function toggleCard(card) {
    // si carte déjà ouverte, on la ferme
    if (card.classList.contains('active')) {
        card.classList.remove('active');
        return;
    }

    // fermer autres cartes pour n'en avoir qu'une ouverte à la fois
    document.querySelectorAll('.card').forEach(c => {
        c.classList.remove('active');
    });
    
    // ouvrir la carte cliquée
    card.classList.add('active');
}