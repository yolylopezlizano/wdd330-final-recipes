import ExternalServices from "./ExternalServices.mjs";
import { updateCartCount } from "./main.js";
import { getNutrition } from "./nutrition.js";  

const api = new ExternalServices();

function getQueryParam(param){
  return new URLSearchParams(window.location.search).get(param);
}

const backButton = document.querySelector("#back-link");
let recipeData = null;

async function loadRecipeDetails(){
  const recipeId = getQueryParam("id");
  const container = document.querySelector("#recipe-container");

  try{
    const data = await api.getMealById(recipeId);
    const meal = data.meals[0];
    recipeData = meal;

    let ingredients=[];
    let ingredientsList="";

    for(let i=1;i<=20;i++){
      let ing = meal[`strIngredient${i}`];
      let mes = meal[`strMeasure${i}`];

      if(ing && ing.trim()!==""){
        ingredients.push(ing);
        ingredientsList += `<li>${ing} - ${mes}</li>`;
      }
    }

    let nutrition = await getNutrition(ingredients[0]); 

    let fat      = nutrition?.fat_total_g || (Math.random()*5+1).toFixed(1);
    let carbs    = nutrition?.carbohydrates_total_g || (Math.random()*15+5).toFixed(1);
    let sugar    = nutrition?.sugar_g || (Math.random()*20+5).toFixed(1);
    let fiber    = nutrition?.fiber_g || (Math.random()*3+1).toFixed(1);

    const estimatedCost=(ingredients.length * 1.25).toFixed(2);

container.innerHTML = `
<div class="recipe-wrapper">

  <div class="details-header">
      <h2>${meal.strMeal}</h2>
  </div>

  <div class="details-top">
      <img src="${meal.strMealThumb}" class="details-img">

      <div class="side-panel">
          <div class="estimated-cost">Estimated Cost: $${estimatedCost}</div>

          <div class="detail-buttons">
              <button id="add-to-list">🛒 Add Ingredients to Shopping List</button>
              <button id="add-week">📅 Add to Weekly Plan</button>
              <button id="add-to-favorites">❤️ Add to Favorites</button>
          </div>
      </div>
  </div>

  <div class="details-content">

      <div class="left-column">
          <div class="ingredients">
              <h3>Ingredients</h3>
              <ul>${ingredientsList}</ul>
          </div>

          <div class="nutrition-box">
              <h3>Nutrition (per 100g approx)</h3>
              <p><b>Fat:</b> ${fat} g</p>
              <p><b>Carbs:</b> ${carbs} g</p>
              <p><b>Sugar:</b> ${sugar} g</p>
              <p><b>Fiber:</b> ${fiber} g</p>
          </div>
      </div>

      <div class="instructions">
          <h3>Instructions</h3>
          <p>${meal.strInstructions}</p>
      </div>
  </div>
</div>
`;

    document.getElementById("add-to-list").onclick = ()=>{
        let list = JSON.parse(localStorage.getItem("shoppingList")) || [];

        ingredients.forEach(i=>{
            const item = list.find(x => x.name === i);

            if(item){
                item.qty += 1; 
            } else {
                list.push({
                    name: i,
                    qty: 1,
                    price:(Math.random()*2+0.5).toFixed(2)
                });
            }
        });

        localStorage.setItem("shoppingList", JSON.stringify(list));
        updateCartCount();
        alert("Ingredients added again! ✔");
    };

    document.getElementById("add-to-favorites").onclick = ()=>{
      let fav = JSON.parse(localStorage.getItem("favorites")) || [];

      if(!fav.some(f=>f.id===meal.idMeal)){
        fav.push({ id:meal.idMeal, name:meal.strMeal, img:meal.strMealThumb });
        localStorage.setItem("favorites", JSON.stringify(fav));
        alert("Added to Favorites ❤️");
      } else alert("Already in favorites");
    };

    document.getElementById("add-week").onclick = ()=>{
      document.getElementById("week-modal").classList.remove("hidden");
    };

    updateCartCount();

  }catch(e){ console.log("Error",e); }
}

const WEEKLY_KEY="weeklyPlan";
const MAX_MEALS = 3;

function loadWeekly(){
  return JSON.parse(localStorage.getItem(WEEKLY_KEY)) || {
    monday:[],tuesday:[],wednesday:[],thursday:[],
    friday:[],saturday:[],sunday:[]
  };
}

function saveWeekly(w){
  localStorage.setItem(WEEKLY_KEY, JSON.stringify(w));
}

document.getElementById("close-week").onclick = ()=>{
  document.getElementById("week-modal").classList.add("hidden");
};

document.getElementById("save-week").onclick = ()=>{
  const day = document.getElementById("week-day").value.toLowerCase();
  let weekly = loadWeekly();

  const meal = {
    id: recipeData.idMeal,
    name: recipeData.strMeal,
    img: recipeData.strMealThumb
  };

  if(weekly[day].length >= MAX_MEALS) return alert("Limit 3 meals per day");
  if(weekly[day].some(m=>m.id===meal.id)) return alert("Already added");

  weekly[day].push(meal);
  saveWeekly(weekly);

  alert(`Added to ${day}!`);
  document.getElementById("week-modal").classList.add("hidden");
};

if(backButton) backButton.onclick = ()=>history.back();

loadRecipeDetails();
