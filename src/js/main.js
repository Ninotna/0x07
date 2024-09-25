import { recipes } from "./data/recipes.js"; // Import recipe data from an external file
import Api from "./api/Api.js"; // Import the API for managing recipes data
import FilterManager from "./components/FilterManager.js"; // Import the filter manager for handling search filters
import Dropdown from "./components/Dropdown.js"; // Import dropdown management logic
import RecipeDisplayManager from "./utils/RecipeDisplayManager.js"; // Utility for displaying the recipes
import RecipeSearchManager from "./components/RecipeSearchManager.js"; // Handles the main search functionality
import RecipeCard from "./layout/RecipeCard.js"; // Handles individual recipe card layout

// Initialize the API with the imported recipe data
const api = new Api(recipes);

// Initialize the filter manager to manage filters
const filterManager = new FilterManager(api);

// Instanciation of TagManager is commented out but could be used for tag-based filtering
// const tagManager = new TagManager(filterManager, 'tags-container');

// Function to render recipe cards
function renderRecipes(recipes, searchTerm = "") {
  const container = document.getElementById("recipes-container");
  container.innerHTML = ""; // Clear previous results

  // Check if recipes are valid and if it's an array
  if (!recipes || !Array.isArray(recipes)) {
    console.error(
      "Aucune donnée de recette trouvée ou 'recipes' n'est pas un tableau."
    );
    const messageContainer = document.getElementById("message-container");
    messageContainer.innerHTML =
      "Une erreur s'est produite lors du chargement des recettes."; // Show error message if recipes are invalid
    return;
  }

  // Scenario A1: If no recipes are found, display a message with suggestions
  if (recipes.length === 0) {
    const messageContainer = document.getElementById("message-container");
    const suggestions =
      "vous pouvez chercher « tarte aux pommes », « poisson », etc.";
    messageContainer.innerHTML = `Aucune recette ne contient ‘${searchTerm}’. ${suggestions}`;
    return;
  }

  // Clear any error messages if recipes are found
  const messageContainer = document.getElementById("message-container");
  messageContainer.innerHTML = "";

  // Render each recipe in the array
  recipes.forEach((recipe) => {
    // Create a new instance of RecipeCard for each recipe
    const recipeCard = new RecipeCard(recipe);

    // Add animation classes for visual effect
    const recipeElement = recipeCard.createRecipeCard();
    recipeElement.classList.add("transition", "opacity-0"); // Start with transparency

    container.appendChild(recipeElement); // Append the recipe card to the container

    // Trigger animation to make the card appear with fade-in effect
    setTimeout(() => {
      recipeElement.classList.remove("opacity-0");
      recipeElement.classList.add("opacity-100");
    }, 100); // Slight delay for transition effect
  });
}

// Function to filter recipes based on search term from the main search bar
function filterRecipes(searchTerm) {
  const filteredRecipes = searchManager.searchRecipes(searchTerm);

  // Update the displayed recipes
  renderRecipes(filteredRecipes, searchTerm);

  // Update filters based on the filtered recipes
  filterManager.updateFiltersBasedOnRecipes(filteredRecipes);
}

// Initialize dropdowns for each filter (e.g., ingredients, appliances, utensils)

// Sample Dropdown for ingredients (currently commented out):
// const ingredientsDropdown = new Dropdown(
//     'ingredientsFilter',
//     'ingredientsDropdown',
//     (selectedIngredient) => {
//         const filteredRecipes = api.getRecipesByIngredient(selectedIngredient);
//         renderRecipes(filteredRecipes); // Update displayed recipes

//         // Add the selected ingredient as a tag
//         tagManager.addTag('ingredient', selectedIngredient);
//     }
// );

// Initializing filters to prepare the dropdowns and filters
filterManager.initFilters();

// Initial rendering of all recipes
renderRecipes(recipes);

// Instantiate RecipeDisplayManager for handling display logic
const displayManager = new RecipeDisplayManager(
  "recipes-container", // ID of the container for recipe cards
  "recipeCount" // ID for displaying the number of recipes
);

// Instantiate RecipeSearchManager for handling search logic
const searchManager = new RecipeSearchManager(
  recipes, // List of recipes
  "recipes-container", // Container ID for displaying recipes
  "message-container" // ID for displaying error or info messages
);

// Event listener for handling input in the main search bar
document.getElementById("search-bar").addEventListener("input", (e) => {
  const searchTerm = e.target.value;

  // Filter recipes based on the search term
  filterRecipes(searchTerm);

  // Update search results and filters based on the search term
  filterManager.updateSearchTerm(searchTerm);
});

// Event listener for handling input in the filter dropdowns
document.querySelectorAll(".dropdown-search").forEach((dropdownSearchBar) => {
  dropdownSearchBar.addEventListener("input", (e) => {
    const searchTerm = e.target.value;
    const dropdownId = dropdownSearchBar.getAttribute("data-dropdown-id");

    // Update dropdown options based on the search input
    filterManager.filterDropdown(dropdownId, searchTerm);
  });
});

// Display initial set of recipes on page load
displayManager.renderRecipes(recipes);

// Example of updating dropdown options and tags (commented out):
// filterManager.updateDropdown('ingredientsDropdown', ['Lait', 'Crème de coco'], 'ingredient', tagManager);
