const livreContainer = document.getElementById('livre');

const TIME_BETWEEN_LETTERS = 100;
const TIME_BETWEEN_LINES = 500;
const PAGE_TURN_COOLDOWN = 500;

const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let pages = null;
let nombreDeFeuilles = null;
let feuilles = null;
let progression = 0;
let verrou = false;

// charger les pages
async function chargerPages() {
    const pageRequete = await fetch("pages.json")
    const pagesData = await pageRequete.json();
    return pagesData.pages
}

// creer les elements du livre
function creerFeuilles() {
    for (let i = 0; i < nombreDeFeuilles; i++) {
        const idRecto = i * 2;
        const idVerso = i * 2 + 1;

        const feuille = document.createElement('div');
        feuille.id = `feuille-${i}`;
        feuille.classList.add('feuille');
        feuille.style.setProperty("--z-ferme", nombreDeFeuilles - i);
        feuille.style.setProperty("--z-tourne", i + 1);
        livreContainer.append(feuille);

        creerPage(idRecto, feuille);
        if (idVerso < pages.length) {
            creerPage(idVerso, feuille, true);
        }
    }
}
function creerPage(pageNumber, feuille, verso = false) {

    // creation de la div de la page
    const page = document.createElement("div");
    page.classList.add('page')
    if (verso) {
        page.classList.add('verso')
    }
    feuille.append(page);

    // remplissage de la page
    const pageContent = pages[pageNumber];
    for (const key of Object.keys(pageContent)) {
        if (key.startsWith('paragraphe')) {
            page.append(creerParagraphe(pageContent, key));
        }
    }
}
function creerParagraphe(pageContent, key) {
    const paragrapheContainer = document.createElement("div");

    if (key === "paragraphe1") {
        const premiereLettre = document.createElement('span')
        premiereLettre.classList.add('premiereLettre');
        premiereLettre.textContent = pageContent["premiereLettre"];
        paragrapheContainer.append(premiereLettre);
    }

    const paragraphe = pageContent[key]
    const paragrapheLignes = paragraphe.split("|");
    animerTexte(paragrapheContainer, paragrapheLignes)
    return paragrapheContainer;
}

// animation du texte (en gros j'ecris avec une plume)
async function animerTexte(paragrapheContainer, paragrapheContent) {

    const plume = document.createElement("img");
    plume.src = "assets/plume.png";
    plume.className = "plume";

    const ancre = document.createElement("span");
    ancre.className = "ancre";
    ancre.append(plume);

    for (const ligne of paragrapheContent) {
        const p = document.createElement("p");
        paragrapheContainer.append(p);
        p.append(ancre)
        await pause(TIME_BETWEEN_LINES);
        for (const lettre of ligne) {
            ancre.before(lettre)
            await pause(TIME_BETWEEN_LETTERS);
        }
    }

    ancre.remove();
}
// mettre a jour l'etat des feuilles
function mettreAJour() {
    feuilles.forEach((feuille, i) => {
        feuille.classList.toggle('tournee', i < progression);
    })
}

async function init() {
    pages = await chargerPages();
    nombreDeFeuilles = Math.ceil(pages.length / 2)

    creerFeuilles();
    feuilles = document.querySelectorAll(".feuille")
}
init()

// interaction avec le livre

document.addEventListener("wheel", (event) => {

    if (verrou) return;
    verrou = true;
    setTimeout(() => {verrou = false;}, PAGE_TURN_COOLDOWN);

    progression += event.deltaY > 0 ? 1 : -1

    progression = Math.max(0, Math.min(progression, nombreDeFeuilles - 1));
    mettreAJour();
});
