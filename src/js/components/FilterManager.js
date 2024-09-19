import Dropdown from "./Dropdown.js"; // Adjust the path as necessary
import RecipeCard from "../layout/RecipeCard.js";
import TagManager from "./TagManager.js";

export default class FilterManager {
  constructor(api) {
    this.api = api;
    this.tagManager = new TagManager(this, "tags-container"); // Initialize TagManager

    // Initialize activeTags with arrays for each type (ingredient, appliance, utensil)
    this.activeTags = {
      ingredient: [],
      appliance: [],
      utensil: [],
    };

    this.searchTerm = ""; // Initialize search term

    // Initialize dropdowns for ingredients, appliances, and utensils
    this.ingredientsDropdown = new Dropdown(
      "ingredientsFilter",
      "ingredientsDropdown",
      (selectedIngredient) => {
        this.addTagAndUpdate("ingredient", selectedIngredient);
      }
    );

    this.appliancesDropdown = new Dropdown(
      "appliancesFilter",
      "appliancesDropdown",
      (selectedAppliance) => {
        this.addTagAndUpdate("appliance", selectedAppliance);
      }
    );

    this.utensilsDropdown = new Dropdown(
      "utensilsFilter",
      "utensilsDropdown",
      (selectedUtensil) => {
        this.addTagAndUpdate("utensil", selectedUtensil);
      }
    );
  }

  // Add the selected tag, update activeTags, and render recipes
  addTagAndUpdate(type, value) {
    if (!this.activeTags[type].includes(value)) {
      this.activeTags[type].push(value); // Add tag if not already present
    }
    this.tagManager.addTag(type, value); // Add the tag to the TagManager UI
    this.updateFiltersAndRenderRecipes(); // Update filters and render recipes
  }

  // Remove the tag, update activeTags and render recipes
  removeFilter(type, value) {
    if (!this.activeTags[type]) {
      console.error(`Invalid tag type: ${type}`);
      return;
    }

    // Remove the tag from the activeTags array for the specified type
    this.activeTags[type] = this.activeTags[type].filter(
      (tag) => tag !== value
    );

    // Update the filters and recipes after removing the tag
    this.updateFiltersAndRenderRecipes();
  }

  // **AND Condition**: Filter recipes based on both tags and search term and update dropdowns
  updateFiltersAndRenderRecipes() {
    const { ingredient, appliance, utensil } = this.activeTags;

    // Step 1: Filter recipes based on the selected tags
    let filteredRecipes = this.api.getRecipesByTags(
      ingredient,
      appliance,
      utensil
    );

    // Step 2: Apply the search term filter ONLY to the recipes already filtered by tags
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

    // Debug: Log the number of filtered recipes
    console.log("Filtered Recipes:", filteredRecipes.length);

    // Step 3: Render the filtered recipes
    this.renderRecipes(filteredRecipes);

    // Step 4: Update the dropdowns (filters) based on the filtered recipes
    this.updateFiltersBasedOnRecipes(filteredRecipes);
  }

  // Update the search term and re-filter recipes
  updateSearchTerm(searchTerm) {
    this.searchTerm = searchTerm; // Store the search term
    this.updateFiltersAndRenderRecipes(); // Re-filter recipes based on tags and search term
  }

  // Update the dropdowns (filters) based on filtered recipes
  updateFiltersBasedOnRecipes(filteredRecipes) {
    const ingredients = new Set();
    const appliances = new Set();
    const utensils = new Set();

    // Loop through filtered recipes to extract ingredients, appliances, and utensils
    filteredRecipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        if (ingredient.ingredient) {
          ingredients.add(ingredient.ingredient);
        }
      });
      appliances.add(recipe.appliance);
      recipe.ustensils.forEach((utensil) => utensils.add(utensil));
    });

    // Update the dropdowns with new filter options
    this.ingredientsDropdown.updateOptions([...ingredients]);
    this.appliancesDropdown.updateOptions([...appliances]);
    this.utensilsDropdown.updateOptions([...utensils]);
  }

  // Render filtered recipes
  renderRecipes(recipes) {
    const container = document.getElementById("recipes-container");
    const recipeCountElement = document.getElementById("recipeCount");

    container.innerHTML = ""; // Clear previous results

    // Debug: Log how many recipes are about to be rendered
    // console.log("Rendering Recipes:", recipes.length);

    if (!recipes || recipes.length === 0) {
      container.innerHTML =
        '<p class="text-center text-gray-500">Aucune recette trouvée.</p>';
      recipeCountElement.textContent = "0 recettes affichées"; // Set count to 0
      return;
    }

    // Render each recipe card
    recipes.forEach((recipe) => {
      const recipeCard = new RecipeCard(recipe);
      container.appendChild(recipeCard.createRecipeCard());
    });

    // Update the recipe count AFTER rendering the recipes
    recipeCountElement.textContent = `${recipes.length} recette${
      recipes.length > 1 ? "s" : ""
    } trouvée${recipes.length > 1 ? "s" : ""}`;
  }

  // Initialize filters and populate dropdowns
  initFilters() {
    const ingredients = this.api.getAllIngredients();
    const appliances = this.api.getAllAppliances();
    const utensils = this.api.getAllUtensils();

    this.updateDropdown(
      "ingredientsDropdown",
      ingredients,
      "ingredient",
      this.tagManager
    );
    this.updateDropdown(
      "appliancesDropdown",
      appliances,
      "appliance",
      this.tagManager
    );
    this.updateDropdown(
      "utensilsDropdown",
      utensils,
      "utensil",
      this.tagManager
    );
  }

  // Update dropdown with new items
  updateDropdown(dropdownId, items, type, tagManager) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) {
      console.error(`Dropdown with ID ${dropdownId} not found`);
      return;
    }

    const ul = dropdown.querySelector("ul");
    ul.innerHTML = ""; // Clear the existing dropdown items

    items.forEach((item) => {
      const li = document.createElement("li");
      li.classList.add("p-2", "cursor-pointer", "hover:bg-yellow-100");
      li.textContent = item;
      ul.appendChild(li);

      // Attach event listener to add the tag on click
      li.addEventListener("click", () => {
        tagManager.addTag(type, item); // Add tag to the tagManager
        this.addTagAndUpdate(type, item); // Add tag and update the recipes and filters
      });
    });
  }
}
