import Dropdown from "./Dropdown.js";
import TagManager from "./TagManager.js";
import RecipeCard from "../layout/RecipeCard.js";

export default class FilterManager {
  constructor(api) {
    this.api = api;

    // Initialize TagManager to manage selected tags in the UI
    this.tagManager = new TagManager(this, "tags-container");

    // Active tags for filtering, categorized by ingredient, appliance, and utensil
    this.activeTags = {
      ingredient: [],
      appliance: [],
      utensil: [],
    };

    // Search term from the search bar
    this.searchTerm = "";

    // Initialize dropdowns for ingredients, appliances, and utensils
    this.initDropdowns();
  }

  // Initialize the dropdowns for filtering
  initDropdowns() {
    this.ingredientsDropdown = new Dropdown(
      "ingredientsFilter",
      "ingredientsDropdown",
      "ingredients",
      (selectedIngredient) => this.addTagAndUpdate("ingredient", selectedIngredient)
    );

    this.appliancesDropdown = new Dropdown(
      "appliancesFilter",
      "appliancesDropdown",
      "appliances",
      (selectedAppliance) => this.addTagAndUpdate("appliance", selectedAppliance)
    );

    this.utensilsDropdown = new Dropdown(
      "utensilsFilter",
      "utensilsDropdown",
      "utensils",
      (selectedUtensil) => this.addTagAndUpdate("utensil", selectedUtensil)
    );
  }

  // Update the search term and re-filter recipes
  updateSearchTerm(searchTerm) {
    this.searchTerm = searchTerm.trim(); // Store the search term
    this.updateFiltersAndRenderRecipes(); // Re-filter recipes based on tags and search term
  }

  // Add the selected tag, update activeTags, and refresh recipe display
  addTagAndUpdate(type, value) {
    if (!this.activeTags[type].includes(value)) {
      this.activeTags[type].push(value); // Add tag if it's not already selected
    }
    this.tagManager.addTag(type, value); // Display the tag in the UI
    this.updateFiltersAndRenderRecipes(); // Update recipe and filter display
  }

  // Remove a tag from activeTags and update the recipe display
  removeFilter(type, value) {
    if (!this.activeTags[type]) {
      console.error(`Invalid tag type: ${type}`);
      return;
    }

    // Remove the tag from the corresponding activeTags array
    this.activeTags[type] = this.activeTags[type].filter(
      (tag) => tag !== value
    );

    // Update the recipe and filter display after removing the tag
    this.updateFiltersAndRenderRecipes();
  }

  // Reset all filters and show all recipes
  resetFilters() {
    // Clear active tags
    this.activeTags = {
      ingredient: [],
      appliance: [],
      utensil: [],
    };

    // Clear the search term
    this.searchTerm = "";

    // Clear all UI tags from the tag manager
    this.tagManager.clearAllTags();

    // Reset dropdowns to their default states
    this.ingredientsDropdown.reset();
    this.appliancesDropdown.reset();
    this.utensilsDropdown.reset();

    // Show all recipes after clearing filters and search term
    this.renderRecipes(this.api.getAllRecipes());

    // Update dropdown options based on all recipes
    this.updateFiltersBasedOnRecipes(this.api.getAllRecipes());
  }

  // Filter and render recipes based on both active tags and the search term
  updateFiltersAndRenderRecipes() {
    const filteredRecipes = this.filterRecipesByTagsAndSearch();
    this.renderRecipes(filteredRecipes);
    this.updateFiltersBasedOnRecipes(filteredRecipes);
  }

  // Filter recipes based on selected tags and the search term
  filterRecipesByTagsAndSearch() {
    const { ingredient, appliance, utensil } = this.activeTags;

    // Step 1: Filter recipes based on selected tags
    let filteredRecipes = this.api.getRecipesByTags(
      ingredient,
      appliance,
      utensil
    );

    // Step 2: Apply the search term filter on the already filtered recipes
    if (this.searchTerm) {
      filteredRecipes = filteredRecipes.filter((recipe) => {
        return (
          recipe.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          recipe.description
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          recipe.ingredients.some((ing) =>
            ing.ingredient.toLowerCase().includes(this.searchTerm.toLowerCase())
          )
        );
      });
    }

    return filteredRecipes;
  }

  // Render the filtered recipes
  renderRecipes(recipes) {
    const container = document.getElementById("recipes-container");
    const recipeCountElement = document.getElementById("recipeCount");

    container.innerHTML = ""; // Clear previous results

    // Display a message if no recipes are found
    if (!recipes || recipes.length === 0) {
      container.innerHTML =
        '<p class="text-center text-gray-500">Aucune recette trouvée.</p>';
      recipeCountElement.textContent = "0 recettes affichées"; // Set recipe count to 0
      return;
    }

    // Render each recipe card
    recipes.forEach((recipe) => {
      const recipeCard = new RecipeCard(recipe);
      container.appendChild(recipeCard.createRecipeCard());
    });

    // Update the recipe count after rendering
    recipeCountElement.textContent = `${recipes.length} recette${
      recipes.length > 1 ? "s" : ""
    } trouvée${recipes.length > 1 ? "s" : ""}`;
  }

  // Update dropdown options based on the current set of filtered recipes
  updateFiltersBasedOnRecipes(filteredRecipes) {
    const ingredients = new Set();
    const appliances = new Set();
    const utensils = new Set();

    // Extract ingredients, appliances, and utensils from the filtered recipes
    filteredRecipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        ingredients.add(ingredient.ingredient);
      });
      appliances.add(recipe.appliance);
      recipe.ustensils.forEach((utensil) => utensils.add(utensil));
    });

    // Update dropdown options and sort them alphabetically
    this.ingredientsDropdown.updateOptions([...ingredients].sort(), this.activeTags);
    this.appliancesDropdown.updateOptions([...appliances].sort(), this.activeTags);
    this.utensilsDropdown.updateOptions([...utensils].sort(), this.activeTags);
  }

  // Initialize the filters and populate dropdowns with initial data
  initFilters() {
    // Fetch ingredients, appliances, and utensils from the API
    const ingredients = this.api.getAllIngredients();
    const appliances = this.api.getAllAppliances();
    const utensils = this.api.getAllUtensils();

    // Populate dropdowns with initial data
    this.ingredientsDropdown.updateOptions(ingredients.sort(), this.activeTags);
    this.appliancesDropdown.updateOptions(appliances.sort(), this.activeTags);
    this.utensilsDropdown.updateOptions(utensils.sort(), this.activeTags);
  }
}
