/**
 * requête Ajax pour récupérer la liste des produits
 */
function getProducts() {
    const request = new XMLHttpRequest();
    request.open("GET", "http://localhost:3000/api/teddies/"); // méthode GET depuis l'url de l'api correspondante
    request.send();
    request.onreadystatechange = function () { // fonction appelée à chaque changement d'état de la requête
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) { // test si la requête est terminée et si le code http renvoyé est OK
            const results = JSON.parse(this.responseText); // réponse de l'API convertie en objet JS
            displayProducts(results);
        }
    };
}

function displayProducts(products) {
    const container = document.getElementById("cards"); // on cible le div qui contiendra les vignettes

    for (let product of products) { // boucle pour afficher chaque vignette selon le nombre de produits
        /**
         * product
         * @type {{_id: string, imageURL: string, name: string, price: number, description: string}}
         */
        const id = product._id; // récupération des données utiles pour chaque produit
        const imgUrl = product.imageUrl;
        const name = product.name;
        const price = (product.price / 100).toFixed(2) + "€"; // mise en forme du prix
        const description = product.description;
        const card = document.createElement("div"); // création du div vignette
        card.classList.add("col-11", "col-sm-5", "col-lg-3", "card", "m-2", "py-3"); // ajout des classes Bootstrap

        // ajout du contenu de la vignette en utilisant la syntaxe des template literals
        card.innerHTML = `<img src="${imgUrl}" class="card-img-top" alt="${description}"/>
    <div class="card-body d-flex flex-column justify-content-end">
        <h2 class="card-title">${name}</h2>
        <p class="card-text"><span class="font-weight-bold">${price}</span></p>
        <a href="product.html?id=${id}" class="btn btn-primary">VOIR</a>
    </div>`;
        container.appendChild(card); // ajout de la vignette au div conteneur
    }
}

getProducts();