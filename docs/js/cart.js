"use strict";

/**
 * Récupérer les objets produits dans un array
 * @returns {*[]}
 */
function getStoredProducts() {
    let products = [];
    const keys = Object.keys(localStorage); // on récupère la liste des clés dans un array
    for (let key of keys) {
        if (key.startsWith("cart")) {
            const product = JSON.parse(localStorage.getItem(key));
            products.push(product);
        }
    }
    return products;
}

/**
 * Format monétaire
 * @type {Intl.NumberFormat}
 */
const euro = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: 'EUR',
    minimumFractionDigits: 2,
});


/**
 * Display cart rows with products data
 * @param products
 */
function displayCartRows(products) {
    const container = document.getElementById("cart-body");
    let total = 0;
    for (let product of products) {
        /**
         * product
         * @type {{id: string, imgUrl: string, name: string, option: string, price: number, quantity: number}}
         */
        const id = product.id;
        const imgUrl = product.imgUrl;
        const name = product.name;
        const option = product.option;
        const price = product.price;
        const quantity = product.quantity;
        const subTotal = price * quantity;
        const row = document.createElement("tr");
        const optionId = option.replaceAll(" ", "");

        row.innerHTML = `<td class="align-middle">
        <button type="button" class="remove-btn border-0 bg-transparent font-weight-bolder" aria-label="Remove product">X</button>
    </td>
    <td class="align-middle">
        <img src="${imgUrl}" class="product__img--thumbnail rounded" alt="${name} - ours en peluche fait main" title="${name} - ours en peluche fait main" width="75" height="75"/>
    </td>
    <td class="align-middle">${name} couleur ${option}</td>
    <td class="align-middle">${euro.format(price)}</td>
    <td class="align-middle">
        <label for="cart${id}${optionId}" class="mb-0 mt-2 pl-1 sr-only">Quantité</label>
        <input class="cart-quantity form-control mx-auto mx-lg-0 w-auto" type="number" id="cart${id}${optionId}" step="1" min="1" max="99" value="${quantity}" inputmode="numeric"/>
    </td>
    <td class="align-middle text-right">${euro.format(subTotal)}</td>`;
        container.appendChild(row);
        total += subTotal;
    }
    document.getElementById("total").innerText = euro.format(total);
}


// manage quantity
function quantityEventListeners() {
    const quantityInputs = document.getElementsByClassName("cart-quantity"); // array of quantity inputs
    for (let input of quantityInputs) {
        input.addEventListener("change", updateQuantity); // add event handler on each quantity input
    }
}


function updateQuantity(event) {
    if (!event.target.validity.valid) { // quantity = 1 by default if not valid
        event.target.value = 1;
    }
    const productUpdate = JSON.parse(localStorage.getItem(event.target.id));
    productUpdate.quantity = event.target.value; // new quantity overwrite the old one
    localStorage.setItem(event.target.id, JSON.stringify(productUpdate)); // update localStorage
    const parentTd = event.target.parentElement;
    const siblingSubTotal = parentTd.nextElementSibling;
    /**
     * reprendre ici pour récupérer en négatif l'ancien sous-total, puis afficher le nouveau sous-total et l'ajouter en positif
     * à l'ancien sous-total, puis ajouter ce résultat au total
     * @type {number}
     */
    let subTotal = - (Number(siblingSubTotal.innerText.replace(/[^0-9.]/g, ""))); // get old
    siblingSubTotal.innerText = euro.format(productUpdate.price * productUpdate.quantity);
}


// préparer l'array products

// manage remove product and empty cart

// manage quantity

// data validation + préparation objet contact

// send request post

function main() {
    const products = getStoredProducts();
    displayCartRows(products);
    quantityEventListeners();
}
main();

