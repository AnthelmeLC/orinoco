//fonction de création de la page HTML index
function indexBuild(productsList) {
    for (let product of productsList) {
        const newCard = document.createElement("article");
        newCard.innerHTML = `<img src="${product.imageUrl}" class="card-img-top">
                            <div class="card-body">
                                <h3 class="card-title">${product.name}</h3>
                                <p class="card-text">${product.description}</p>
                                <a href="./product.html?id=${product._id}"><div class="btn btn-primary">Voir le produit</div></a>
                            </div>`;
        newCard.setAttribute("class","card col-sm-8");
        const cardsSection = document.getElementById("cards");
        cardsSection.appendChild(newCard);
    }
}


//fonction de création de la page HTML product
function productBuild(product){
    const productSection = document.getElementById("product");
    productSection.innerHTML =  `<div class="card col-sm-10">
                                    <img src="${product.imageUrl}" class="card-img-top">
                                    <div class="card-body">
                                        <h2 class="card-title">${product.name}</h2>
                                        <p class="card-text">${product.description}</p>
                                        <p class="card-text">Prix : ${product.price / 100}€</p>
                                        <form>
                                            <div>
                                                <label>Choix des couleurs : </label>
                                                <select id="productChoices"></select>
                                            </div>
                                            <div>
                                                <label>Quantité : </label>
                                                <input id="productAmount" type="number" name="productAmount" min="1" value="1" required>
                                            </div>
                                            <button type="button" class="btn btn-primary" id="addToCart">Ajouter au panier</button>
                                        </form>
                                    </div>
                                </div>`;
    const newColors = document.getElementById("productChoices");
    for(let choice of product.colors){
        const newChoice = document.createElement("option");
        newChoice.innerHTML = choice
        newChoice.setAttribute("value", choice);
        newColors.appendChild(newChoice);
    }
    const addToCart = document.getElementById("addToCart");
    addToCart.addEventListener("click", function(){
        let inputAmount = parseInt(document.getElementById("productAmount").value);
        if(inputAmount<=0){
            alert("action impossible");
        }
        else{
            if(window.localStorage.getItem(product._id)){
                const actualAmount = parseInt(window.localStorage.getItem(product._id));
                inputAmount += actualAmount;
                window.localStorage.removeItem(product._id);
                window.localStorage.setItem(product._id,inputAmount);
                alert("Produit ajouté au panier");
            }
            else{
                window.localStorage.setItem(product._id, inputAmount);
                alert("Produit ajouté au panier");
            }
        }        
    });
}


//fonction de création de la page HTML cart
function cartBuild(cartList){
    const cartSection = document.getElementById("cart");
    let totalPrice = 0;
    if(window.localStorage.length == 0){
        cartSection.innerHTML = `<p>Votre panier est vide.</p>`;
    }
    else{
        for (let product of cartList) {
            if(window.localStorage.getItem(product._id)){
                const productAmount = parseInt(window.localStorage.getItem(product._id));
                const newCartProduct = document.createElement("article");
                newCartProduct.setAttribute("id", product._id);
                totalPrice += (product.price * productAmount /100);
                newCartProduct.innerHTML = `<img src="${product.imageUrl}" class="card-img-top">
                                            <div class="card-body">
                                                <h3 class="card-title">${product.name}</h3>
                                                <p class="card-text">Prix unitaire : ${product.price / 100}€</p>
                                                <p class="card-text">Nombre d'articles : ${productAmount}</p>
                                                <p class="card-text">Prix du lot : ${product.price * productAmount / 100}€</p>
                                                <div class="btn btn-primary" id="removeFromCart${product._id}">Retirer du panier</div>
                                            </div>`;
                newCartProduct.setAttribute("class", "card")
                const referenceNode = document.getElementById("resetCart");
                cartSection.insertBefore(newCartProduct , referenceNode);
                const removeFromCart = document.getElementById("removeFromCart" + product._id);
                removeFromCart.addEventListener("click",function(){
                    window.localStorage.removeItem(product._id);
                    window.location.reload(false);
                })
            }
        }
        const totalPriceDiv = document.createElement("p");
        totalPriceDiv.innerHTML = `Prix total de la commande : ${totalPrice}€`;
        cartSection.appendChild(totalPriceDiv);
        window.sessionStorage.clear();
        window.sessionStorage.setItem("totalPrice" , totalPrice);
    }
}

//fonction de création de la page HTML confirmation
function confirmationBuild(){
    const newConfirmation = document.createElement("div");
    newConfirmation.innerHTML = `<p>Orinoco vous remercie pour votre commande n°${window.sessionStorage.getItem("orderId")} d'un montant total de ${window.sessionStorage.getItem("totalPrice")}€.</p>
                                <p>Nous vous en souhaitons bonne réception.</p>
                                <p>A très bientôt sur notre site!</p>`
    const confirmationSection = document.getElementById("confirmation");
    confirmationSection.appendChild(newConfirmation);
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
    const currentProduct = window.location.search.substring(4);
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


//vérification d'être dans la page cart + requête pour récupérer les infos des produits + création de la page cart
if (document.getElementById("cart")) {
    fetch("http://localhost:3000/api/teddies/")
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (myJson) {
                cartBuild(myJson);
            });
        } else {
            console.log("Mauvaise réponse du réseau");
        }
    })
    .catch(function (error) {
        console.log("il y a eu un problème avec l\'opération fetch: " + error.message);
    });
    
    //boutton resetCart
    const resetCart = document.getElementById("resetCart");
    resetCart.addEventListener("click",function(){
        window.localStorage.clear();
        window.location.reload(false);
    });

    //boutton order
    const order = document.getElementById("order");
    order.addEventListener("submit",function(e){
        e.preventDefault();
        if(window.localStorage.length == 0){
            alert("Commande impossible, panier vide.")
        }
        else{
            //récupération des données du formulaire et des id des produits du panier
            const form = new FormData(order);
            let contact = {};
            for(let key of form.keys()){
                contact[key] = form.get(key);
            }
            const getProductsId = document.getElementsByTagName("article");
            let products = [];
            for(let product of getProductsId){
                products.push(product.getAttribute("id"));
            }
            const options = {
                headers : {
                    "Content-type" : "application/json"
                },
                method : "POST",
                body : JSON.stringify({contact : contact, products : products})
            }
            //envoi de la commande
            fetch("http://localhost:3000/api/teddies/order", options)
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (myJson) {
                        window.sessionStorage.setItem("orderId" , myJson.orderId);
                        window.localStorage.clear();
                        window.location = "file:///K:/Users/Antoine/Documents/formationdevweb/5emeprojet/Orinoco/orinoco/confirmation.html";
                    })
                } 
                else {
                    console.log("Mauvaise réponse du réseau");
                }
            })
            .catch(function (error) {
                console.log("il y a eu un problème avec l\'opération fetch: " + error.message);
            });
        }
        return false;
    })
}

//vérification d'être dans la page confirmation + création de la page confirmation
if(document.getElementById("confirmation")){
    confirmationBuild();
}