const livreContainer = document.getElementById('livre');

// recuperation du contenu des pages
const requete = new XMLHttpRequest();
requete.open("GET", "pages.json", false); // false = synchrone : le script attend la réponse
requete.send();
const pages = JSON.parse(requete.responseText).pages;


// creer une page
function creerPage(pageNumber) {

    let page = document.createElement("div");
    page.classList.add('page')
    livreContainer.append(page);

    Object.keys(pages[pageNumber]).forEach(key => {
        if (key.startsWith('paragraphe')) {
            let paragrapheContainer = document.createElement("div");

            if (key === "paragraphe1") {
                let premiereLettre = document.createElement('span')
                premiereLettre.classList.add('premiereLettre');
                premiereLettre.textContent = pages[pageNumber]["premiereLettre"];
                paragrapheContainer.append(premiereLettre);
            }

            let paragraphe = pages[pageNumber][key]
            let paragrapheLignes = paragraphe.split("|");
            animerTexte(paragrapheContainer, paragrapheLignes)
            page.append(paragrapheContainer);
        }
    });

}
creerPage(0)


// animation du texte (en gros j'ecris avec une plume)
async function animerTexte(paragrapheContainer, paragrapheContent) {
    const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    let plume = document.createElement("img");
    plume.src = "assets/plume.png";
    plume.className = "plume";

    let ancre = document.createElement("span");
    ancre.className = "ancre";
    ancre.append(plume);

    for (let ligne of paragrapheContent) {
        const p = document.createElement("p");
        paragrapheContainer.append(p);
        p.append(ancre)
        await pause(600);
        for (const lettre of ligne) {
            ancre.before(lettre)
            await pause(80);
        }
        await pause(200);
    }

    ancre.remove();
}