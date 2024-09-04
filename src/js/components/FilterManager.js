// src/js/components/FilterManager.js
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
}
