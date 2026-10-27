const livre = document.getElementById('livre');
const barre = document.getElementById('barre-progression-remplie');

function mettreAJourBarre() {
    const feuilles = livre.querySelectorAll('.feuille');
    const feuillesTournees = livre.querySelectorAll('.feuille.tournee');
    const maximum = feuilles.length - 1;
    const pourcentage = (feuillesTournees.length / maximum) * 100;

    barre.parentElement.style.setProperty('--p', pourcentage / 100);
}

livre.addEventListener('wheel', function () {
    setTimeout(mettreAJourBarre, 50);
});