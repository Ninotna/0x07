import { RecipeCard } from '../layout/RecipeCard.js'; // Assurez-vous que le chemin est correct

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
	renderRecipes(recipes)
	{
		// Effacer les résultats précédents
		this.recipesContainer.innerHTML = '';

		// Parcourir chaque recette et l'ajouter dans le conteneur
		recipes.forEach((recipe) =>
		{
			// Crée une nouvelle instance de RecipeCard
			const recipeCard = new RecipeCard(recipe);

			// Ajouter la carte créée dans le conteneur
			this.recipesContainer.appendChild(recipeCard.createRecipeCard());
		});

		// Mettre à jour le compteur de recettes
		this.updateRecipeCount(recipes.length);
	}
}

export default RecipeDisplayManager;
