"use strict";

/**
 * Currency format
 * @type {Intl.NumberFormat}
 */
export const euro = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});


/**
 * Total quantity in cart (badge)
 */
export function quantityInCart() {
    let totalQuantity = 0;
    const keys = Object.keys(localStorage); // we get the list of keys in an array
    for (let key of keys) { // loop to test each key if it's related to cart
        if (key.startsWith("cart")) {
            const product = JSON.parse(localStorage.getItem(key)); // get and convert JSON to object
            totalQuantity += product.quantity;
        }
    }
    if (totalQuantity >0) {
        const counter = document.getElementById("counter");
        counter.textContent = String(totalQuantity);
        counter.classList.add("bg-danger");
    }
}