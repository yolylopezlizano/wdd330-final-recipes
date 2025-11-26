// src/js/recipeDetails.js

import ExternalServices from "./ExternalServices.mjs";

const api = new ExternalServices();

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function loadRecipeDetails() {
  const recipeId = getQueryParam("id");
  const container = document.querySelector("#recipe-container");

  try {
    const data = await api.getMealById(recipeId);
    const meal = data.meals[0];

    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        ingredientsList += `<li>${ingredient} - ${measure}</li>`;
      }
    }

    container.innerHTML = `
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="details-img">
      <h3>Ingredients</h3>
      <ul>${ingredientsList}</ul>
      <h3>Instructions</h3>
      <p>${meal.strInstructions}</p>
    `;

  } catch (error) {
    console.error("Error loading recipe details:", error);
  }
}

loadRecipeDetails();
