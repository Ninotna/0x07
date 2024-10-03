// Import dependencies and data
import { recipes } from "./data/recipes.js"; // Recipe data
import Api from "./api/Api.js"; // API for managing recipe data
import FilterManager from "./components/FilterManager.js"; // Manages search filters
import Dropdown from "./components/Dropdown.js"; // Dropdown functionality
import RecipeDisplayManager from "./utils/RecipeDisplayManager.js"; // Manages recipe display logic
import RecipeSearchManager from "./components/RecipeSearchManager.js"; // Handles main search functionality
import RecipeCard from "./layout/RecipeCard.js"; // Manages individual recipe card layout

// Initialize API with recipe data
const api = new Api(recipes);

// Filter manager to manage dropdowns and filters
const filterManager = new FilterManager(api);

// Render all recipes on the page
function renderRecipes(recipes, searchTerm = "") {
  const container = document.getElementById("recipes-container");
  container.innerHTML = ""; // Clear previous recipes

  // Ensure recipes array is valid
  if (!recipes || !Array.isArray(recipes)) {
    console.error("Invalid recipe data or 'recipes' is not an array.");
    const messageContainer = document.getElementById("message-container");
    messageContainer.innerHTML =
      "An error occurred while loading recipes."; // Display error message
    return;
  }

  // No recipes found scenario with a suggestion
  if (recipes.length === 0) {
    const messageContainer = document.getElementById("message-container");
    const suggestions = "Try searching for 'apple pie', 'fish', etc.";
    messageContainer.innerHTML = `No recipes found for ‘${searchTerm}’. ${suggestions}`;
    return;
  }

  // Clear any previous error messages
  document.getElementById("message-container").innerHTML = "";

  // Render each recipe as a card
  recipes.forEach((recipe) => {
    const recipeCard = new RecipeCard(recipe);
    const recipeElement = recipeCard.createRecipeCard();

    // Add transition effect for smooth appearance
    recipeElement.classList.add("transition", "opacity-0");
    container.appendChild(recipeElement);

    // Fade-in effect for the recipe card
    setTimeout(() => {
      recipeElement.classList.replace("opacity-0", "opacity-100");
    }, 100);
  });
}

// Filter recipes based on the search term from the main search bar
function filterRecipes(searchTerm) {
  const filteredRecipes = searchManager.searchRecipes(searchTerm); // Search recipes
  renderRecipes(filteredRecipes, searchTerm); // Render filtered recipes
  filterManager.updateFiltersBasedOnRecipes(filteredRecipes); // Update filters
}

// Initialize filter dropdowns (e.g., ingredients, appliances, utensils)
filterManager.initFilters();

// Initial rendering of all recipes on page load
renderRecipes(recipes);

// Instantiate managers for recipe display and search logic
const displayManager = new RecipeDisplayManager(
  "recipes-container",  // Recipe container ID
  "recipeCount"         // Recipe count display ID
);

const searchManager = new RecipeSearchManager(
  recipes,              // List of recipes
  "recipes-container",  // Recipe container ID
  "message-container"   // Message display ID
);

// Main search bar event listener for filtering recipes based on input
document.getElementById("search-bar").addEventListener("input", (e) => {
  const searchTerm = e.target.value.trim();
  filterRecipes(searchTerm); // Filter and display recipes
  filterManager.updateSearchTerm(searchTerm); // Update filters based on search term
});

// Event listeners for dropdown search functionality (ingredients, appliances, etc.)
document.querySelectorAll(".dropdown-search").forEach((dropdownSearchBar) => {
  dropdownSearchBar.addEventListener("input", (e) => {
    const searchTerm = e.target.value.trim();
    const dropdownId = dropdownSearchBar.getAttribute("data-dropdown-id");

    // Filter dropdown options based on the search input
    filterManager.filterDropdown(dropdownId, searchTerm);
  });
});

// Clear the search input and hide the clear button, then trigger the filter update
// Ensure the function is in the global scope
window.handleInput = function(input) 
{
    const clearButton = document.querySelector('.clear-btn');
    
    if (input.value.length > 0) 
    {
        clearButton.classList.remove('hidden'); // Show the clear button
    } 
    else 
    {
        clearButton.classList.add('hidden'); // Hide the clear button
    }
}

window.clearInput = function() 
{
    const input = document.querySelector('#search-bar');
    const clearButton = document.querySelector('.clear-btn');
    
    input.value = '';  // Clear the input
    clearButton.classList.add('hidden');  // Hide the clear button again
}



// Display the initial set of recipes
displayManager.renderRecipes(recipes);
