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

// Debounce function to improve performance when typing in the search bar
function debounce(func, wait) {
	let timeout;
	return function (...args) {
		const later = () => {
			clearTimeout(timeout);
			func.apply(this, args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

// Render all recipes on the page
function renderRecipes(recipes, searchTerm = "") {
	const container = document.getElementById("recipes-container");
	container.innerHTML = ""; // Clear previous recipes

	// Ensure recipes array is valid
	if (!recipes || !Array.isArray(recipes)) {
		console.error("Invalid recipe data or 'recipes' is not an array.");
		const messageContainer = document.getElementById("message-container");
		messageContainer.innerHTML = "An error occurred while loading recipes."; // Display error message
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
	"recipes-container", // Recipe container ID
	"recipeCount" // Recipe count display ID
);

const searchManager = new RecipeSearchManager(
	recipes, // List of recipes
	"recipes-container", // Recipe container ID
	"message-container" // Message display ID
);

// Main search bar event listener for filtering recipes based on input (with debounce)
document.getElementById("search-bar").addEventListener(
	"input",
	debounce((e) => {
		const searchTerm = e.target.value.trim();
		filterRecipes(searchTerm); // Filter and display recipes
		filterManager.updateSearchTerm(searchTerm); // Update filters based on search term
		handleInput(e.target); // Manage visibility of the clear button
	}, 300) // Debounce the input to limit the frequency of search execution
);

// Event listeners for dropdown search functionality (ingredients, appliances, etc.)
document.querySelectorAll(".dropdown-search").forEach((dropdownSearchBar) => {
	dropdownSearchBar.addEventListener("input", debounce((e) => {
		const searchTerm = e.target.value.trim();
		const dropdownId = dropdownSearchBar.getAttribute("data-dropdown-id");

		// Filter dropdown options based on the search input
		filterManager.filterDropdown(dropdownId, searchTerm);
	}, 300)); // Debouncing dropdown search too for performance
});

// Function to manage the clear button visibility and behavior, and trigger search only after 3 characters
window.handleInput = function (input) {
	const clearButton = document.querySelector(".clear-btn");
	const searchTerm = input.value.trim(); // Trimmed input value

	// Show or hide the clear button based on input length
	if (searchTerm.length > 0) {
		clearButton.classList.remove("hidden"); // Show the clear button
		clearButton.style.visibility = "visible"; // Ensure visibility in case of styling conflicts
	} else {
		clearButton.classList.add("hidden"); // Hide the clear button
		clearButton.style.visibility = "hidden";
	}

	// Trigger search only when there are 3 or more characters
	if (searchTerm.length >= 3) {
		filterRecipes(searchTerm); // Call function to filter recipes
	} else {
		// If fewer than 3 characters, reset the displayed recipes and filters
		renderRecipes(recipes); // Show all recipes
		filterManager.resetFilters(); // Optionally reset filters
	}
};


// Function to clear the input, hide the clear button, reset filters, and show all recipes
window.clearInput = function () {
	const input = document.querySelector("#search-bar");
	const clearButton = document.querySelector(".clear-btn");

	// Clear the input field
	input.value = "";

	// Hide the clear button
	clearButton.classList.add("hidden");
	clearButton.style.visibility = "hidden";

  // OPTION 1: Clear only the search term in FilterManager (do not reset dropdown filters)
	filterManager.updateSearchTerm(""); // Clear the search term but retain active filters

	// OPTION 2: Reset filters and show all recipes
	// filterManager.resetFilters(); // Reset any active filters
	// renderRecipes(recipes); // Show all recipes after clearing

	// Optionally update any dropdowns or filter UI elements
	filterManager.updateFiltersBasedOnRecipes(recipes); // Update filter UI based on all recipes
};


// Perform the search action when the search button is clicked
window.performSearch = function() {
  const searchTerm = document.getElementById("search-bar").value.trim();
  if (searchTerm) {
    // Implement your search logic here
    console.log("Searching for:", searchTerm);
    debounce((e) => {
      const searchTerm = e.target.value.trim();
      filterRecipes(searchTerm); // Filter and display recipes
      filterManager.updateSearchTerm(searchTerm); // Update filters based on search term
      handleInput(e.target); // Manage visibility of the clear button
    }, 300) // Debounce the input to limit the frequency of search execution
  }
}

// Display the initial set of recipes
displayManager.renderRecipes(recipes);
