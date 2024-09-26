// utils/RecipeDisplayManager.js

import RecipeCard from '../layout/RecipeCard.js';

class RecipeDisplayManager {
    constructor(recipesContainerId, recipeCountId) {
        // Get the recipe container and recipe count elements by their IDs
        this.recipesContainer = document.getElementById(recipesContainerId);
        this.recipeCountElement = document.getElementById(recipeCountId);

        // Log errors if the elements are not found
        if (!this.recipesContainer) {
            console.error(`Element with ID ${recipesContainerId} not found.`);
        }
        if (!this.recipeCountElement) {
            console.error(`Element with ID ${recipeCountId} not found.`);
        }
    }

    /**
     * Updates the displayed recipe count in the UI.
     * @param {number} count - The number of recipes to display.
     */
    updateRecipeCount(count) {
        if (this.recipeCountElement) {
            this.recipeCountElement.textContent = `${count} recette${count > 1 ? 's' : ''} affichée${count > 1 ? 's' : ''}`;
        }
    }

    /**
     * Renders recipe cards in the specified container.
     * @param {Array} recipes - An array of recipe objects to display.
     */
    renderRecipes(recipes) {
        if (!this.recipesContainer) {
            console.error('Recipes container is not available.');
            return;
        }

        // Clear any previously displayed content
        this.recipesContainer.innerHTML = ''; 

        // If no recipes are available, display a message and set recipe count to 0
        if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
            this.recipesContainer.innerHTML = '<p class="text-center text-gray-500">Aucune recette trouvée.</p>';
            this.updateRecipeCount(0);
            return;
        }

        // Loop through each recipe and create a card
        recipes.forEach((recipe) => {
            const recipeCard = new RecipeCard(recipe);
            this.recipesContainer.appendChild(recipeCard.createRecipeCard());
        });

        // Update the recipe count after rendering
        this.updateRecipeCount(recipes.length);
    }
}

export default RecipeDisplayManager;

