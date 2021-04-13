// récupération du paramètre id de l'url
async function getProductId() {
    const urlParams = new URLSearchParams(location.search); // récupération des paramètres de l'url
    return urlParams.get("id"); // renvoie l'id du produit indiqué dans l'url
}







// requête Ajax pour récupérer les données du produit
async function getProductObject() {
    const id = await getProductId();
    let request = new XMLHttpRequest();
    request.open("GET", "http://localhost:3000/api/teddies/" + id);
    request.send();
    request.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            let product = JSON.parse(this.responseText);
        }
    }
}
getProductObject();




// affichage des données produit (breadcrumb, titre, image, description, prix)







// gestion du clic sur bouton add to cart (données produit + quantité ---> plusieurs produits possibles)