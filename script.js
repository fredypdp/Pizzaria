let cart = []
let modalKey = 0

const sel = (el)=> document.querySelector(el);
const selAll = (el)=> document.querySelectorAll(el);

//Add pizza's
pizzaJson.map((item, index)=> { 
    let pizzaItem = sel(".models .pizza-item").cloneNode(true); //clone pizza models

    // Add pizza details
    pizzaItem.setAttribute("data-key", index) // Adding a index on pizza
    pizzaItem.querySelector(".pizza-item--img img").src = item.img;
    pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;
    
    // Window animation
    pizzaItem.querySelector("a").addEventListener("click", (e)=>{
        e.preventDefault();
        let key = e.target.closest(".pizza-item").getAttribute("data-key") // Getting the index
        modalQt = 1 // When open the model set quantity how "1"
        modalKey = key // Model index is same then pizza index in page

        sel(".pizzaBig img").src = pizzaJson[key].img;
        sel(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
        sel(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
        sel(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        
        // Size animation
        sel(".pizzaInfo--size.selected").classList.remove("selected");
        selAll(".pizzaInfo--size").forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add("selected");
            }
            // Going to "pizzaJson" to find sizes of the current pizza and add in "span"
            size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        // Setting the quantity
        sel(".pizzaInfo--qt").innerHTML = modalQt

        // Open menu window/popup
        sel(".pizzaWindowArea").style.opacity = 0;
        sel(".pizzaWindowArea").style.display = "flex";
        setTimeout(()=>{
            sel(".pizzaWindowArea").style.opacity = 1
        }, 100);
    });
    
    sel(".pizza-area").append(pizzaItem); //Adding the pizza
    
});

// Close modal animation
function closeModal(){
    sel(".pizzaWindowArea").style.opacity = 0;
    setTimeout(()=>{
        sel(".pizzaWindowArea").style.display = "none"
    }, 100);

    modalQt = 1
}

// Adding closeModal animation on cancel button
selAll(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach((item)=>{
    item.addEventListener("click", closeModal);
});

// Functions to increase and decrease the amount of pizza
sel('.pizzaInfo--qtmenos').addEventListener("click", ()=>{
    if(modalQt > 1){
        modalQt--;
        sel(".pizzaInfo--qt").innerHTML = modalQt;
    }
});

sel(".pizzaInfo--qtmais").addEventListener("click", ()=>{
    modalQt++
    sel(".pizzaInfo--qt").innerHTML = modalQt
})

// Change size function
selAll(".pizzaInfo--size").forEach((size, sizeIndex)=>{
    size.addEventListener("click", ()=>{
        sel(".pizzaInfo--size.selected").classList.remove("selected"); // First remove previous size
        size.classList.add("selected") // After add a size choosed
    })
});

// Adding pizza in cart
sel(".pizzaInfo--addButton").addEventListener("click", ()=>{
    let size = parseInt(sel(".pizzaInfo--size.selected").getAttribute("data-key")); // Get size selected
    let identifier = pizzaJson[modalKey].id+'@'+size;

    // If there is already a pizza with the same size and flavor "identifier" in the cart, just increase the quantity
    let key = cart.findIndex((item) => item.identifier == identifier);
    if(key > -1){
        cart[key].qt += modalQt
    }else { // Otherwise, add to cart, with "id" "size" and "qt" (quantity)
    cart.push({
        identifier,
        id:pizzaJson[modalKey].id,
        size,
        qt:modalQt
    });
    }

    updateCart()
    closeModal()
})

// Cart functions
function updateCart(){
    // Changing the amount that appears in the mobile cart
    sel(".menu-openner span").innerHTML = cart.length;
    
    // If the cart has a pizza or more, open, otherwise, close
    if(cart.length > 0){
        sel("aside").classList.add("show");
        sel(".cart").innerHTML = "" // Whenever you open the cart, empty it and then add the new items

        let subtotal = 0
        let total = 0
        let desconto = 0

        for(let i in cart){
            // Find an item in "pizzaJSON" with the same id as the item selected in the cart
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;
            let cartItem = sel(".models .cart--item").cloneNode(true);

            // Changing pizza size position index by strings
            let pizzaSizeName;
            switch(cart[i].size){
                case 0: // If the pizza size index is "0", then it is "/pequenasmall"
                    pizzaSizeName = "Pequena"
                    break;
                case 1:
                    pizzaSizeName = "Média"
                    break;
                case 2:
                    pizzaSizeName = "Grande"
                    break;
            }
            
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            // Adding cart pizza features
            cartItem.querySelector("img").src = pizzaItem.img;
            cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
            cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt

            // Amount increase and decrease functions
            cartItem.querySelector(".cart--item-qtmenos").addEventListener("click", ()=>{
                // If the quantity of pizza is greater than 1, decrease
                if(cart[i].qt > 1){
                    cart[i].qt--;
                } else { // If the quantity of pizza is less than 1, remove from cart
                    cart.splice(i,1)
                }
                updateCart(); // And then update the cart
            });

            // Quantity increase function
            cartItem.querySelector(".cart--item-qtmais").addEventListener("click", ()=>{
                cart[i].qt++;
                updateCart() // And then update the cart
            });

            // And at the end, add the pizza with all the features added to the cart
            sel(".cart").append(cartItem);
            
        }

        // Adding the price and discount
        desconto = subtotal * 0.1
        total = subtotal - desconto

        sel(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`
        sel(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`
        sel(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`
        
    }else { // If the cart is empty, remove it from the screen
        sel("aside").classList.remove("show");
        sel("aside").style.left = "100vw"
    } 
}

// Open mobile menu function
sel(".menu-openner").addEventListener("click", ()=>{
    if(cart.length > 0){
        sel("aside").style.left = "0";
    }
})

// Mobile menu close function
sel(".menu-closer").addEventListener("click", ()=>{
    sel("aside").style.left = "100vw"
})