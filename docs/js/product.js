"use strict";

/**
 * Récupération du paramètre id de l'url
 * @returns {string}
 */
function getProductId() {
        const urlParams = new URLSearchParams(location.search); // récupération des paramètres de l'url
        return urlParams.get("id"); // renvoie l'id du produit indiqué dans l'url
}

/**
 * Requête Ajax pour récupérer les données du produit
 * @param id
 * @returns {Promise<any>}
 */
async function getProduct(id) {
    // bloc testé
    try {
        const request = await fetch("http://localhost:3000/api/teddies/" + id); // requête Ajax
        if (!request.ok) {
            alert('Erreur HTTP ' + request.status); // affichage erreur si code HTTP différent de 200 à 299
        }
        return request.json(); // analyse, conversion et renvoi du JSON en objet
    }
    // gestion des erreurs
    catch(err) {
        alert(err); // affichage des erreurs éventuelles
    }
}

/**
 * Affichage du produit
 * @param product
 */
function displayProduct(product) {
    /**
     * product
     * @type {{name: string, price: number, colors: string, description: string, imageUrl: string}}
     */
    document.getElementById("breadcrumb").innerText = product.name;
    document.getElementById("name").innerText = product.name;
    document.getElementById("description").innerText = product.description;
    document.getElementById("price").innerText = (product.price / 100).toFixed(2);
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

/**
 * Ajout au panier
 * @param event
 * @param id
 */
function addToCart(event, id) {
    const optionsSelector = document.getElementById("options");
    const optionIndex = optionsSelector.options[optionsSelector.selectedIndex].index;
    const imgUrl = document.getElementById("img").getAttribute("src");
    const name = document.getElementById("name").textContent;
    const option = optionsSelector.options[optionsSelector.selectedIndex].textContent;
    const quantity = parseInt(document.getElementById("qty").value); //valeur numérique
    const price = document.getElementById("price").textContent;
    /**
     * Objet produit ajouté au panier
     * @type {{quantity: number, id: string, option: string}}
     */
    const productAdd = {
        id: id,
        imgUrl: imgUrl,
        name: name,
        option: option,
        quantity: quantity,
        price: price,
    }
    const optionId = option.replaceAll(" ", "");

    if (!(optionIndex === 0) && (quantity > 0)) { // on teste si une option est sélectionnée et que la quantité ne soit pas null
        event.preventDefault();
        if (localStorage.getItem( 'cart' + id + optionId)) { // si la clé existe déjà alors il faut mettre à jour la quantité
            const productUpdate = JSON.parse(localStorage.getItem('cart' + id + optionId)); // on récupère et converti les données déjà enregistrées en objet
            productUpdate.quantity += productAdd.quantity; // on ajoute la nouvelle quantité
            localStorage.setItem('cart' + id + optionId, JSON.stringify(productUpdate)); // on écrase les données avec la nouvelle quantité
            showInfo(quantity);
            setTimeout(hideInfo, 3000);
        }
        else {
            localStorage.setItem('cart' + id + optionId, JSON.stringify(productAdd)); // on stocke l'id unique et l'objet productAdd converti en string
            showInfo(quantity);
            setTimeout(hideInfo, 3000);
        }
    }
}

/**
 * Affichage du message d'ajout au panier
 * @param quantity
 */
function showInfo(quantity) {
    document.getElementById("info").innerText = "Produit ajouté au panier - quantité : +" + quantity;
    document.getElementById("info").classList.replace("info__hide", "info__show");
}

/**
 * Masquer le message d'ajout au panier
 */
function hideInfo() {
    document.getElementById("info").classList.replace("info__show", "info__hide");
}

/**
 * Fonction maître
 * @returns {Promise<void>}
 */
async function main() {
    const id = getProductId();
    const product = await getProduct(id);
    displayProduct(product);
    document.getElementById("add-to-cart").addEventListener("click", function(event) { addToCart(event, id) });
}
main();