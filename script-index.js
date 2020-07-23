class Bear{
    constructor(_id, name, price, description, imageUrl, colors){
        this._id = _id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.colors = colors;
    }
}

var produits = [];

var request = new XMLHttpRequest();
request.onreadystatechange = function(){
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200){
        var response = JSON.parse(this.responseText);
        response.forEach(function(data){
        produits.push(data);
        });

        for (let i of produits) {
            var newCard = document.createElement("div");
            var newPicture = document.createElement("img");
            var newBodyCard = document.createElement("div");
            var newTitle = document.createElement("h3");
            var newDescription = document.createElement("p");
            var newBtn = document.createElement("div");
        
            var newTitleContent = document.createTextNode(i.name);
            var newDescriptionContent = document.createTextNode(i.description);
        
            newTitle.appendChild(newTitleContent);
            newDescription.appendChild(newDescriptionContent);
            newBodyCard.appendChild(newTitle);
            newBodyCard.appendChild(newDescription);            
            newBodyCard.appendChild(newBtn);
            newCard.appendChild(newPicture);
            newCard.appendChild(newBodyCard);
        
            var sectionCards = document.getElementById("cards");
            sectionCards.appendChild(newCard);

            newPicture.setAttribute("src",i.imageUrl);
            newPicture.setAttribute("width","300px");
            newBtn.textContent = "Voir le produit";
            newBtn.classList.add("btn")
            newBtn.classList.add("btn-primary")
        }
    }
};
request.open("GET", "http://localhost:3000/api/teddies");
request.send();