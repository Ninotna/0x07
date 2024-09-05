import { recipes } from './data/recipes.js'; // Importer les données depuis recipes.js
import Api from './api/Api.js';              // Importer l'API de gestion des données
import FilterManager from './components/FilterManager.js'; // Importer le gestionnaire de filtres
import Dropdown from './components/Dropdown.js'; // Importer la gestion des dropdowns
import RecipeDisplayManager from './utils/RecipeDisplayManager.js'; // Pour l'affichage des recettes
import RecipeSearchManager from './components/RecipeSearchManager.js'; // Pour la recherche principale
import RecipeCard  from './layout/RecipeCard.js'; // Adjust path based on file location

// Instanciation de l'API avec les données importées
const api = new Api(recipes);

// Instanciation du gestionnaire de filtres
const filterManager = new FilterManager(api);

// Fonction de rendu des cartes de recettes
function renderRecipes(recipes) {
    const container = document.getElementById('recipes-container');
    container.innerHTML = ''; // Effacer les résultats précédents


	        // Scénario alternatif A1 : Si aucune recette n'a été trouvée
        if (recipes.length === 0)
        {
            RecipeSearchManager.displayNoResultsMessage(searchTerm); // Afficher un message d'absence de résultats
			return;
        }

    recipes.forEach((recipe) => {
        // Crée une nouvelle instance de RecipeCard
        const recipeCard = new RecipeCard(recipe);
        // Ajouter la carte créée dans le conteneur
        container.appendChild(recipeCard.createRecipeCard());
    });
}

// Fonction de filtre pour les recettes selon un terme de recherche (Main Search-bar)
function filterRecipes(searchTerm) {
    const filteredRecipes = searchManager.searchRecipes(searchTerm); // Utilise RecipeSearchManager pour la recherche
    renderRecipes(filteredRecipes);
}

// Initialisation des dropdowns pour chaque filtre (Filter Search-bar)
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

// Initialisation des filtres
filterManager.initFilters();

// Chargement initial des recettes
renderRecipes(recipes);

// Instancier le RecipeDisplayManager
const displayManager = new RecipeDisplayManager('recipes-container', 'recipeCount');

// Instancier la classe RecipeSearchManager pour la recherche principale
const searchManager = new RecipeSearchManager(recipes, 'recipes-container', 'message-container');

// Gestion de la recherche dans la barre de recherche principale (Main Search-bar)
document.getElementById('search-bar').addEventListener('input', (e) => {
    const searchTerm = e.target.value;

    // Filtrer les recettes en fonction du terme de recherche
    filterRecipes(searchTerm);
});

// Gestion de la recherche dans les dropdowns (Filter Search-bar)
document.querySelectorAll('.dropdown-search').forEach((dropdownSearchBar) => {
    dropdownSearchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        const dropdownId = dropdownSearchBar.getAttribute('data-dropdown-id');
        
        // Mettre à jour les éléments du dropdown en fonction de la recherche
        filterManager.filterDropdown(dropdownId, searchTerm);
    });
});

// Afficher les recettes initiales
displayManager.renderRecipes(recipes);
