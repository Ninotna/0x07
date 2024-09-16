import Dropdown from './Dropdown.js'; // Adjust the path as necessary
import RecipeCard from '../layout/RecipeCard.js';
import TagManager from './TagManager.js';

export default class FilterManager {
    constructor(api) {
        this.api = api;
        this.tagManager = new TagManager(this, 'tags-container'); // Initialize TagManager
        
        // Initialize activeTags with arrays for each type (ingredient, appliance, utensil)
        this.activeTags = {
            ingredient: [],
            appliance: [],
            utensil: []
        };

        // Initialize dropdowns for ingredients, appliances, and utensils
        this.ingredientsDropdown = new Dropdown('ingredientsFilter', 'ingredientsDropdown', (selectedIngredient) => {
            this.tagManager.addTag('ingredient', selectedIngredient);
            this.activeTags.ingredient.push(selectedIngredient);
            this.updateFiltersBasedOnTags(); // Update filters when a tag is added
        });

        this.appliancesDropdown = new Dropdown('appliancesFilter', 'appliancesDropdown', (selectedAppliance) => {
            this.tagManager.addTag('appliance', selectedAppliance);
            this.activeTags.appliance.push(selectedAppliance);
            this.updateFiltersBasedOnTags(); // Update filters when a tag is added
        });

        this.utensilsDropdown = new Dropdown('utensilsFilter', 'utensilsDropdown', (selectedUtensil) => {
            this.tagManager.addTag('utensil', selectedUtensil);
            this.activeTags.utensil.push(selectedUtensil);
            this.updateFiltersBasedOnTags(); // Update filters when a tag is added
        });
    }

    // Initialize filters and populate dropdowns
    initFilters() {
        const ingredients = this.api.getAllIngredients();
        const appliances = this.api.getAllAppliances();
        const utensils = this.api.getAllUtensils();

        this.updateDropdown('ingredientsDropdown', ingredients, 'ingredient', this.tagManager);
        this.updateDropdown('appliancesDropdown', appliances, 'appliance', this.tagManager);
        this.updateDropdown('utensilsDropdown', utensils, 'utensil', this.tagManager);
    }

    // Update dropdown with new items
    updateDropdown(dropdownId, items, type, tagManager) {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) {
            console.error(`Dropdown with ID ${dropdownId} not found`);
            return;
        }

        const ul = dropdown.querySelector('ul');
        ul.innerHTML = ''; // Clear the existing dropdown items

        items.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('p-2', 'cursor-pointer', 'hover:bg-yellow-100');
            li.textContent = item;
            ul.appendChild(li);

            // Attach event listener to add the tag on click
            li.addEventListener('click', () => {
                if (tagManager && typeof tagManager.addTag === 'function') {
                    tagManager.addTag(type, item); // Add tag to the tagManager
                } else {
                    console.error('tagManager is not defined or addTag is not a function');
                }
            });
        });
    }

    // Update filters based on selected tags
    updateFiltersBasedOnTags() {
        const { ingredient, appliance, utensil } = this.activeTags;

        // Filter recipes based on the active tags
        const filteredRecipes = this.api.getRecipesByTags(ingredient, appliance, utensil);

        // Render filtered recipes
        this.renderRecipes(filteredRecipes);

        // Update dropdowns (filters) based on the filtered recipes
        this.updateFiltersBasedOnRecipes(filteredRecipes);
    }

    // Filter recipes by search term and active tags
    filterRecipes(searchTerm, searchManager) {
        // First, filter recipes based on the active tags
        let filteredRecipes = this.api.getRecipesByTags(
            this.activeTags.ingredient,
            this.activeTags.appliance,
            this.activeTags.utensil
        );

        // Refine the filtered recipes by the search term
        filteredRecipes = searchManager.searchRecipes(searchTerm, filteredRecipes);

        // Render the filtered recipes
        this.renderRecipes(filteredRecipes);

        // Update dropdown options based on the filtered recipes
        this.updateFiltersBasedOnRecipes(filteredRecipes);
    }

    // Render the filtered recipes
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

    // Update dropdowns (filters) based on filtered recipes
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

    // Method to remove a tag and update filters accordingly
    removeFilter(type, value) {
        if (!this.activeTags[type]) {
            console.error(`Invalid tag type: ${type}`);
            return;
        }

        // Remove the tag from the activeTags array for the specified type
        this.activeTags[type] = this.activeTags[type].filter(tag => tag !== value);

        // Update the filters and recipes after removing the tag
        this.updateFiltersBasedOnTags();
    }
}
