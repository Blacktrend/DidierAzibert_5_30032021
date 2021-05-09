"use strict";

/**
 * retrieval of the product list
 * @returns {Promise<Response>}
 */
async function getProducts() {
    // tested block
    try {
        const request = await fetch("http://localhost:3000/api/teddies/"); // Ajax request
        if (!request.ok) {
            alert('Erreur HTTP ' + request.status); // display error if HTTP code different from 200 to 299
        }
        return request.json(); // parses, converts and returns JSON as an object
    }
    // error handling
    catch(err) {
        alert(err);
    }
}

/**
 * display products list
 * @param products
 */
function displayProducts(products) {
    const container = document.getElementById("cards"); // target the div that will contain the cards

    for (let product of products) { // loop to display each card according to the number of products
        /**
         * product
         * @type {{_id: string, imageURL: string, name: string, price: number, description: string}}
         */
        const id = product._id;
        const imgUrl = product.imageUrl;
        const name = product.name;
        const price = (product.price / 100).toFixed(2) + "€"; // price formatting
        const description = product.description;
        const card = document.createElement("div");
        card.classList.add("col-11", "col-sm-5", "col-lg-3", "card", "m-2", "py-3"); // add Bootstrap classes

        /**
         * card content using template literals syntax
         */
        card.innerHTML = `<img src="${imgUrl}" class="card-img-top" alt="${description}"/>
    <div class="card-body d-flex flex-column justify-content-end">
        <h2 class="card-title">${name}</h2>
        <p class="card-text"><span class="font-weight-bold">${price}</span></p>
        <a href="product.html?id=${id}" class="btn btn-primary">VOIR</a>
    </div>`; // product id added to url parameters
        container.appendChild(card); // add the new card to the container
    }
}

/**
 * Master function
 * @returns {Promise<void>}
 */
async function main() {
    const products = await getProducts();
    displayProducts(products);
}
main();