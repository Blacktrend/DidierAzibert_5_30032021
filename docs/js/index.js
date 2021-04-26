"use strict";

/**
 * récupération de la liste des produits
 * @returns {Promise<Response>}
 */
async function getProducts() {
    // bloc testé
    try {
        const request = await fetch("http://localhost:3000/api/teddies/"); // requête Ajax
        if (!request.ok) {
            alert('Erreur HTTP ' + request.status); // affichage erreur si code HTTP différent de 200 à 299
        }
        return request.json(); // analyse, conversion et renvoie du JSON en objet
    }
    // gestion des erreurs
    catch(err) {
        alert(err); // affichage des erreurs éventuelles
    }
}

/**
 * affichage la liste des produits
 * @param products
 */
function displayProducts(products) {
    const container = document.getElementById("cards"); // on cible le div qui contiendra les vignettes

    for (let product of products) { // boucle pour afficher chaque vignette selon le nombre de produits
        /**
         * product
         * @type {{_id: string, imageURL: string, name: string, price: number, description: string}}
         */
        const id = product._id;
        const imgUrl = product.imageUrl;
        const name = product.name;
        const price = (product.price / 100).toFixed(2) + "€"; // mise en forme du prix
        const description = product.description;
        const card = document.createElement("div"); // création du div vignette
        card.classList.add("col-11", "col-sm-5", "col-lg-3", "card", "m-2", "py-3"); // ajout des classes Bootstrap

        /**
         * contenu de la vignette en utilisant la syntaxe des template literals
         * avec l'id du produit en paramètre d'url
         */
        card.innerHTML = `<img src="${imgUrl}" class="card-img-top" alt="${description}"/>
    <div class="card-body d-flex flex-column justify-content-end">
        <h2 class="card-title">${name}</h2>
        <p class="card-text"><span class="font-weight-bold">${price}</span></p>
        <a href="product.html?id=${id}" class="btn btn-primary">VOIR</a>
    </div>`;
        container.appendChild(card); // ajout de la vignette au div conteneur
    }
}

getProducts().then(products => displayProducts(products)); // appel de getProducts() dont le résultat est passé à displayProducts()