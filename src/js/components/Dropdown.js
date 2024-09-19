class Dropdown {
  constructor(buttonId, dropdownId, filterCallback) {
    this.button = document.getElementById(buttonId);
    this.dropdown = document.getElementById(dropdownId);
    this.filterCallback = filterCallback;
    this.dropdownId = dropdownId;
    this.defaultButtonText = this.button.textContent; // Sauvegarder le texte par défaut du bouton

    if (!this.button || !this.dropdown) {
      console.error(`Element not found: ${buttonId} or ${dropdownId}`);
      return;
    }

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Toggle dropdown visibility when the button is clicked
    this.button.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent closing dropdown when clicking the button
      this.dropdown.classList.toggle("hidden"); // Toggle the 'hidden' class
    });

    // Add search input event listener (if it exists in the dropdown)
    const searchInput = this.dropdown.querySelector('input[type="text"]');
    if (searchInput) {
      searchInput.addEventListener("input", (event) => {
        this.filterDropdownItems(event.target.value); // Filter dropdown items
      });
    }

    // Close dropdown if clicking outside
    document.addEventListener("click", (event) => {
      if (
        !this.dropdown.contains(event.target) &&
        !this.button.contains(event.target)
      ) {
        this.dropdown.classList.add("hidden"); // Close the dropdown if clicked outside
      }
    });

    this.updateDropdownItems(); // Setup event listeners for the dropdown items
  }

  // Dynamically update the dropdown with new items
  updateOptions(items, tags) {
	const ul = this.dropdown.querySelector("ul");
	ul.innerHTML = ""; // Clear the current list
  
	// Si des tags sont déjà sélectionnés, les filtrer de la liste des options
	if (tags && tags["ingredient"] && this.dropdownId === "ingredientsDropdown") {
	  items = items.filter((item) => !tags["ingredient"].includes(item));
	} else if (tags && tags["appliance"] && this.dropdownId === "appliancesDropdown") {
	  items = items.filter((item) => !tags["appliance"].includes(item));
	} else if (tags && tags["utensil"] && this.dropdownId === "utensilsDropdown") {
	  items = items.filter((item) => !tags["utensil"].includes(item));
	}
  
	// Utiliser un Set pour garantir qu'il n'y a pas de doublons (insensibles à la casse)
	const uniqueItems = new Map();
  
	items.forEach((item) => {
	  const lowerCaseItem = item.toLowerCase(); // Convert to lowercase to check uniqueness
	  const capitalizedItem = item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(); // Capitalize for display
  
	  if (!uniqueItems.has(lowerCaseItem)) {
		uniqueItems.set(lowerCaseItem, capitalizedItem); // Store the capitalized version
	  }
	});
  
	// Convertir les valeurs de la Map en tableau et trier les éléments par ordre alphabétique
	const sortedItems = Array.from(uniqueItems.values()).sort((a, b) => a.localeCompare(b));
  
	// Ajouter les éléments triés au dropdown
	sortedItems.forEach((originalItem) => {
	  const li = document.createElement("li");
	  li.textContent = originalItem;
	  li.classList.add(
		"px-4",
		"py-2",
		"text-gray-700",
		"hover:bg-gray-100",
		"cursor-pointer"
	  );
	  ul.appendChild(li);
	});
  
	// Mettre à jour les éléments du dropdown avec les événements de clic
	this.updateDropdownItems();
  }
    // Update the dropdown items and attach click events
  updateDropdownItems() {
    const listItems = this.dropdown.querySelectorAll("li");
    listItems.forEach((item) => {
      item.addEventListener("click", () => {
        const selectedValue = item.textContent;
        this.filterCallback(selectedValue);
        this.button.textContent = this.defaultButtonText; // Reset button text to the default title
        this.dropdown.classList.add("hidden"); // Hide the dropdown after selection
      });
    });
  }

  // Filter dropdown items based on search term
  filterDropdownItems(searchTerm) {
    const listItems = this.dropdown.querySelectorAll("li");
    listItems.forEach((item) => {
      const itemText = item.textContent.toLowerCase();
      if (itemText.includes(searchTerm.toLowerCase())) {
        item.style.display = ""; // Show item if it matches the search term
      } else {
        item.style.display = "none"; // Hide item if it doesn't match
      }
    });
  }
}

export default Dropdown;
