import RecipeCard from '../layout/RecipeCard.js';

class RecipeDisplayManager {
    constructor(recipesContainerId, recipeCountId) {
        // Ensure the container and count elements exist before assigning
        this.recipesContainer = document.getElementById(recipesContainerId);
        this.recipeCountElement = document.getElementById(recipeCountId);

        if (!this.recipesContainer) {
            console.error(`Element with ID ${recipesContainerId} not found.`);
        }
        if (!this.recipeCountElement) {
            console.error(`Element with ID ${recipeCountId} not found.`);
        }
    }

    /**
     * Met à jour le compteur de recettes affichées.
     * @param {number} count - Le nombre de recettes à afficher.
     */
    updateRecipeCount(count) {
        if (this.recipeCountElement) {
            this.recipeCountElement.textContent = `${count} recette${count > 1 ? 's' : ''} affichée${count > 1 ? 's' : ''}`;
        }
    }

    /**
     * Rend les cartes de recettes dans le conteneur.
     * @param {Array} recipes - Le tableau des recettes à afficher.
     */
    renderRecipes(recipes) {
        if (!this.recipesContainer) {
            console.error('Recipes container is not available.');
            return;
        }

        // Clear the container before rendering
        this.recipesContainer.innerHTML = ''; 

        // If no recipes found, display a message and set count to 0
        if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
            this.recipesContainer.innerHTML = '<p class="text-center text-gray-500">Aucune recette trouvée.</p>';
            this.updateRecipeCount(0); // Set recipe count to 0
            return;
        }

        // Render each recipe card
        recipes.forEach((recipe) => {
            const recipeCard = new RecipeCard(recipe);
            this.recipesContainer.appendChild(recipeCard.createRecipeCard());
        });

        // Update recipe count after rendering
        this.updateRecipeCount(recipes.length);
    }
}

export default RecipeDisplayManager;
