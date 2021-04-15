/**
 * récupération du paramètre id de l'url
 * @returns {string}
 */
function getProductId() {
    const urlParams = new URLSearchParams(location.search); // récupération des paramètres de l'url
    return urlParams.get("id"); // renvoie l'id du produit indiqué dans l'url
}

/**
 * requête Ajax pour récupérer les données du produit
 */
function getProductObject() {
    const id = getProductId();
    const request = new XMLHttpRequest();
    request.open("GET", "http://localhost:3000/api/teddies/" + id);
    request.send();
    request.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            /**
             * product
             * @type {{name: string, price: number, colors: string, description: string, imageUrl: string}}
             */
            const product = JSON.parse(this.responseText);
            document.getElementById("breadcrumb").innerText = product.name;
            document.getElementById("name").innerText = product.name;
            document.getElementById("description").innerText = product.description;
            document.getElementById("price").innerText = (product.price / 100).toFixed(2) + "€";
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
    }
}
getProductObject();


// gestion du clic sur bouton add to cart (données produit + quantité ---> localStorage - plusieurs produits possibles)
