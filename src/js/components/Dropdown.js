class Dropdown {
  constructor(buttonId, dropdownId, filterCallback) {
    this.button = document.getElementById(buttonId);
    this.dropdown = document.getElementById(dropdownId);
    this.dropdownId = dropdownId;  // Store dropdownId as a class property
    this.filterCallback = filterCallback;
    this.arrowDown = this.button.querySelector("#arrow-down"); // Flèche vers le bas
    this.arrowUp = this.button.querySelector("#arrow-up"); // Flèche vers le haut

    if (!this.button || !this.dropdown) {
      console.error(`Element not found: ${buttonId} or ${dropdownId}`);
      return;
    }

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Toggle dropdown visibility and arrows when the button is clicked
    this.button.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent closing dropdown when clicking the button
      this.dropdown.classList.toggle("hidden"); // Toggle the 'hidden' class
      this.toggleArrows(); // Toggle arrows up and down
    });

    // Close dropdown if clicking outside of the button and dropdown
    document.addEventListener("click", (event) => {
      if (
        !this.dropdown.contains(event.target) &&
        !this.button.contains(event.target)
      ) {
        this.dropdown.classList.add("hidden"); // Close the dropdown
        this.arrowDown.classList.remove("hidden"); // Show down arrow
        this.arrowUp.classList.add("hidden"); // Hide up arrow
      }
    });

    // Add search input event listener (if it exists in the dropdown)
    const searchInput = this.dropdown.querySelector('input[type="text"]');
    if (searchInput) {
      searchInput.addEventListener("input", (event) => {
        this.filterDropdownItems(event.target.value); // Filter dropdown items
      });
    }

    this.updateDropdownItems(); // Setup event listeners for the dropdown items
  }

  // Toggle the visibility of the arrows
toggleArrows() {
  if (this.dropdown.classList.contains("hidden")) {
      // Dropdown is closed, show the down arrow
      this.arrowDown.classList.remove("hidden");
      this.arrowUp.classList.add("hidden");
  } else {
      // Dropdown is open, show the up arrow
      this.arrowDown.classList.add("hidden");
      this.arrowUp.classList.remove("hidden");
  }
}


// Dynamically update the dropdown with new items
updateOptions(items, tags) {
  const ul = this.dropdown.querySelector("ul");
  ul.innerHTML = ""; // Clear the current list

  // Map dropdownId to the correct key in the tags object
  const dropdownTypeMap = {
      ingredientsDropdown: "ingredient",
      appliancesDropdown: "appliance",
      utensilsDropdown: "utensil"
  };

  // Get the correct key for the current dropdown
  const currentTagKey = dropdownTypeMap[this.dropdownId];

  // Only proceed if we have a valid tag key
  if (tags && currentTagKey && Array.isArray(tags[currentTagKey])) {
      // console.log(`Before filtering ${currentTagKey}:`, items);  // Log items before filtering

      // Filter the items based on the selected tags (case-insensitive)
      items = items.filter((item) =>
          !tags[currentTagKey].some((selectedTag) => selectedTag.toLowerCase() === item.toLowerCase())
      );

      // console.log(`After filtering ${currentTagKey}:`, items);  // Log items after filtering
  }

  if (tags && Array.isArray(tags["appliance"]) && this.dropdownId === "appliancesDropdown") {
    // console.log("Before filtering appliances:", items);  // Log items before filtering
    items = items.filter((item) => 
        !tags["appliance"].some((appliance) => appliance.toLowerCase() === item.toLowerCase())
    );
    // console.log("After filtering appliances:", items);  // Log items after filtering
}


  // Use a Set to ensure no duplicates (case-insensitive)
  const uniqueItems = new Map();
  items.forEach((item) => {
      const lowerCaseItem = item.toLowerCase();  // Convert to lowercase to check uniqueness
      const capitalizedItem = item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();  // Capitalize for display

      if (!uniqueItems.has(lowerCaseItem)) {
          uniqueItems.set(lowerCaseItem, capitalizedItem);  // Store the capitalized version
      }
  });

  // Convert the values of the Map into an array and sort alphabetically
  const sortedItems = Array.from(uniqueItems.values()).sort((a, b) => a.localeCompare(b));

  // Add the sorted items to the dropdown
  sortedItems.forEach((originalItem) => {
      const li = document.createElement("li");
      li.textContent = originalItem;
      li.classList.add("px-4", "py-2", "text-gray-700", "hover:bg-gray-100", "cursor-pointer");
      ul.appendChild(li);
  });

  this.updateDropdownItems();  // Reattach event listeners to the new dropdown items
}



  // Update the dropdown items and attach click events
  updateDropdownItems() {
    const listItems = this.dropdown.querySelectorAll("li");
    listItems.forEach((item) => {
        item.addEventListener("click", () => {
            const selectedValue = item.textContent;  // Get the selected tag
            this.filterCallback(selectedValue);  // Handle the tag selection

            // Close the dropdown and toggle the arrows
            this.dropdown.classList.add("hidden"); // Hide the dropdown after selection
            this.toggleArrows(); // Ensure the arrow is updated after selection
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
