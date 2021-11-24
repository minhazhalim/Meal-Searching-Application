const mealsItem = document.getElementById('meals');
const favoriteMeals = document.getElementById('favorite-meals');
const mealPopup = document.getElementById('meal-popup');
const mealInfo = document.getElementById('meal-info');
const closePopup = document.getElementById('close-popup');
const searchTerm = document.getElementById('search-term');
const search = document.getElementById('search');
async function getRandomMeal(){
     const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
     const responseData = await response.json();
     const randomMeal = responseData.meals[0];
     addMeal(randomMeal,true);
}
getRandomMeal();
async function getMealById(id){
     const response = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);
     const responseData = await response.json();
     const meal = responseData.meals[0];
     return meal;
}
async function getMealsBySearch(term){
     const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term);
     const responseData = await response.json();
     const meals = responseData.meals;
     return meals;
}
function addMeal(mealData,random = false){
     const div = document.createElement('div');
     div.classList.add('meal');
     div.innerHTML = `
          <div class="meal-header">
               ${random? `<span class="random"> Random Recipe </span>` : ""}
               <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"/>
          </div>
          <div class="meal-body">
               <h4>${mealData.strMeal}</h4>
               <button class="favorite-button"><i class="fas fa-heart"></i></button>
          </div>
     `;
     const button = div.querySelector('.meal-body .favorite-button');
     button.addEventListener('click',() => {
          if(button.classList.contains('active')){
               removeMealLS(mealData.idMeal);
               button.classList.remove('active');
          }else{
               addMealLS(mealData.idMeal);
               button.classList.add('active');
          }
          fetchFavoriteMeals();
     });
     div.addEventListener('click',() => {
          showMealInfo(mealData);
     });
     mealsItem.appendChild(div);
}
function addMealLS(mealId){
     const mealIds = getMealsLS();
     localStorage.setItem('mealIds',JSON.stringify([...mealIds,mealId]));
}
function removeMealLS(mealId){
     const mealIds = getMealsLS();
     localStorage.setItem('mealIds',JSON.stringify(mealIds.filter((id) => id !== mealId)));
}
function getMealsLS(){
     const mealIds = JSON.parse(localStorage.getItem('mealIds'));
     return mealIds === null ? [] : mealIds;
}
async function fetchFavoriteMeals(){
     favoriteMeals.innerHTML = "";
     const mealIds = getMealsLS();
     for(let i = 0;i < mealIds.length;i++){
          const mealId = mealIds[i];
          meal = await getMealById(mealId);
          addMealFavorite(meal);
     }
}
fetchFavoriteMeals();
function addMealFavorite(mealData){
     const list = document.createElement('li');
     list.innerHTML = `
          <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"/><span>${mealData.strMeal}</span>
          <button class="clear"><i class="fas fa-window-close"></i></button>
     `;
     const clear = list.querySelector('.clear');
     clear.addEventListener('click',() => {
          removeMealLS(mealData.idMeal);
          fetchFavoriteMeals();
     });
     list.addEventListener('click',() => {
          showMealInfo(mealData);
     });
     favoriteMeals.appendChild(list);
}
function showMealInfo(mealData){
     mealInfo.innerHTML = "";
     const div = document.createElement('div');
     const ingredients = [];
     for(let i = 1;i <= 20;i++){
          if(mealData["stringIngredient" + i]){
               ingredients.push(` ${mealData["stringIngredient" + i]} - ${mealData["stringMeasure" + i]}`);
          }else{
               break;
          }
     }
     div.innerHTML = `
          <h1>${mealData.strMeal}</h1>
          <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"/>
          <p>${mealData.strInstructions}</p>
          <h3>Ingredients:</h3>
          <ul>${ingredients.map((ing) => `<li>${ing}</li>`).join("")}</ul>
     `;
     mealInfo.appendChild(div);
     mealPopup.classList.remove('hidden');
}
search.addEventListener('click',async () => {
     mealsItem.innerHTML = "";
     const search = searchTerm.value;
     const meals = await getMealsBySearch(search);
     if(meals){
          meals.forEach((meal) => {
               addMeal(meal);
          });
     }
});
closePopup.addEventListener('click',() => {
     mealPopup.classList.add('hidden');
});