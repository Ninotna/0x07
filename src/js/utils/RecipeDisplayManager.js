import  RecipeCard  from '../layout/RecipeCard.js'; 

class RecipeDisplayManager
{
	constructor(recipesContainerId, recipeCountId)
	{
		this.recipesContainer = document.getElementById(recipesContainerId);
		this.recipeCountElement = document.getElementById(recipeCountId);
	}

	/**
	 * Met à jour le compteur de recettes affichées.
	 * @param {number} count - Le nombre de recettes à afficher.
	 */
	updateRecipeCount(count)
	{
		this.recipeCountElement.textContent = count;
	}

	/**
	 * Rend les cartes de recettes dans le conteneur.
	 * @param {Array} recipes - Le tableau des recettes à afficher.
	 */
	renderRecipes(recipes) {
		const container = document.getElementById('recipes-container');
		container.innerHTML = ''; // Clear previous results
	
		// Check if recipes is a valid array
		if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
			console.error('No recipes found to display');
			return;
		}
	
		recipes.forEach((recipe) => {
			// Create a new instance of RecipeCard
			const recipeCard = new RecipeCard(recipe);
			// Append the created card to the container
			container.appendChild(recipeCard.createRecipeCard());
		});

		// Mettre à jour le compteur de recettes
		this.updateRecipeCount(recipes.length);
	}
}

export default RecipeDisplayManager;
