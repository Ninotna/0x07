export default class SearchBarController {
  constructor(searchManager, filterManager, renderCallback) {
    this.searchManager = searchManager;
    this.filterManager = filterManager;
    this.renderCallback = renderCallback;
    this.initEventListeners();
  }

  // Initialize event listeners
  initEventListeners() {
    const searchBar = document.getElementById("search-bar");
    const clearButton = document.querySelector(".clear-btn");

    searchBar.addEventListener("input", (e) => this.handleInput(e.target));
    clearButton.addEventListener("click", () => this.clearInput());
  }

  // Handle input in the search bar
  handleInput(input) {
    const searchTerm = input.value.trim();
    this.toggleClearButton(searchTerm);

    // If the input has 3 or more characters, filter recipes with the search term
    if (searchTerm.length >= 3) {
      this.filterRecipes(searchTerm);
    } else {
      // Reset search term when input is cleared or too short
      this.clearSearchTermAndApplyTagFilters();
    }
  }

  // Show or hide the "x" button based on the input value
  toggleClearButton(searchTerm) {
    const clearButton = document.querySelector(".clear-btn");
    if (searchTerm.length > 0) {
      clearButton.classList.remove("hidden");
      clearButton.style.visibility = "visible";
    } else {
      clearButton.classList.add("hidden");
      clearButton.style.visibility = "hidden";
    }
  }

  // Clear the search term and reset the filtering to only the active tags
  clearInput() {
    const input = document.getElementById("search-bar");
    const clearButton = document.querySelector(".clear-btn");

    // Clear the search bar
    input.value = "";

    // Hide the "x" button
    clearButton.classList.add("hidden");
    clearButton.style.visibility = "hidden";

    // Clear the search term and apply only the active tag filters
    this.clearSearchTermAndApplyTagFilters();
  }

  // Clear the search term and apply filters based on active tags only
  clearSearchTermAndApplyTagFilters() {
    // Effacer le terme de recherche dans le FilterManager
    this.filterManager.updateSearchTerm("");

    // Obtenir les tags actifs
    const { ingredient, appliance, utensil } =
      this.filterManager.getActiveTags();

    // Filtrer les recettes basées sur les tags actifs
    const filteredRecipes = this.searchManager.searchRecipesByTags(
      ingredient,
      appliance,
      utensil
    );

    // Rendre les recettes filtrées et mettre à jour le compteur
    this.renderCallback(filteredRecipes);

    // Mettre à jour les options des dropdowns
    this.filterManager.updateFiltersBasedOnRecipes(filteredRecipes);
  }

  // Filter recipes with the search term
  filterRecipes(searchTerm) {
    const filteredRecipes =
      this.filterManager.filterRecipesByTagsAndSearch(searchTerm);
    this.renderCallback(filteredRecipes); // Render filtered recipes
    this.filterManager.updateFiltersBasedOnRecipes(filteredRecipes); // Update filters
  }
}
