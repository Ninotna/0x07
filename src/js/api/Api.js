// src/js/api/Api.js
export default class Api
{
	constructor(data)
	{
		// Vérification que les données sont correctement passées
		if (!Array.isArray(data)) {
			throw new Error('Les données des recettes doivent être un tableau.');
		}
		this.data = data;
	}

	// Récupérer tous les ingrédients uniques
	getAllIngredients()
	{
		if (!this.data || !Array.isArray(this.data)) {
			return [];
		}

		const ingredientsSet = new Set();
		this.data.forEach(recipe => {
			recipe.ingredients.forEach(ingredient => {
				ingredientsSet.add(ingredient.ingredient);
			});
		});
		return Array.from(ingredientsSet); // Retourne un tableau d'ingrédients uniques
	}

	// Récupérer tous les appareils uniques
	getAllAppliances()
	{
		if (!this.data || !Array.isArray(this.data)) {
			return [];
		}

		const appliancesSet = new Set();
		this.data.forEach(recipe => {
			appliancesSet.add(recipe.appliance);
		});
		return Array.from(appliancesSet); // Retourne un tableau d'appareils uniques
	}

	// Récupérer tous les ustensiles uniques
	getAllUtensils()
	{
		if (!this.data || !Array.isArray(this.data)) {
			return [];
		}

		const utensilsSet = new Set();
		this.data.forEach(recipe => {
			recipe.ustensils.forEach(utensil => {
				utensilsSet.add(utensil);
			});
		});
		return Array.from(utensilsSet); // Retourne un tableau d'ustensiles uniques
	}
}
