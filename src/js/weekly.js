const STORAGE_KEY = "weeklyPlan";
const MAX_MEALS = 3;
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

let activeDay = null;
let weeklyPlan = loadWeeklyPlan();

function loadWeeklyPlan() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return createEmptyPlan();

  try {
    const parsed = JSON.parse(saved);

    DAYS.forEach(day => {
      if (!Array.isArray(parsed[day.toLowerCase()])) throw "Formato antiguo";
    });

    return parsed;

  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return createEmptyPlan();
  }
}

function createEmptyPlan() {
  const obj = {};
  DAYS.forEach(d => obj[d.toLowerCase()] = []);
  return obj;
}

function savePlan() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(weeklyPlan));
}

function renderWeek() {
  const container = document.getElementById("week-container");
  container.innerHTML = "";

  DAYS.forEach(day => {
    const dayKey = day.toLowerCase();
    const meals = weeklyPlan[dayKey];

    const card = document.createElement("div");
    card.className = "day-card";

    card.innerHTML = `
      <h3>${day}</h3>
      <div class="meals-list"></div>
      <button class="add-meal-btn" data-day="${dayKey}">+ Add meal</button>
    `;

    const mealContainer = card.querySelector(".meals-list");

    if (!meals.length) {
      mealContainer.innerHTML = `<p class="empty-note">No meals added</p>`;
    } else {
      meals.forEach(meal => {
        mealContainer.innerHTML += `
          <div class="meal-item">
            <img src="${meal.img}" alt="${meal.name}">
            <a href="recipe-details.html?id=${meal.id}" class="meal-name">${meal.name}</a>
            <button class="remove-meal" data-day="${dayKey}" data-id="${meal.id}">✖</button>
          </div>
        `;
      });
    }

    container.appendChild(card);
  });
}

function addMeal(day, meal) {
  const meals = weeklyPlan[day];

  if (meals.length >= MAX_MEALS) return alert(`Max ${MAX_MEALS} meals for ${day}`);

  if (meals.some(m => m.id === meal.id)) return alert("Already added");

  meals.push(meal);
  savePlan();
  renderWeek();
}

function removeMeal(day, id) {
  weeklyPlan[day] = weeklyPlan[day].filter(m => m.id !== id);
  savePlan();
  renderWeek();
}

async function searchRecipes(query) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
  const data = await res.json();
  return data.meals || [];
}

function renderSearchResults(meals) {
  const list = document.getElementById("search-results");
  list.innerHTML = "";

  meals.forEach(meal => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${meal.strMealThumb}">
      <span>${meal.strMeal}</span>
      <button class="add-from-search"
              data-id="${meal.idMeal}"
              data-name="${meal.strMeal}"
              data-img="${meal.strMealThumb}">
        Add
      </button>
    `;
    list.appendChild(li);
  });
}

function showModal(day) {
  activeDay = day;
  document.getElementById("search-modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("search-modal").classList.add("hidden");
  document.getElementById("search-input").value = "";
  document.getElementById("search-results").innerHTML = "";
}

document.addEventListener("click", e => {

  if (e.target.classList.contains("add-meal-btn")) {
    showModal(e.target.dataset.day);
  }

  const addBtn = e.target.closest(".add-from-search");
  if (addBtn) {
    const daySelect = document.getElementById("day-select");
    const selectedDay = daySelect ? daySelect.value : activeDay;

    if (!selectedDay) {
        alert("Select a day first");
        return;
    }

    addMeal(selectedDay, {
        id: addBtn.dataset.id,
        name: addBtn.dataset.name,
        img: addBtn.dataset.img
     });
    closeModal();
    return;
    }

  if (e.target.classList.contains("remove-meal")) {
    removeMeal(e.target.dataset.day, e.target.dataset.id);
  }
});

document.getElementById("close-search").onclick = closeModal;

document.getElementById("search-input").addEventListener("input", async e => {
  const q = e.target.value.trim();
  if (!q) return document.getElementById("search-results").innerHTML="";
  const meals = await searchRecipes(q);
  renderSearchResults(meals);
});

renderWeek();

