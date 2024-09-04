class Dropdown {
	constructor(buttonId, dropdownId, filterCallback) {
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

	setupEventListeners() {
		// Toggle dropdown visibility lorsque le bouton est cliqué
		this.button.addEventListener('click', () => {
			this.dropdown.classList.toggle('hidden');
		});

		// Écoute les événements d'entrée dans la barre de recherche
		const searchInput = this.dropdown.querySelector('input[type="text"]');
		searchInput.addEventListener('input', (event) => {
			this.filterDropdownItems(event.target.value);  // Appel à la méthode de filtrage
		});

		this.updateDropdownItems();
	}

	updateDropdownItems() {
		// Vérifier que les éléments <li> existent dans la liste
		const listItems = this.dropdown.querySelectorAll('li');
		if (listItems.length === 0) {
			console.warn(`Aucun élément <li> trouvé dans ${this.dropdown.id}`);
			return;
		}

		// Ajouter des écouteurs d'événements pour chaque élément <li>
		listItems.forEach((item) => {
			item.addEventListener('click', () => {
				const selectedValue = item.textContent;
				this.filterCallback(selectedValue);
				this.button.textContent = selectedValue; // Mettre à jour le texte du bouton
				this.dropdown.classList.add('hidden'); // Masquer le dropdown après sélection
			});
		});
	}

	/**
	 * Méthode pour filtrer les éléments du dropdown en fonction de la recherche
	 * @param {string} searchTerm - Le terme recherché pour filtrer les items
	 */
	filterDropdownItems(searchTerm) {
		const listItems = this.dropdown.querySelectorAll('li');
		listItems.forEach((item) => {
			const itemText = item.textContent.toLowerCase();
			if (itemText.includes(searchTerm.toLowerCase())) {
				item.style.display = ''; // Afficher l'élément
			} else {
				item.style.display = 'none'; // Masquer l'élément
			}
		});
	}

	/**
	 * Ajoute des éléments dynamiques au dropdown
	 * @param {Array} items - Un tableau des éléments à ajouter au dropdown
	 */
	populateDropdown(items) {
		const ul = this.dropdown.querySelector('ul');
		ul.innerHTML = ''; // Vider la liste actuelle

		// Ajouter chaque item au dropdown
		items.forEach((item) => {
			const li = document.createElement('li');
			li.textContent = item;
			li.classList.add('px-4', 'py-2', 'text-gray-700', 'hover:bg-gray-100', 'cursor-pointer');
			ul.appendChild(li);
		});

		// Réinitialiser les écouteurs pour les nouveaux items
		this.updateDropdownItems();
	}
}

export default Dropdown;
