import { updateCartCount } from "./main.js";

const favContainer = document.getElementById("fav-list");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

async function getMealThumb(id) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await res.json();
    return data.meals[0].strMealThumb; 
}

async function showFavorites() {
    favContainer.innerHTML = "";

    for (let item of favorites) {
        const li = document.createElement("li");

        const thumb = await getMealThumb(item.id);

        li.innerHTML = `
            <div class="fav-card">

                <!-- Clicking opens the recipe page -->
                <a href="recipe-details.html?id=${item.id}" class="fav-link-img">
                    <img src="${thumb}" alt="${item.name}">
                </a>

                <a href="recipe-details.html?id=${item.id}" class="fav-link-title">
                    ${item.name}
                </a>

                <button class="remove-btn">X</button>
            </div>
        `;

        li.querySelector(".remove-btn").addEventListener("click", () => {
            favorites = favorites.filter(f => f.id !== item.id);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            showFavorites();
        });

        favContainer.appendChild(li);
    }
}

document.getElementById("clear-fav").addEventListener("click", () => {
    favorites = [];
    localStorage.setItem("favorites", JSON.stringify(favorites));
    showFavorites();
});

updateCartCount();
showFavorites();
