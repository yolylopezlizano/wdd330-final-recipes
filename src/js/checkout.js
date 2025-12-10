let cart = JSON.parse(localStorage.getItem("shoppingList")) || [];

const orderList = document.getElementById("order-list");
const totalText = document.getElementById("checkout-total");
const confirmBtn = document.getElementById("confirm-btn");

function loadCheckout() {
  orderList.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement("li");
    li.classList.add("checkout-item");

    li.innerHTML = `
      <span class="item-name">${item.name}</span>
      <span class="item-qty">${item.qty}x</span>
      <span class="item-price">$${(item.qty * item.price).toFixed(2)}</span>
    `;

    orderList.appendChild(li);
    total += item.qty * item.price;
  });

  totalText.textContent = `Total: $${total.toFixed(2)}`;
}

confirmBtn.addEventListener("click", () => {
  localStorage.removeItem("shoppingList");
  window.location.href = "thanks.html";
});

loadCheckout();
