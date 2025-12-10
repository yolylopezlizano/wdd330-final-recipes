import ExternalServices from "./ExternalServices.mjs";
import { updateCartCount } from "./main.js";

const api = new ExternalServices();

const params = new URLSearchParams(window.location.search);
let currentCategory = params.get("category");

const categoriesList = document.getElementById("categories-list");
const recipesList = document.getElementById("recipes-list");
const recipesTitle = document.getElementById("recipes-title");
const categoryTitle = document.getElementById("category-title");

async function loadCategories() {
    categoriesList.innerHTML = "";  

    try {
        const data = await api.getCategories();

        data.categories.forEach(cat => {
            const div = document.createElement("div");
            div.classList.add("category-card");

            div.innerHTML = `
                <button class="category-btn" data-cat="${cat.strCategory}">
                    ${cat.strCategory}
                </button>`;
            categoriesList.appendChild(div);
        });

    } catch (err) {
        console.error("Error loading categories:", err);
    }
}

async function loadRecipes(category) {

    categoriesList.style.display = "none";
    recipesTitle.style.display = "none";

    categoryTitle.textContent = `${category} Recipes`;
    categoryTitle.classList.remove("hidden");

    recipesList.innerHTML = "";

    const data = await api.getMealsByCategory(category); // <-- el método correcto

    data.meals.forEach(meal => {
        const div = document.createElement("div");
        div.classList.add("recipe-card");

        div.innerHTML = `
            <a href="recipe-details.html?id=${meal.idMeal}">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h4>${meal.strMeal}</h4>
            </a>
        `;

        recipesList.appendChild(div);
    });

    currentCategory = category;
}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("category-btn")) {
        const category = e.target.dataset.cat;
        loadRecipes(category);
    }
});

const backBtn = document.querySelector(".back-button");

if (backBtn) {
    backBtn.addEventListener("click", (e) => {
        e.preventDefault();

        if (currentCategory) {
            categoryTitle.classList.add("hidden");
            recipesList.innerHTML = "";
            categoriesList.style.display = "grid";
            recipesTitle.style.display = "block";
            currentCategory = null;
        } else {
            window.location.href = "index.html"; 
        }
    });
}

if (currentCategory) {
    loadRecipes(currentCategory);
} else {
    loadCategories();
}

function bounceCart(){
  const cart = document.getElementById("cart-count");
  if(!cart) return;
  cart.classList.add("cart-bounce");
  setTimeout(()=> cart.classList.remove("cart-bounce"), 300);
}
updateCartCount();
bounceCart();
