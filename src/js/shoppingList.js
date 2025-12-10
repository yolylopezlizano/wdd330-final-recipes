import { updateCartCount } from "./main.js";

// Generate a random price for each ingredient
function getPrice() {
  return parseFloat((Math.random() * (3 - 0.5) + 0.5).toFixed(2));
}

let shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];

const listContainer = document.getElementById("shopping-items");
const totalDisplay = document.getElementById("total-price");
const checkoutBtn = document.getElementById("checkout-btn");
const clearBtn = document.getElementById("clear-list");

if (!shoppingList[0]?.price) {
  shoppingList = shoppingList.map(item => ({
    name: typeof item === "string" ? item : item.name,
    qty: item.qty || 1,
    price: typeof item.price === "number" ? item.price : getPrice(),
  }));
  localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
}

function displayItems() {
  listContainer.innerHTML = "";
  
  shoppingList.forEach((item, index) => {
    const li = document.createElement("li");
    
    li.innerHTML = `
      <span class="item-name">${item.name}</span>

      <div class="qty-controls">
        <button class="qty-btn minus" data-name="${item.name}">-</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn plus" data-name="${item.name}">+</button>
      </div>

      <span class="item-price">$${(item.qty * item.price).toFixed(2)}</span>

      <button class="delete-item" data-name="${item.name}">🗑</button>
    `;
    
    listContainer.appendChild(li);
  });

  updateTotal();
  updateCartCount();
}

listContainer.addEventListener("input", (e) => {
  if (e.target.classList.contains("qty-input")) {
    const index = e.target.dataset.index;
    shoppingList[index].qty = parseInt(e.target.value) || 1;
    saveAndRefresh();
  }
});

listContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const index = e.target.dataset.index;
    shoppingList.splice(index, 1);
    saveAndRefresh();
  }
});

clearBtn.addEventListener("click", () => {
  shoppingList = [];
  saveAndRefresh();
});

function updateTotal() {
  const total = shoppingList.reduce((sum, item) => sum + item.price * item.qty, 0);
  totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
}

function saveAndRefresh() {
  localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
  displayItems();
}

checkoutBtn.addEventListener("click", () => {
  window.location.href = "checkout.html";
});

displayItems();

listContainer.addEventListener("click", (e) => {

  if (e.target.classList.contains("qty-btn")) {
    const name = e.target.dataset.name;
    const isPlus = e.target.classList.contains("plus");

    shoppingList = shoppingList.map(item => {
      if (item.name === name) {
        item.qty = isPlus ? item.qty + 1 : Math.max(1, item.qty - 1);
      }
      return item;
    });

    saveAndRefresh();
  }

  if (e.target.classList.contains("delete-item")) {
    const name = e.target.dataset.name;

    shoppingList = shoppingList.map(item => {
        if(item.name === name){
            item.qty -= 1; 
        }
        return item;
    }).filter(item => item.qty > 0); 

    saveAndRefresh();
  }

});

