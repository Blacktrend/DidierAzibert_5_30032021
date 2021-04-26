"use strict";

/**
 * récupération du paramètre id de l'url
 * @returns {string}
 */
function getProductId() {
        const urlParams = new URLSearchParams(location.search); // récupération des paramètres de l'url
        return urlParams.get("id"); // renvoie l'id du produit indiqué dans l'url
}

/**
 * requête Ajax pour récupérer les données du produit
 */
async function getProduct() {
    const id = getProductId();
    const request = await fetch("http://localhost:3000/api/teddies/" + id);
    if (request.ok) { // valide si code HTTP entre 200 et 299
        const product = await request.json(); // récupération et conversion du JSON en objet quand la promesse est résolue
        displayProduct(product); // appel de la fonction pur afficher les données du produit
    } else {
        alert("Erreur HTTP " + request.status); // affichage de l'erreur si le status n'est pas ok
    }
}


function displayProduct(product) {
    /**
     * product
     * @type {{name: string, price: number, colors: string, description: string, imageUrl: string}}
     */
    document.getElementById("breadcrumb").innerText = product.name;
    document.getElementById("name").innerText = product.name;
    document.getElementById("description").innerText = product.description;
    document.getElementById("price").innerText = (product.price / 100).toFixed(2) + "€";
    document.getElementById("img").setAttribute("src", product.imageUrl);
    document.getElementById("img").setAttribute("alt", product.name + "- Ours en peluche fait main");
    document.getElementById("img").setAttribute("title", product.name + "- Ours en peluche fait main");
    const selectOptions = document.getElementById("options");
    const colors = product.colors;
    for (let color of colors) {
        const option = document.createElement("option");
        option.innerText = color;
        option.setAttribute("value", color);
        selectOptions.appendChild(option);
    }
}
getProduct().catch(alert);


// gestion du clic sur bouton add to cart (données produit + quantité ---> localStorage - plusieurs produits possibles)

/*const addToCartBtn = document.getElementById("add-to-cart");
addToCartBtn.addEventListener('click', addToCart);
function addToCart(e);
    if () {
        alert("Veuillez ...");
        e.preventDefault();
    }*/