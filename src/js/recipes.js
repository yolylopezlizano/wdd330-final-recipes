import ExternalServices from "./ExternalServices.mjs";

const api = new ExternalServices();

// Read category from URL
function getCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category");
}

async function loadRecipesByCategory() {
  const category = getCategoryFromURL();
  const title = document.getElementById("category-title");
  const list = document.getElementById("recipes-list");

  if (!category) {
    title.textContent = "Select a category from the menu";
    return;
  }

  title.textContent = `Category: ${category}`;

  try {
    const data = await api.getRecipesByCategory(category);

    list.innerHTML = ""; // clear

    data.meals.forEach(meal => {
      const card = document.createElement("div");
      card.classList.add("recipe-card");

      card.innerHTML = `
        <a href="recipe-details.html?id=${meal.idMeal}">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <h3>${meal.strMeal}</h3>
        </a>
      `;

      list.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading recipes:", error);
    list.innerHTML = "<p>Error loading recipes.</p>";
  }
}

loadRecipesByCategory();
