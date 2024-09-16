export default class FilterManager
{
	constructor(api)
	{
		this.api = api;
		this.recipesContainer = document.getElementById('recipesContainer'); // L'élément où les recettes seront affichées
	}

	// Met à jour un dropdown avec les éléments passés en argument.
	updateDropdown(dropdownId, items)
	{
		const dropdown = document.getElementById(dropdownId); // Assurez-vous que l'élément existe
		if (!dropdown)
		{
			console.error(`Dropdown with ID ${dropdownId} not found`);
			return;
		}

		const ul = dropdown.querySelector('ul');
		ul.innerHTML = ''; // Vider les éléments existants

		// Ajouter les nouveaux éléments dans la liste
		items.forEach(item => {
			const li = document.createElement('li');
			li.classList.add('p-2', 'cursor-pointer', 'hover:bg-yellow-100');
			li.textContent = item;
			ul.appendChild(li);

			// Attacher un événement de filtrage lorsque l'élément est cliqué
			li.addEventListener('click', () => {
				console.log(`Selected tag: ${item}`);
				// Ici, vous pouvez déclencher le filtrage selon le tag sélectionné
			});
		});
	}

	// Initialisation des filtres
	initFilters()
	{
		// Obtenir les ingrédients, appareils et ustensiles uniques
		const ingredients = this.api.getAllIngredients();
		const appliances = this.api.getAllAppliances();
		const utensils = this.api.getAllUtensils();

		// Mettre à jour les dropdowns (assurez-vous que les IDs correspondent à ceux dans le HTML)
		this.updateDropdown('ingredientsDropdown', ingredients);
		this.updateDropdown('appliancesDropdown', appliances);
		this.updateDropdown('utensilsDropdown', utensils);
	}

	// Fonction pour filtrer les recettes par terme de recherche et mettre à jour les dropdowns
	filterRecipes(searchTerm, searchManager, tagManager)
	{
		// 1. Filtrer les recettes en utilisant searchManager
		const filteredRecipes = searchManager.searchRecipes(searchTerm);

		// 2. Afficher les recettes filtrées
		this.renderRecipes(filteredRecipes, searchTerm);

		// 3. Mettre à jour les filtres disponibles en fonction des recettes filtrées
		this.updateFiltersBasedOnRecipes(filteredRecipes);

		// 4. Mettre à jour les tags si nécessaire
		tagManager.updateTags(filteredRecipes);
	}

	// Fonction pour afficher les recettes filtrées
	renderRecipes(recipes, searchTerm = '') {
		const container = document.getElementById('recipes-container');
		container.innerHTML = ''; // Effacer les résultats précédents

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

	// Fonction pour mettre à jour les dropdowns (filtres) en fonction des recettes filtrées
	updateFiltersBasedOnRecipes(filteredRecipes) {
		const ingredients = new Set();
		const appliances = new Set();
		const utensils = new Set();
	  
		// Loop through the filtered recipes
		filteredRecipes.forEach((recipe) => {
		  // Loop through each ingredient in the recipe and add to the ingredients set
		  recipe.ingredients.forEach((ingredient) => {
			// console.log('Ingredient Object:', ingredient); // Debug log
			if (ingredient.ingredient) { // Correct key for ingredient name
			  ingredients.add(ingredient.ingredient); // Use 'ingredient.ingredient'
			} else {
			//   console.error('Ingredient missing ingredient property:', ingredient);
			}
		  });
	  
		  // Add appliances and utensils as before
		  appliances.add(recipe.appliance);
		  recipe.ustensils.forEach((utensil) => utensils.add(utensil));
		});
	  
		// Update dropdown options with the new values
		ingredientsDropdown.updateOptions([...ingredients]);
		appliancesDropdown.updateOptions([...appliances]);
		utensilsDropdown.updateOptions([...utensils]);
	  }	  
}
