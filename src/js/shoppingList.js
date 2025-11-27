import { updateCartCount } from "./main.js";

updateCartCount();

const listContainer = document.getElementById("shopping-items");
let shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];

// Show list
function renderList() {
  listContainer.innerHTML = "";
  shoppingList.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    listContainer.appendChild(li);
  });
}

renderList();

// Clear list button
document.getElementById("clear-list").addEventListener("click", () => {
  localStorage.removeItem("shoppingList");
  shoppingList = [];
  renderList();
  updateCartCount();
});
