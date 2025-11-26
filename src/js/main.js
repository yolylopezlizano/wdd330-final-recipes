// src/js/main.js

import ExternalServices from "./ExternalServices.mjs";

const api = new ExternalServices();

async function loadCategories() {
  const container = document.querySelector("#categories-list");

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
