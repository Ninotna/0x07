// src/js/main.js
import { recipes } from './data/recipes.js'; // Importer les données depuis recipes.js
import Api from './api/Api.js';
import FilterManager from './components/FilterManager.js';
import Dropdown from './components/Dropdown.js';

// Instanciation de l'API avec les données importées
const api = new Api(recipes);

// Instanciation du gestionnaire de filtres
const filterManager = new FilterManager(api);

// Initialisation des dropdowns pour chaque filtre
const ingredientsDropdown = new Dropdown(
  'ingredientsFilter',
  'ingredientsDropdown',
  (selectedIngredient) => {
    const filteredRecipes = api.getRecipesByIngredient(selectedIngredient);
    filterManager.updateRecipes(filteredRecipes); // Mise à jour des recettes affichées
  }
);

const appliancesDropdown = new Dropdown(
  'appliancesFilter',
  'appliancesDropdown',
  (selectedAppliance) => {
    const filteredRecipes = api.getRecipesByAppliance(selectedAppliance);
    filterManager.updateRecipes(filteredRecipes); // Mise à jour des recettes affichées
  }
);

const utensilsDropdown = new Dropdown(
  'utensilsFilter',
  'utensilsDropdown',
  (selectedUtensil) => {
    const filteredRecipes = api.getRecipesByUtensil(selectedUtensil);
    filterManager.updateRecipes(filteredRecipes); // Mise à jour des recettes affichées
  }
);

// Initialisation des filtres (si nécessaire)
filterManager.initFilters();
