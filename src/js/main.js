import ExternalServices from "./ExternalServices.mjs";

// DISH OF THE DAY
async function loadDishOfDay() {
  const container = document.getElementById("dish-content");
  if (!container) return;

  const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
  const data = await response.json();
  const meal = data.meals[0];

  container.innerHTML = `
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <h4>${meal.strMeal}</h4>
    <a href="recipe-details.html?id=${meal.idMeal}" class="featured-btn">View Recipe</a>
  `;
}

loadDishOfDay();

const api = new ExternalServices();

//LOAD CATEGORIES (only if exists)
async function loadCategories() {
  const container = document.querySelector("#categories-list");
  if (!container) return;  

  try {
    const data = await api.getCategories();
    const categories = data.categories;

    categories.forEach(cat => {
      const div = document.createElement("div");
      div.classList.add("category-card");
      div.innerHTML = `<a href="recipes.html?category=${cat.strCategory}">${cat.strCategory}</a>`;
      container.appendChild(div);
    });

  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

loadCategories();

// SEARCH (only if elements exist)
const searchBtn = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("search-results");
const suggestionsBox = document.getElementById("suggestions");

// CLICK SEARCH
if (searchBtn && searchInput && resultsContainer) {
  searchBtn.addEventListener("click", async () => {
    const query = searchInput.value.trim();

    if (!query) {
      resultsContainer.innerHTML = "<p>Please enter a search term.</p>";
      return;
    }

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await response.json();

    resultsContainer.innerHTML = ""; 

    if (!data.meals) {
      resultsContainer.innerHTML = "<p>No recipes found.</p>";
      return;
    }

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

// ENTER KEY SEARCH
if (searchInput && searchBtn) {
  searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      searchBtn.click();
    }
  });
}

// CLEAR RESULTS ON DELETE
let previousQuery = "";

if (searchInput && resultsContainer) {
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.trim();

    if (value.length < previousQuery.length) {
      resultsContainer.innerHTML = "";
    }

    previousQuery = value;
  });
}

// AUTO-SUGGESTIONS
if (searchInput && suggestionsBox) {
  searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();

    if (query.length === 0) {
      suggestionsBox.innerHTML = "";
      return;
    }

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await response.json();

    suggestionsBox.innerHTML = "";

    if (!data.meals) {
      suggestionsBox.innerHTML = "<p>No suggestions</p>";
      return;
    }

    const list = data.meals.slice(0, 5);

    list.forEach(meal => {
      const item = document.createElement("div");
      item.classList.add("suggestion-item");
      item.textContent = meal.strMeal;

      item.addEventListener("click", () => {
        searchInput.value = meal.strMeal;
        suggestionsBox.innerHTML = "";
        if (searchBtn) searchBtn.click();
      });

      suggestionsBox.appendChild(item);
    });
  });
}

export function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (!cartCount) return;

  const shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];
  cartCount.textContent = shoppingList.length;
}
updateCartCount();
