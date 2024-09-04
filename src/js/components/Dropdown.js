// src/js/components/Dropdown.js

class Dropdown
{
	constructor(buttonId, dropdownId, filterCallback)
	{
		this.button = document.getElementById(buttonId);
		this.dropdown = document.getElementById(dropdownId);
		this.filterCallback = filterCallback;

		// Vérifier que les éléments existent
		if (!this.button || !this.dropdown) {
			console.error(`Élément introuvable : ${buttonId} ou ${dropdownId}`);
			return;
		}

		// Attacher les événements
		this.setupEventListeners();
	}

	/**
	 * Ajoute les écouteurs d'événements sur le bouton et les items du dropdown.
	 */
	setupEventListeners()
	{
		// Toggle dropdown visibility
		this.button.addEventListener('click', () => {
			this.dropdown.classList.toggle('hidden');
		});

		// Vérifier que les éléments <li> existent
		const listItems = this.dropdown.querySelectorAll('li');
		if (listItems.length === 0) {
			console.error(`Aucun élément <li> trouvé dans ${this.dropdown.id}`);
			return;
		}

		// Gestion des filtres lorsqu'un élément du dropdown est cliqué
		listItems.forEach((item) => {
			item.addEventListener('click', () => {
				const selectedValue = item.textContent;
				this.filterCallback(selectedValue);
				this.dropdown.classList.add('hidden'); // Masquer le dropdown après sélection
			});
		});
	}
}

export default Dropdown;
