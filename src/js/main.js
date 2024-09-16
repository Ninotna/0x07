import { recipes } from './data/recipes.js'; // Importer les données depuis recipes.js
import Api from './api/Api.js';              // Importer l'API de gestion des données
import FilterManager from './components/FilterManager.js'; // Importer le gestionnaire de filtres
import Dropdown from './components/Dropdown.js'; // Importer la gestion des dropdowns
import RecipeDisplayManager from './utils/RecipeDisplayManager.js'; // Pour l'affichage des recettes
import RecipeSearchManager from './components/RecipeSearchManager.js'; // Pour la recherche principale
import RecipeCard  from './layout/RecipeCard.js'; // Adjust path based on file location
// import TagManager from './components/TagManager.js'; // Import the TagManager class


// Instanciation de l'API avec les données importées
const api = new Api(recipes);

// Instanciation du gestionnaire de filtres
const filterManager = new FilterManager(api);

// Instancier la classe TagManager
// const tagManager = new TagManager(filterManager, 'tags-container');

// Fonction de rendu des cartes de recettes
function renderRecipes(recipes, searchTerm = '') {
    const container = document.getElementById('recipes-container');
    container.innerHTML = ''; // Effacer les résultats précédents

    // Vérifier si recipes est défini et est un tableau
    if (!recipes || !Array.isArray(recipes)) {
        console.error("Aucune donnée de recette trouvée ou 'recipes' n'est pas un tableau.");
        const messageContainer = document.getElementById('message-container');
        messageContainer.innerHTML = "Une erreur s'est produite lors du chargement des recettes.";
        return;
    }

    // Scénario alternatif A1 : Si aucune recette n'a été trouvée
    if (recipes.length === 0) {
        const messageContainer = document.getElementById('message-container');
        const suggestions = "vous pouvez chercher « tarte aux pommes », « poisson », etc.";
        messageContainer.innerHTML = `Aucune recette ne contient ‘${searchTerm}’. ${suggestions}`;
        return;
    }

    // Vider le message d'erreur si des recettes sont trouvées
    const messageContainer = document.getElementById('message-container');
    messageContainer.innerHTML = '';

    // Sinon, on affiche les recettes
    recipes.forEach((recipe) => {
        // Crée une nouvelle instance de RecipeCard
        const recipeCard = new RecipeCard(recipe);

        // Ajouter une animation (facultatif)
        const recipeElement = recipeCard.createRecipeCard();
        recipeElement.classList.add('transition', 'opacity-0'); // Commencer avec une transparence

        container.appendChild(recipeElement);

        // Déclencher une animation (ex: fondre la recette progressivement)
        setTimeout(() => {
            recipeElement.classList.remove('opacity-0');
            recipeElement.classList.add('opacity-100');
        }, 100); // Légère pause pour voir l'effet de transition
    });
}


// Fonction de filtre pour les recettes selon un terme de recherche (Main Search-bar)
function filterRecipes(searchTerm) {
    const filteredRecipes = searchManager.searchRecipes(searchTerm);

    // Mise à jour des recettes affichées
    renderRecipes(filteredRecipes, searchTerm);

    // Mise à jour des filtres basés sur les recettes filtrées
    filterManager.updateFiltersBasedOnRecipes(filteredRecipes);
}


// Initialisation des dropdowns pour chaque filtre (Filter Search-bar)
// const ingredientsDropdown = new Dropdown(
//     'ingredientsFilter',
//     'ingredientsDropdown',
//     (selectedIngredient) => {
//         const filteredRecipes = api.getRecipesByIngredient(selectedIngredient);
//         renderRecipes(filteredRecipes); // Mise à jour des recettes affichées
        
//         // Add the selected ingredient as a tag
//         tagManager.addTag('ingredient', selectedIngredient);
//     }
// );

// console.log(ingredientsDropdown); // Should show a Dropdown instance
// console.log(typeof ingredientsDropdown.updateOptions); // Should log 'function'

// console.log(ingredientsDropdown); // Check if Dropdown instance is created correctly
// console.log(typeof ingredientsDropdown.updateOptions); // Should log 'function'
// console.log(Object.keys(ingredientsDropdown)); // Should include 'updateOptions'


// const appliancesDropdown = new Dropdown(
//     'appliancesFilter',
//     'appliancesDropdown',
//     (selectedAppliance) => {
//         const filteredRecipes = api.getRecipesByAppliance(selectedAppliance);
//         renderRecipes(filteredRecipes); // Mise à jour des recettes affichées
        
//         // Ajout du tag pour l'appareil sélectionné
//         tagManager.addTag('appliance', selectedAppliance);
//     }
// );

// const utensilsDropdown = new Dropdown(
//     'utensilsFilter',
//     'utensilsDropdown',
//     (selectedUtensil) => {
//         const filteredRecipes = api.getRecipesByUtensil(selectedUtensil);
//         renderRecipes(filteredRecipes); // Mise à jour des recettes affichées
        
//         // Ajout du tag pour l'ustensile sélectionné
//         tagManager.addTag('utensil', selectedUtensil);
//     }
// );

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



// const ingredientsDropdown2 = new Dropdown(
//     'ingredientsFilter',      // Button ID
//     'ingredientsDropdown',    // Dropdown container ID
//     (selectedIngredient) => { // Callback
//       console.log(`Selected ingredient: ${selectedIngredient}`);
//     }
//   );
  
//   console.log(ingredientsDropdown2); // Should show a Dropdown instance
//   console.log(typeof ingredientsDropdown2.updateOptions); // Should log 'function'

// ingredientsDropdown.updateOptions(['Tomato1', 'Onion1', 'Garlic1']);
// ingredientsDropdown.updateOptions(['Carrot', 'Potato', 'Lettuce']);

// Call updateDropdown for the ingredients filter and pass tagManager
// filterManager.updateDropdown('ingredientsDropdown', ['Lait', 'Crème de coco'], 'ingredient', tagManager);