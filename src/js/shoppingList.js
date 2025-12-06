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

// Convert old items {string} to objects
if (!shoppingList[0]?.price) {
  shoppingList = shoppingList.map(item => ({
    name: typeof item === "string" ? item : item.name,
    qty: 1,
    price: getPrice(),
  }));
  localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
}

// Render shopping list
function displayItems() {
  listContainer.innerHTML = "";
  
  shoppingList.forEach((item, index) => {
    const li = document.createElement("li");
    
    li.innerHTML = `
      <span>${item.name}</span>
      <input type="number" min="1" value="${item.qty}" class="qty-input" data-index="${index}">
      <span>$${(item.price * item.qty).toFixed(2)}</span>
      <button class="remove-btn" data-index="${index}">X</button>
    `;
    
    listContainer.appendChild(li);
  });

  updateTotal();
  updateCartCount();
}

// Update qty
listContainer.addEventListener("input", (e) => {
  if (e.target.classList.contains("qty-input")) {
    const index = e.target.dataset.index;
    shoppingList[index].qty = parseInt(e.target.value) || 1;
    saveAndRefresh();
  }
});

// Remove single item
listContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const index = e.target.dataset.index;
    shoppingList.splice(index, 1);
    saveAndRefresh();
  }
});

// Clear full list
clearBtn.addEventListener("click", () => {
  shoppingList = [];
  saveAndRefresh();
});

// Calculate total
function updateTotal() {
  const total = shoppingList.reduce((sum, item) => sum + item.price * item.qty, 0);
  totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
}

// Save & reload UI
function saveAndRefresh() {
  localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
  displayItems();
}

// Checkout placeholder
checkoutBtn.addEventListener("click", () => {
  alert("Payment/Checkout will be added later!");
});

// INIT
displayItems();
