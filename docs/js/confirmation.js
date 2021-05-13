"use strict";

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
 * Display order infos
 */
function displayOrderInfos() {
    const order = JSON.parse(localStorage.getItem("order"));
    const total = +localStorage.getItem("total");
    document.getElementById("name").textContent = order.contact.firstName + " " + order.contact.lastName;
    document.getElementById("date").textContent = displayDate;
    document.getElementById("order-id").textContent = order.orderId;
    document.getElementById("total").textContent = euro.format(total);
}


/**
 * Display order date and time
 */
function displayDate() {
    const today = new Date();
    const date = today.getDate() + "/" + (today.getMonth()+1) + "/" + today.getFullYear();
    const time = today.getHours() + "h" + today.getMinutes();
    document.getElementById("date").textContent = date + " à " + time;
}


/**
 * Reset localStorage and redirect to home after delay
 */
function reset() {
    localStorage.clear();
    setTimeout(() => {document.location.href = "index.html";}, 8000); // redirect to home after 8s
}


function main() {
    displayOrderInfos();
    displayDate();
    reset();
}

main();