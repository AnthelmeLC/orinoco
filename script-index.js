//fonction de création de la page HTML index
function indexBuild(productsList) {
    let cardsSection = document.getElementById("cards");
    for (let product of productsList) {
        let newCard = document.createElement("article");
        newCard.innerHTML = `<img src="${product.imageUrl}" width=300px>
                            <div>
                                <h3>${product.name}</h3>
                                <p>${product.description}</p>
                                <a href="./product.html?id=${product._id}"><div class="btn btn-primary">Voir le produit</div></a>
                            </div>`;

        cardsSection.appendChild(newCard);
    }
}

//fonction de création de la page HTML product
function productBuild(product){
    let productSection = document.getElementById("product");

    productSection.innerHTML =  `<img src="${product.imageUrl}" width=600px>
                                <div>
                                    <h2>${product.name}</h2>
                                    <p>${product.description}</p>
                                    <p>Prix : ${product.price / 100}€</p>
                                    <div>
                                        <label>Choix des couleurs : </label>
                                        <select id="productChoices"></select>
                                    </div>
                                    <a id="addToCart"><div class="btn btn-primary">Ajouter au panier</div></a>
                                </div>`;

    let newColors = document.getElementById("productChoices");
    for(let choice of product.colors){
            let newChoice = document.createElement("option");
            newChoice.innerHTML = choice
            newChoice.setAttribute("value", choice);
            newColors.appendChild(newChoice);
    }
}

//vérification d'être dans la page index + requête pour récupérer les infos des produits + création de la page index
if (document.getElementById("cards")) {
    fetch("http://localhost:3000/api/teddies/")
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (myJson) {
                indexBuild(myJson);
            });
        } else {
            console.log("Mauvaise réponse du réseau");
        }
    })
    .catch(function (error) {
        console.log("il y a eu un problème avec l\'opération fetch: " + error.message);
    });
}

//vérification d'être dans la page product + requête pour récupérer les infos du produit + création de la page product
if (document.getElementById("product")) {   
    let currentProduct = window.location.search.substring(4);
    fetch("http://localhost:3000/api/teddies/"+currentProduct)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (myJson) {
                productBuild(myJson);
            });
        } else {
            console.log("Mauvaise réponse du réseau");
        }
    })
    .catch(function (error) {
        console.log("il y a eu un problème avec l\'opération fetch: " + error.message);
    });
}