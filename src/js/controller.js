import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config.js';
import RecipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import ResultsView from './views/resultsView.js';
import PaginationView from './views/paginationView.js';
import BookmarksView from './views/bookmarksView.js';
import AddRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {async} from 'regenerator-runtime';
const controlRecipes = async function (){
  try {
    const id = window.location.hash.slice(1);
    if(!id) return;
    recipeView.renderSpinner();
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  }catch(error){
    recipeView.renderError();
    console.log(error);
  }
};
const controlSearchResults = async function (){
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if(!query) return;
    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  }catch(error){
    console.log(error);
  }
};
const controlPagination = function (goToPage){
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};
const controlServings = function (newServings){
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function (){
  if(!model.state.recipe.bookmarked){
    model.addBookmark(model.state.recipe);
  }else{
    model.deleteBookmark(model.state.recipe.id);
  }
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function (){
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe){
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    bookmarksView.render(model.state.bookmarks);
    window.history.pushState(null,"",`#${model.state.recipe.id}`);
    setTimeout(function (){
      addRecipeView.toggleWindow();
    },MODAL_CLOSE_SEC * 1000);
  }catch(error){
    addRecipeView.renderError(error.message);
  }
};
const init = function (){
  BookmarksView.addHandlerRender(controlBookmarks);
  RecipeView.addHandlerRender(controlRecipes);
  RecipeView.addHandlerUpdateServings(controlServings);
  RecipeView.addHandlerAddBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPagination);
  AddRecipeView.addHandlerUpload(controlAddRecipe);
};
init();