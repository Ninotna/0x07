class Dropdown {
	constructor(buttonId, dropdownId, filterCallback) {
		this.button = document.getElementById(buttonId);
		this.dropdown = document.getElementById(dropdownId);
		this.filterCallback = filterCallback;
  
		if (!this.button || !this.dropdown) {
			console.error(`Element not found: ${buttonId} or ${dropdownId}`);
			return;
		}
  
		this.setupEventListeners();
	}
  
	setupEventListeners() {
		// Toggle dropdown visibility when the button is clicked
		this.button.addEventListener('click', () => {
			this.dropdown.classList.toggle('hidden'); // Toggle the 'hidden' class
		});
	  
		// Add search input event listener (if it exists in the dropdown)
		const searchInput = this.dropdown.querySelector('input[type="text"]');
		if (searchInput) {
			searchInput.addEventListener('input', (event) => {
				this.filterDropdownItems(event.target.value); // Filter dropdown items
			});
		}

		this.updateDropdownItems(); // Setup event listeners for the dropdown items
	}
  
	// Dynamically update the dropdown with new items
	updateOptions(items) {
		const ul = this.dropdown.querySelector('ul');
		ul.innerHTML = ''; // Clear the current list
	
		// Use a Map to store lowercase as the key and original as the value
		const uniqueItems = new Map();
	
		// Loop through items and normalize to lowercase for uniqueness
		items.forEach((item) => {
			const lowerCaseItem = item.toLowerCase();
			if (!uniqueItems.has(lowerCaseItem)) {
				uniqueItems.set(lowerCaseItem, item); // Store the original item as the value
			}
		});
	
		// Add unique items to the dropdown
		uniqueItems.forEach((originalItem) => {
			const li = document.createElement('li');
			li.textContent = originalItem; // Display the original casing
			li.classList.add('px-4', 'py-2', 'text-gray-700', 'hover:bg-gray-100', 'cursor-pointer');
			ul.appendChild(li);
		});
	
		this.updateDropdownItems(); // Attach event listeners to the new list items
	}
	
	// Update the dropdown items and attach click events
	updateDropdownItems() {
		const listItems = this.dropdown.querySelectorAll('li');
		listItems.forEach((item) => {
			item.addEventListener('click', () => {
				const selectedValue = item.textContent;
				this.filterCallback(selectedValue);
				this.button.textContent = selectedValue; // Update the button text
				this.dropdown.classList.add('hidden'); // Hide the dropdown after selection
			});
		});
	}
  
	// Filter dropdown items based on search term
	filterDropdownItems(searchTerm) {
		const listItems = this.dropdown.querySelectorAll('li');
		listItems.forEach((item) => {
			const itemText = item.textContent.toLowerCase();
			if (itemText.includes(searchTerm.toLowerCase())) {
				item.style.display = ''; // Show item if it matches the search term
			} else {
				item.style.display = 'none'; // Hide item if it doesn't match
			}
		});
	}
}

export default Dropdown;
