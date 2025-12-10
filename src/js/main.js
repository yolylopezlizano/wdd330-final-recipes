import ExternalServices from "./ExternalServices.mjs";

async function loadDishOfDay() {
  const container = document.getElementById("dish-content");
  if (!container) return;

  const storedData = JSON.parse(localStorage.getItem("dishOfDay"));
  const today = new Date().toDateString();

  if (storedData && storedData.date === today) {
    displayDish(storedData.meal);
    return;
  }

  const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
  const data = await response.json();
  const meal = data.meals[0];

  localStorage.setItem("dishOfDay", JSON.stringify({ date: today, meal }));
  displayDish(meal);
}

function displayDish(meal) {
  const container = document.getElementById("dish-content");
  container.innerHTML = `
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <h4>${meal.strMeal}</h4>
    <a href="recipe-details.html?id=${meal.idMeal}" class="featured-btn">View Recipe</a>
  `;
}

loadDishOfDay();

const api = new ExternalServices();

async function loadCategories() {
  const container = document.querySelector("#categories-list");
  if (!container) return;

  try {
    const data = await api.getCategories();

    data.categories.forEach(cat => {
      const div = document.createElement("div");
      div.classList.add("category-box");

      div.innerHTML = `
        <p>${cat.strCategory}</p>
      `;

      div.addEventListener("click", ()=>{
        window.location.href = `recipes.html?category=${cat.strCategory}`;
      });

      container.appendChild(div);
    });

  } catch (err) {
    console.error("Error loading categories:", err);
  }
}

const searchBtn = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("search-results");
const suggestionsBox = document.getElementById("suggestions");

if (searchBtn && searchInput && resultsContainer) {
  searchBtn.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (!query) return resultsContainer.innerHTML = "<p>Please enter a search term.</p>";

    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await res.json();

    resultsContainer.innerHTML = "";
    if (!data.meals) return resultsContainer.innerHTML = "<p>No recipes found.</p>";

    data.meals.forEach(meal => {
      const card = document.createElement("div");
      card.classList.add("recipe-card");
      card.innerHTML = `
        <a href="recipe-details.html?id=${meal.idMeal}">
            <h3>${meal.strMeal}</h3>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </a>
      `;
      resultsContainer.appendChild(card);
    });
  });
}

if (searchInput && searchBtn) {
  searchInput.addEventListener("keyup", e => { if (e.key === "Enter") searchBtn.click(); });
}

if (searchInput && resultsContainer) {
  let previous = "";
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim().length < previous.length) resultsContainer.innerHTML = "";
    previous = searchInput.value.trim();
  });
}

if (searchInput && suggestionsBox) {
  searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (!query) return suggestionsBox.innerHTML = "";

    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await res.json();

    suggestionsBox.innerHTML = "";
    if (!data.meals) return suggestionsBox.innerHTML = "<p>No suggestions</p>";

    data.meals.slice(0,5).forEach(meal => {
      const item = document.createElement("div");
      item.classList.add("suggestion-item");
      item.textContent = meal.strMeal;

      item.addEventListener("click", () => {
        searchInput.value = meal.strMeal;
        suggestionsBox.innerHTML = "";
        searchBtn.click();
      });

      suggestionsBox.appendChild(item);
    });
  });
}

async function getRandomMeal(){
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
  const data = await res.json();
  return data.meals[0];
}

const randomBtn = document.getElementById("random-meal-btn");
const randomBox = document.getElementById("random-meal-display");
const randomContent = document.getElementById("random-content");
const closeRandomBtn = document.getElementById("close-random");

if(randomBtn){
  randomBtn.addEventListener("click", async ()=>{
      const meal = await getRandomMeal();
      randomBox.classList.remove("hidden");
      randomContent.innerHTML = `
          <div class="random-card">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
              <h3>${meal.strMeal}</h3>
              <a href="recipe-details.html?id=${meal.idMeal}" class="view-btn">View Recipe</a>
          </div>
      `;
  });
}

if(closeRandomBtn){
  closeRandomBtn.addEventListener("click", ()=>{
      randomBox.classList.add("hidden");
  });
}

export function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (!cartCount) return;
  const shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];
const total = shoppingList.reduce((sum, item) => sum + item.qty, 0);
cartCount.textContent = total;
}
updateCartCount();

const menuToggle = document.getElementById("menu-toggle");
const sideMenu = document.querySelector(".side-menu");

if (menuToggle && sideMenu) {
  menuToggle.addEventListener("click", () => {
    sideMenu.classList.toggle("open");
  });
}
