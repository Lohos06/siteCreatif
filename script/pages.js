// recuperation du contenu des pages
const livreContainer = document.getElementById('livre');
let demandePage = null
let pages = null

async function recupererPages() {
    demandePage = await fetch("pages.json");
    pages = await demandePage.json();

    console.log(pages);
}
recupererPages();



// animation du texte (en gros j'ecris avec une plume)
const lignes = ["Première ligne", "Deuxième ligne", "Troisième ligne"];
const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const plume = document.createElement("img");
plume.src = "assets/plume.png";
plume.className = "plume";

const ancre = document.createElement("span");
ancre.className = "ancre";
ancre.append(plume);

async function animerTexte() {
    const conteneur = document.getElementById("texte");

    for (const ligne of lignes) {
        const p = document.createElement("p");
        const span = document.createElement("span");
        p.append(span, ancre);
        conteneur.append(p);

        await pause(600);

        for (const lettre of ligne) {
            span.textContent += lettre;
            await pause(80);
        }

        await pause(800);
    }

    ancre.remove();
}

animerTexte();