// src/js/recipeDetails.js

import ExternalServices from "./ExternalServices.mjs";
import { updateCartCount } from "./main.js";

const api = new ExternalServices();

// Read query param (?id=123)
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Back button support
const backButton = document.querySelector("#back-link");
const savedCategory = localStorage.getItem("lastCategory");

async function loadRecipeDetails() {
  const recipeId = getQueryParam("id");
  const container = document.querySelector("#recipe-container");

  try {
    const data = await api.getMealById(recipeId);
    const meal = data.meals[0];

    /* --------------------------
       1. GET INGREDIENTS LIST
    --------------------------- */
    const ingredients = [];
    let ingredientsList = "";

    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ingredient && ingredient.trim() !== "") {
        ingredients.push(ingredient);
        ingredientsList += `<li>${ingredient} - ${measure}</li>`;
      }
    }

    /* --------------------------
       2. COST ESTIMATE
    --------------------------- */
    const costPerIngredient = 1.25;
    const estimatedCost = (ingredients.length * costPerIngredient).toFixed(2);

    /* --------------------------
       3. BUILD HTML CONTENT
    --------------------------- */
    container.innerHTML = `
      <h2>${meal.strMeal}</h2>

      <img src="${meal.strMealThumb}" 
           alt="${meal.strMeal}" 
           class="details-img">

      <p id="estimated-cost" class="estimated-cost">
        Estimated Cost: $${estimatedCost}
      </p>

      <button id="add-to-list" class="add-button">
        Add Ingredients to Shopping List
      </button>

      <h3>Ingredients</h3>
      <ul>${ingredientsList}</ul>

      <h3>Instructions</h3>
      <p>${meal.strInstructions}</p>
    `;

    /* --------------------------
       4. ADD TO SHOPPING LIST
    --------------------------- */
    document
      .getElementById("add-to-list")
      .addEventListener("click", () => {
        let shoppingList =
          JSON.parse(localStorage.getItem("shoppingList")) || [];

        // Add items without repeating
        ingredients.forEach(item => {
          if (!shoppingList.includes(item)) {
            shoppingList.push(item);
          }
        });

        // Save
        localStorage.setItem("shoppingList", JSON.stringify(shoppingList));

        // Update cart count
        updateCartCount();

        alert("Ingredients added to your shopping list!");
      });

    // Update cart count on page load
    updateCartCount();

  } catch (error) {
    console.error("Error loading recipe details:", error);
  }
}

/* --------------------------
   BACK BUTTON BEHAVIOR
--------------------------- */
backButton.addEventListener("click", () => {
  if (savedCategory) {
    window.location.href = `recipes.html?category=${savedCategory}`;
  } else {
    window.location.href = "index.html";
  }
});

loadRecipeDetails();
