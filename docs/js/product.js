"use strict";

/**
 * Retrieving the url id parameter
 * @returns {string}
 */
function getProductId() {
        const urlParams = new URLSearchParams(location.search); // recovery of the url parameters
        return urlParams.get("id"); // returns the product id indicated in the url
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
            alert('Erreur HTTP ' + request.status); // display error if HTTP code different from 200 to 299
        }
        return request.json(); // parsing, conversion and return of JSON to object
    }
    // error handling
    catch(err) {
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
    const selectOptions = document.getElementById("options");
    const colors = product.colors;
    for (let color of colors) { // loop on the options to display them
        const option = document.createElement("option");
        option.innerText = color;
        option.setAttribute("value", color);
        selectOptions.appendChild(option);
    }
}

/**
 * Add to cart
 * @param event
 * @param id
 */
function addToCart(event, id) {
    const optionsSelector = document.getElementById("options");
    const optionIndex = optionsSelector.options[optionsSelector.selectedIndex].index;
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
        id: id,
        imgUrl: imgUrl,
        name: name,
        option: option,
        quantity: quantity,
        price: price,
        subTotal: subTotal
    }

    if (!(optionIndex === 0) && (quantity > 0)) { // test if option selected and quantity not null.
        event.preventDefault();
        if (localStorage.getItem( 'cart' + id + optionId)) { // if the key already exists then update the quantity
            const productUpdate = JSON.parse(localStorage.getItem('cart' + id + optionId)); // retrieval and conversion of previously recorded data
            productUpdate.quantity += productAdd.quantity; // add the new quantity
            localStorage.setItem('cart' + id + optionId, JSON.stringify(productUpdate)); // overwrite the data with the new quantity
            showInfo(quantity);
            setTimeout(hideInfo, 3000);
        }
        else {
            localStorage.setItem('cart' + id + optionId, JSON.stringify(productAdd)); // store the unique id and the productAdd object converted to a string
            showInfo(quantity);
            setTimeout(hideInfo, 3000);
        }
    }
}

/**
 * Display of the add to cart message
 * @param quantity
 */
function showInfo(quantity) {
    document.getElementById("info").innerText = "Produit ajouté au panier - quantité : +" + quantity;
    document.getElementById("info").classList.replace("info__hide", "info__show");
}

/**
 * Hide add to cart message after delay
 */
function hideInfo() {
    document.getElementById("info").classList.replace("info__show", "info__hide");
}

/**
 * Master function
 * @returns {Promise<void>}
 */
async function main() {
    const id = getProductId();
    const product = await getProduct(id);
    displayProduct(product);
    document.getElementById("add-to-cart").addEventListener("click", function(event) { addToCart(event, id) });
}
main();