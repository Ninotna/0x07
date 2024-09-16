import Dropdown from './Dropdown.js'; // Adjust the path as necessary
import RecipeCard from '../layout/RecipeCard.js';
import TagManager from './TagManager.js';

export default class FilterManager {
	constructor(api) {
		this.api = api;
		this.tagManager = new TagManager(this,'tags-container'); // Store the tagManager instance
		this.recipesContainer = document.getElementById('recipesContainer'); // L'élément où les recettes seront affichées

		// Initialize dropdowns
		this.ingredientsDropdown = new Dropdown('ingredientsFilter', 'ingredientsDropdown', (selectedIngredient) => {
			// Handle ingredient selection
			const filteredRecipes = this.api.getRecipesByIngredient(selectedIngredient);
			this.renderRecipes(filteredRecipes);
			this.tagManager.addTag('ingredient', selectedIngredient);
		});

		this.appliancesDropdown = new Dropdown('appliancesFilter', 'appliancesDropdown', (selectedAppliance) => {
			// Handle appliance selection
			const filteredRecipes = this.api.getRecipesByAppliance(selectedAppliance);
			this.renderRecipes(filteredRecipes);
			this.tagManager.addTag('appliance', selectedAppliance);
		});

		this.utensilsDropdown = new Dropdown('utensilsFilter', 'utensilsDropdown', (selectedUtensil) => {
			// Handle utensil selection
			const filteredRecipes = this.api.getRecipesByUtensil(selectedUtensil);
			this.renderRecipes(filteredRecipes);
			this.tagManager.addTag('utensil', selectedUtensil);
		});
	}

	// Initialize filters and update dropdowns
	initFilters() {
		// Get all unique ingredients, appliances, and utensils
		const ingredients = this.api.getAllIngredients();
		const appliances = this.api.getAllAppliances();
		const utensils = this.api.getAllUtensils();

		// Update the dropdowns with initial values
		this.updateDropdown('ingredientsDropdown', ingredients, 'ingredient', this.tagManager);
		this.updateDropdown('appliancesDropdown', appliances, 'appliance', this.tagManager);
		this.updateDropdown('utensilsDropdown', utensils, 'utensil', this.tagManager);
	}

	// Update the dropdown with items
	updateDropdown(dropdownId, items, type, tagManager) {
		const dropdown = document.getElementById(dropdownId); // Assurez-vous que l'élément existe
		if (!dropdown) {
			console.error(`Dropdown with ID ${dropdownId} not found`);
			return;
		}

		const ul = dropdown.querySelector('ul');
		ul.innerHTML = ''; // Vider les éléments existants

		// Add new items to the list
		items.forEach(item => {
			const li = document.createElement('li');
			li.classList.add('p-2', 'cursor-pointer', 'hover:bg-yellow-100');
			li.textContent = item;
			ul.appendChild(li);

			// Attach event listener to add tag
			li.addEventListener('click', () => {
				console.log(`Selected tag: ${item}`);
				if (tagManager && typeof tagManager.addTag === 'function') {
					tagManager.addTag(type, item); // Add tag to tagManager
				} else {
					console.error('tagManager is not defined or addTag is not a function');
				}
			});
		});
	}

	// Filter recipes by search term and update dropdowns
	filterRecipes(searchTerm, searchManager, tagManager) {
		// Filter recipes
		const filteredRecipes = searchManager.searchRecipes(searchTerm);

		// Render filtered recipes
		this.renderRecipes(filteredRecipes, searchTerm);

		// Update the filters based on filtered recipes
		this.updateFiltersBasedOnRecipes(filteredRecipes);

		// Update tags if necessary
		tagManager.updateTags(filteredRecipes);
	}

	// Render filtered recipes
	renderRecipes(recipes, searchTerm = '') {
		const container = document.getElementById('recipes-container');
		container.innerHTML = ''; // Clear previous results

		if (!recipes || recipes.length === 0) {
			const messageContainer = document.getElementById('message-container');
			const suggestions = "vous pouvez chercher « tarte aux pommes », « poisson », etc.";
			messageContainer.innerHTML = `Aucune recette ne contient ‘${searchTerm}’. ${suggestions}`;
			return;
		}

		recipes.forEach((recipe) => {
			const recipeCard = new RecipeCard(recipe);
			container.appendChild(recipeCard.createRecipeCard());
		});
	}

	// Update dropdown options based on filtered recipes
	updateFiltersBasedOnRecipes(filteredRecipes) {
		const ingredients = new Set();
		const appliances = new Set();
		const utensils = new Set();

		// Loop through filtered recipes
		filteredRecipes.forEach((recipe) => {
			// Add ingredients to the set
			recipe.ingredients.forEach((ingredient) => {
				if (ingredient.ingredient) {
					ingredients.add(ingredient.ingredient);
				}
			});

			// Add appliances and utensils
			appliances.add(recipe.appliance);
			recipe.ustensils.forEach((utensil) => utensils.add(utensil));
		});

		// Update dropdown options
		this.ingredientsDropdown.updateOptions([...ingredients]);
		this.appliancesDropdown.updateOptions([...appliances]);
		this.utensilsDropdown.updateOptions([...utensils]);
	}
}
