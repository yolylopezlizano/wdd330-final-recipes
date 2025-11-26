// src/js/recipes.js

import ExternalServices from "./ExternalServices.mjs";

const api = new ExternalServices();

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function loadRecipes() {
  const category = getQueryParam("category");
  const title = document.querySelector("#category-title");
  const container = document.querySelector("#recipes-list");

  title.textContent = category;

  try {
    const data = await api.getMealsByCategory(category);
    const meals = data.meals;

    meals.forEach(meal => {
      const div = document.createElement("div");
      div.classList.add("recipe-card");
      div.innerHTML = `
        <a href="recipe-details.html?id=${meal.idMeal}">
            <h3>${meal.strMeal}</h3>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </a>
        `;
      container.appendChild(div);
    });

  } catch (error) {
    console.error("Error loading recipes:", error);
  }
}

loadRecipes();
