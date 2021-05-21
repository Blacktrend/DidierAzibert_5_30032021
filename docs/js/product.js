"use strict";

import {quantityInCart} from "./modules.js";

/**
 * Retrieving the url id parameter
 * @returns {string}
 */
function getProductId() {
    const urlParams = new URLSearchParams(location.search); // url parameters recovery
    console.log(urlParams.get("id")); // pour test
    return urlParams.get("id"); // returns product id from url
}

/**
 * Ajax request to retrieve product data
 * @param id
 * @returns {Promise<any>}
 */
async function getProduct(id) {
    // tested block
    try {
        const request = await fetch("http://localhost:3000/api/teddies/" + id); // Ajax request
        if (!request.ok) {
            alert("Erreur HTTP " + request.status); // display error if HTTP code different from 200 to 299
        }
        return request.json(); // parsing, conversion and return JSON to object
    }
        // error handling
    catch (err) {
        alert(err);
    }
}

/**
 * Product display
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
    console.log(product); // pour test
    const selectOptions = document.getElementById("options");
    const colors = product.colors;
    for (let color of colors) { // loop on options to display
        const option = new Option(color, color);
        selectOptions.append(option);
    }
}


/**
 * Add to cart
 * @param event
 * @param id
 */
function addToCart(event, id) {
    const optionsSelector = document.getElementById("options");
    const optionIndex = optionsSelector.selectedIndex;
    const imgUrl = document.getElementById("img").getAttribute("src");
    const name = document.getElementById("name").textContent;
    const option = optionsSelector.options[optionsSelector.selectedIndex].textContent;
    const quantity = parseInt(document.getElementById("qty").value); // numeric value
    const price = Number(document.getElementById("price").textContent); // conversion to number
    const optionId = option.replaceAll(" ", ""); // spaces removal
    const subTotal = quantity * price;
    /**
     * Item added to cart object = will be stored in localStorage
     * @type {{id: string, imgUrl: string, name: string, option: string, quantity: number, price: number, subTotal: number}}
     */
    const productAdd = {
        id,
        imgUrl,
        name,
        option,
        quantity,
        price,
        subTotal
    }
    console.log(productAdd);

    if (optionIndex && quantity) { // test if option selected (index>0) and quantity >0
        event.preventDefault();
        if (localStorage.getItem('cart' + id + optionId)) { // if key already exists then update quantity
            const productUpdate = JSON.parse(localStorage.getItem('cart' + id + optionId)); // retrieval and conversion of previously recorded data
            productUpdate.quantity += productAdd.quantity; // add new quantity
            localStorage.setItem('cart' + id + optionId, JSON.stringify(productUpdate)); // overwrite data with new quantity
            showInfo(quantity);
            setTimeout(hideInfo, 3000);
        } else {
            localStorage.setItem('cart' + id + optionId, JSON.stringify(productAdd)); // store unique id and productAdd object converted to string
            showInfo(quantity);
            setTimeout(hideInfo, 3000);
        }
        quantityInCart(); // update counter
    }
}


/**
 * Display add to cart message
 * @param quantity
 */
function showInfo(quantity) {
    document.getElementById("info").innerHTML = `<p class="m-0">Produit ajouté au panier - quantité : ${quantity}</p>
<a href="cart.html"><button type='button' class='btn btn-primary text-uppercase font-weight-bold small'>Voir le panier</button></a>`;
    document.getElementById("info").classList.replace("info--hide", "info--show");
}

/**
 * Hide add to cart message after delay
 */
function hideInfo() {
    document.getElementById("info").classList.replace("info--show", "info--hide");
}

/**
 * Update quantity badge when storage event triggered
 * (something added to cart on another tab or quantity changed)
 */
function listenOtherTab() {
    window.addEventListener("storage", event => {
        if (event.storageArea === localStorage && event.key.startsWith("cart")) {
            quantityInCart();
        }
    })
}


/**
 * Master function
 * @returns {Promise<void>}
 */
async function main() {
    const id = getProductId();
    const product = await getProduct(id);
    displayProduct(product);
    quantityInCart();
    document.getElementById("add-to-cart").addEventListener("click", event => addToCart(event, id));
    listenOtherTab();
}

main();