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
        cartIsEmpty();
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
            container.append(row); // add new row to table
            total += subTotal; // order total calculation
        }
        document.getElementById("total").innerText = euro.format(total); // application of the currency format
        localStorage.setItem('total', String(total)); // store cart total for later use
    }
}


/**
 * Message info if cart is empty
 */
function cartIsEmpty() {
    const cartContainer = document.getElementById("cart-container");
    cartContainer.classList.add("bg-warning", "text-center", "p-2", "font-weight-bolder");
    cartContainer.classList.remove("row");
    cartContainer.innerText = "Votre panier est vide.";
    document.getElementById("order").disabled = true; // disable submit order button
}

/**
 * Add eventListeners on quantity inputs, remove buttons, empty button and form inputs
 */
function addEventsListeners() {
    const quantityInputs = document.getElementsByClassName("cart-quantity"); // array of quantity inputs
    for (let input of quantityInputs) {
        input.addEventListener("change", updateQuantity);
    }
    const removeButtons = document.getElementsByClassName("remove-btn");
    for (let remove of removeButtons) {
        remove.addEventListener("click", removeProduct);
    }
    const emptyButton = document.getElementById("empty-btn");
    emptyButton.addEventListener("click", emptyCart);
    const formInputs = document.forms["contact"].elements["form-inputs"]; // array of inputs named "inputs" in form named "contact"
    for (let formInput of formInputs) {
        formInput.addEventListener("input", inputsValidation);
        formInput.addEventListener("invalid", showInputError);
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

/**
 * Manage remove product buttons
 * @param event
 */
function removeProduct(event) {
    const row = event.target.closest("tr"); // get table row to delete
    const key = row.querySelector("input").id; // get id of first input in the row = localStorage key
    const subTotal = JSON.parse(localStorage.getItem(key)).subTotal;
    const newTotal = +localStorage.getItem("total") - subTotal; // new total calculation
    document.getElementById("total").innerText = euro.format(newTotal); // display new total
    localStorage.setItem("total", String(newTotal)); // store new total
    localStorage.removeItem(key); // remove in localStorage
    row.remove(); // remove row from display
    if (newTotal ===0) {
        localStorage.removeItem("total");
        cartIsEmpty();
    }
}

/**
 * Manage empty cart button
 */
function emptyCart() {
    const keys = Object.keys(localStorage); // we get the list of keys in an array
    for (let key of keys) { // loop to test each key if it's related to cart
        if (key.startsWith("cart")) {
            localStorage.removeItem(key);
        }
    }
    localStorage.removeItem("total");
    cartIsEmpty();
}

function inputsValidation(event) {
    event.target.setCustomValidity(""); // error message reset otherwise input is not validated
    event.target.checkValidity(); // true or false
}

function showInputError(event) { // *** personnaliser les messages en fonction du type d'erreur ---> utiliser case switch plutôt que if ***
    if (event.target.validity.valueMissing) {
        event.target.setCustomValidity("Obligatoire !");
    }
    else {
        event.target.setCustomValidity("Oups...erreur !");
    }


}


/**
 * Prepare products ids array
 * @returns {*[]}
 */
function getProductsIds() {
    let productsIds = [];
    const keys = Object.keys(localStorage); // we get the list of keys in an array
    for (let key of keys) { // loop to test each key if it's related to cart
        if (key.startsWith("cart")) {
            const product = JSON.parse(localStorage.getItem(key)); // get and convert JSON to object
            productsIds.push(product.id); // add product id to array
        }
    }
    return productsIds;
}


function contactObject() {

}


// send request post with contact object and product_ids array
function order(event) {
    event.preventDefault(); // we don't want to submit but request instead
    const productsIds = getProductsIds(); // get array of products ids when order submit button is clicked (all changes done and form validated)
    console.log(productsIds);
    const contact = contactObject(); // get contact info
}


function main() {
    const products = getStoredProducts();
    displayCartRows(products);
    addEventsListeners();
    // event handling on submit order button only if it's enabled
    document.getElementById("contact").addEventListener("submit", order);
}

main();

