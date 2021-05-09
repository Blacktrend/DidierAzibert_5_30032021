"use strict";

/**
 * Retrieving products objects in array
 * @returns {*[]}
 */
function getStoredProducts() {
    let products = [];
    const keys = Object.keys(localStorage); // we get the list of keys in an array
    for (let key of keys) { // loop to test each key if it's related to cart
        if (key.startsWith("cart")) {
            const product = JSON.parse(localStorage.getItem(key)); // get and convert JSON to object
            products.push(product); // add product object to products array
        }
    }
    return products;
}

/**
 * Currency format
 * @type {Intl.NumberFormat}
 */
const euro = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});


/**
 * Display cart rows with products data
 * @param products
 */
function displayCartRows(products) {
    const container = document.getElementById("cart-body");
    let total = 0;
    if (products.length === 0) { // if cart is empty
        const cartContainer = document.getElementById("cart-container");
        cartContainer.classList.add("bg-warning", "text-center", "p-2", "font-weight-bolder");
        cartContainer.classList.remove("row");
        cartContainer.innerText = "Votre panier est vide.";
    }
    else {

        for (let product of products) { // loop to display each product data in a table row
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

            // row content using template literals syntax. Quantity input id = localStorage id (useful for updateQuantity function)
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
            container.appendChild(row); // add new row to table
            total += subTotal; // order total calculation
        }
        document.getElementById("total").innerText = euro.format(total); // application of the currency format
        localStorage.setItem('total', String(total)); // store cart total for later use
    }
}


/**
 * Add eventListener on each quantity input
 */
function quantityEventListeners() {
    const quantityInputs = document.getElementsByClassName("cart-quantity"); // array of quantity inputs
    for (let input of quantityInputs) {
        input.addEventListener("change", updateQuantity);
    }
}

/**
 * Update quantities and totals in localStorage and display if any quantity input is modified
 * @param event
 */
function updateQuantity(event) {
    if (event.target.value <1) {
        event.target.value = 1; //  prevent null quantity, quantity = 1 by default
    }
    const productUpdate = JSON.parse(localStorage.getItem(event.target.id)); // use quantity input id = localStorage id
    productUpdate.quantity = event.target.value; // new quantity overwrite the old one
    const oldSubTotal = productUpdate.subTotal; // used in newTotal calculation
    productUpdate.subTotal = productUpdate.quantity * productUpdate.price; // new subTotal
    localStorage.setItem(event.target.id, JSON.stringify(productUpdate)); // update localStorage
    const parentTd = event.target.parentElement;
    const siblingSubTotal = parentTd.nextElementSibling;
    siblingSubTotal.innerText = euro.format(productUpdate.subTotal); // display the new subTotal
    const newTotal = +localStorage.getItem('total') - oldSubTotal + productUpdate.subTotal; // + for conversion to number = Number()
    document.getElementById("total").innerText = euro.format(newTotal);
    localStorage.setItem("total", String(newTotal));
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

