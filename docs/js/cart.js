"use strict";

import {euro} from "./modules.js";

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
            <a href="product.html?id=${id}">
                <img src="${imgUrl}" class="product__img--thumbnail rounded" alt="${name} - ours en peluche fait main" title="${name} - ours en peluche fait main" width="75" height="75"/>
            </a>
        </td>
        <td class="align-middle">
            <a href="product.html?id=${id}">${name} couleur ${option}</a>
        </td>
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
    cartContainer.classList.add("bg-warning", "text-center", "p-2", "font-weight-bolder", "rounded");
    cartContainer.classList.remove("row");
    cartContainer.innerText = "Votre panier est vide.";
    document.getElementById("order").disabled = true; // disable submit order button
}

/**
 * Add eventListeners on :
 *      - quantity inputs
 *      - remove buttons
 *      - empty button
 *      - form inputs
 *      - inputs notices toggles
 *      - inputs notices
 */
function addEventsListeners() {
    if (localStorage.getItem("total")) { // test if cart isn't empty
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
    }

    const formInputs = document.forms["contact"].elements; // array of inputs in form named "contact"
    for (let formInput of formInputs) {
        formInput.addEventListener("input", inputsValidation);
        formInput.addEventListener("invalid", showInputError);
        formInput.addEventListener("change", hideNoticeOnChange); // change as focusout or blur makes JS errors when clic on toggle
    }

    const inputsNoticesToggles = document.getElementsByClassName("notice__toggle");
    for (let inputNoticeToggle of inputsNoticesToggles) {
        inputNoticeToggle.addEventListener("click", toggleInputNotice);
    }

    const inputsNotices = document.getElementsByClassName("notice");
    for (let inputNotice of inputsNotices) {
        inputNotice.addEventListener("click", hideNoticeOnClick );
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
    productUpdate.quantity = Number(event.target.value); // new quantity overwrite the old one
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

/**
 * Check validity of inputs (to use with custom error messages)
 * @param event
 */
function inputsValidation(event) {
    event.target.setCustomValidity(""); // error message reset otherwise input is not validated
    event.target.checkValidity(); // true or false
}

/**
 * Display custom error messages if inputs are not valid
 * @param event
 */
function showInputError(event) {
    const input = event.target;
    if (input.validity.valueMissing) {
        input.setCustomValidity("Obligatoire");
    }
    else if (input.validity.tooLong) {
        input.setCustomValidity(`Ne doit pas dépasser ${input.maxLength} caractères`)
    }
    else if (input.validity.tooShort) {
        input.setCustomValidity(`Au minimum ${input.minLength} caractères`)
    }
    else if (input.validity.patternMismatch) {
        input.setCustomValidity(`Veuillez vérifier les critères de saisie`)
    }
    else {
        input.setCustomValidity("Veuillez vérifier votre saisie");
    }
}

/**
 * Toggle input notice
 * @param event
 */
function toggleInputNotice(event) {
    const notice = event.target.nextElementSibling; // select span.notice
    event.target.classList.toggle("bg-warning");
    notice.classList.toggle("notice--active");
}

/**
 * Hide input notice when clicked
 * @param event
 */
function hideNoticeOnClick(event) {
    const toggle = event.target.previousElementSibling;
    const notice = event.target;
    hideNotice(toggle, notice);
}

/**
 * Hide input notice when input focus is out (change)
 * @param event
 */
function hideNoticeOnChange(event) {
    const toggle = event.target.nextElementSibling; // select toggle btn
    const notice = event.target.nextElementSibling.nextElementSibling; // select span.notice **** A REVOIR ****
    hideNotice(toggle, notice);
}

/**
 * Hide input notice
 * @param toggle
 * @param notice
 */
function hideNotice(toggle, notice) {
    toggle.classList.remove("bg-warning");
    notice.classList.remove("notice--active");
}

/**
 * Prepare products ids array
 * @returns {*[]}
 */
function getProductsIds() {
    let products = [];
    const keys = Object.keys(localStorage); // we get the list of keys in an array
    for (let key of keys) { // loop to test each key if it's related to cart
        if (key.startsWith("cart")) {
            const product = JSON.parse(localStorage.getItem(key)); // get and convert JSON to object
            products.push(product.id); // add product id to array
        }
    }
    return products;
}


/**
 * Send order and redirection to confirmation page
 * @param event
 */
async function order(event) {
    event.preventDefault(); // prevent default submit
    const products = getProductsIds(); // get array of products ids
    const form = document.forms["contact"];
    /**
     * Contact object
     * @type {{firstName: string, lastName: string, address: string, city: string, email: string}}
     */
    const contact = { // get contact info and create contact object
        firstName: form.elements.firstName.value,
        lastName: form.elements.lastName.value,
        address: form.elements.address.value,
        city: form.elements.city.value,
        email: form.elements.email.value
    }
    const json = JSON.stringify({contact, products}); // prepare json to send with post request
    const orderConfirmation = await requestOrder(json); // object returned by the server
    localStorage.setItem("order", JSON.stringify(orderConfirmation)); // store orderConfirmation
    document.location.href = "confirmation.html"; // redirect to confirmation page
}


/**
 * Order POST request
 * @param json
 * @returns {Promise<Promise<any>|void>}
 */
async function requestOrder(json) {
    // tested block
    try {
        const postRequest = await fetch("http://localhost:3000/api/teddies/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: json
        });
        return postRequest.ok ? postRequest.json() : alert("Erreur HTTP " + postRequest.status); // if ok return object from json, else alert error
    }
        // error handling
    catch (err) {
        alert(err);
    }
}


/**
 * Master function
 */
function main() {
    const products = getStoredProducts();
    displayCartRows(products);
    addEventsListeners();
    document.getElementById("contact").addEventListener("submit", order); // when order submit button is clicked
}

main();

