/* création d'une requête Ajax pour
 * récupérer la liste des ours en peluche
*/
let request = new XMLHttpRequest();
request.open("GET", "http://localhost:3000/api/teddies/"); // méthode GET depuis l'url de l'api correspondante
request.send();
request.onreadystatechange = function() { // fonction appelée à chaque changement d'état de la requête
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) { // test si la requête est terminée et si le code http renvoyé est OK
        let results = JSON.parse(this.responseText); // réponse de l'API convertie en objet JS
        let container = document.getElementById("cards"); // on cible le div qui contiendra les vignettes

        for (let result of results) { // boucle pour afficher chaque vignette selon le nombre de produits
            let id = result._id; // récupération des données utiles pour chaque produit
            let imgUrl = result.imageUrl;
            let name = result.name;
            let price = (result.price / 100).toFixed(2) + "€"; // mise en forme du prix
            let description = result.description;
            let card = document.createElement("div"); // création du div vignette
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
};