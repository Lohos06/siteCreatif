const livreContainer = document.getElementById('livre');

// recuperation du contenu des pages
const requete = new XMLHttpRequest();
requete.open("GET", "pages.json", false);
requete.send();
const pages = JSON.parse(requete.responseText).pages;
let nombreDeFeuilles = Math.ceil(pages.length / 2)

// creer les feuilles
function creerFeuilles() {

    for (let i = 0; i < nombreDeFeuilles; i++) {
        let feuille = document.createElement('div');
        feuille.id = "feuille-" + i;
        feuille.classList.add('feuille');
        feuille.style.setProperty("--z-ferme", nombreDeFeuilles - i);
        feuille.style.setProperty("--z-tourne", i + 1);
        livreContainer.append(feuille);

        creerPage(i * 2, feuille)
        if (i * 2 + 1 < pages.length) {
            creerPage(i * 2 + 1, feuille, "verso")
        }
    }
}
creerFeuilles();
const feuilles = document.  querySelectorAll(".feuille")

// creer une page
function creerPage(pageNumber, feuille, sens="recto") {

    let page = document.createElement("div");
    page.classList.add('page')

    if (sens === "verso") {
        page.classList.add('verso')
    }

    feuille.append(page);

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


// scroll des pages
let progression = 0;
let verroue = false

livreContainer.addEventListener("wheel", (event) => {

    if (verroue === true) {
        return;
    } else {
        verroue = true;
        setTimeout(() => {
            verroue = false;
        }, 1000);
    }

    if (event.deltaY > 0) {
        progression += 1;
    } else {
        progression -= 1;
    }

    progression = Math.max(0, Math.min(progression, nombreDeFeuilles -1));
    mettreAJour();
    console.log(progression);
});

// fonction pour dire si une page est tournée
function mettreAJour() {
    feuilles.forEach((feuille, i) => {
        feuille.classList.toggle('tournee', i < progression);
    })
}



