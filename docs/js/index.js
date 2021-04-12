/* création d'une requête Ajax pour
 * récupérer la liste des ours en peluche
*/
let request = new XMLHttpRequest();
request.open("GET", "http://localhost:3000/api/teddies/"); // méthode GET depuis l'url de l'api correspondante
request.send();
request.onreadystatechange = function() { // la fonction est appelée à chaque changement d'état de la requête
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) { // on teste si la requête est terminée et si le code http renvoyé est OK
        let results = JSON.parse(this.responseText); // la réponse de l'API est convertie en objet JS
        /*console.log(results);*/
        let container = document.getElementById("cards"); // on cible le div qui contiendra les vignettes

        for (let result of results) {
            let id = result._id;
            let imgUrl = result.imageUrl;
            let name = result.name;
            let price = result.price;
            let description = result.description;
            let card = document.createElement("div");
            card.classList.add("clo-3", "card", "m-2");

            card.innerHTML = `<img src="${imgUrl}" class="card-img-top" alt="${description}"/>
<div class="card-body">
    <h2 class="card-title">${name}</h2>
    <p class="card-text"><span class="font-weight-bold">${price}</span></p>
    <a href="product.html?id=${id}" class="btn btn-primary">VOIR</a>
</div>`;
            container.appendChild(card);
        }
    }
    else {
        alert('Une erreur inattendue s\'est produite, veuillez réessayer ultérieurement');
    }
};





/* écoute de l'évènement clic sur les vignettes
 * pour accéder à la page produit correspondante
 * avec les paramètres d'url
 */
