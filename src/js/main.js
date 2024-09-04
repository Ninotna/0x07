// src/main.js

import { recipes } from './data/recipes.js'; // Importer les données depuis recipes.js
import Api from './api/Api.js';              // Importer l'API de gestion des données
import FilterManager from './components/FilterManager.js'; // Importer le gestionnaire de filtres
import Dropdown from './components/Dropdown.js'; // Importer la gestion des dropdowns
import { RecipeCard } from './layout/RecipeCard.js'; // Importer la classe RecipeCard

// Instanciation de l'API avec les données importées
const api = new Api(recipes);

// Instanciation du gestionnaire de filtres
const filterManager = new FilterManager(api);

// Fonction de rendu des cartes de recettes
function renderRecipes(recipes)
{
	const container = document.getElementById('recipes-container');
	container.innerHTML = ''; // Effacer les résultats précédents

	recipes.forEach((recipe) =>
	{
		// Crée une nouvelle instance de RecipeCard
		const recipeCard = new RecipeCard(recipe);
		// Ajouter la carte créée dans le conteneur
		container.appendChild(recipeCard.createRecipeCard());
	});
}

// Fonction de filtre pour les recettes selon un terme de recherche
function filterRecipes(searchTerm)
{
	const filteredRecipes = api.searchRecipes(searchTerm);
	renderRecipes(filteredRecipes);
}

// Initialisation des dropdowns pour chaque filtre
const ingredientsDropdown = new Dropdown(
	'ingredientsFilter',
	'ingredientsDropdown',
	(selectedIngredient) => {
		const filteredRecipes = api.getRecipesByIngredient(selectedIngredient);
		renderRecipes(filteredRecipes); // Mise à jour des recettes affichées
	}
);

const appliancesDropdown = new Dropdown(
	'appliancesFilter',
	'appliancesDropdown',
	(selectedAppliance) => {
		const filteredRecipes = api.getRecipesByAppliance(selectedAppliance);
		renderRecipes(filteredRecipes); // Mise à jour des recettes affichées
	}
);

const utensilsDropdown = new Dropdown(
	'utensilsFilter',
	'utensilsDropdown',
	(selectedUtensil) => {
		const filteredRecipes = api.getRecipesByUtensil(selectedUtensil);
		renderRecipes(filteredRecipes); // Mise à jour des recettes affichées
	}
);

// Event listener pour la barre de recherche
document.getElementById('search-bar').addEventListener('input', (e) =>
{
	const searchTerm = e.target.value;
	filterRecipes(searchTerm);
});

// Initialisation des filtres (si nécessaire)
filterManager.initFilters();

// Chargement initial des recettes
renderRecipes(recipes);
