// components/Dropdown.js

class Dropdown {
  constructor(buttonId, dropdownId, arrowIdPrefix, filterCallback) {
    this.button = document.getElementById(buttonId);
    this.dropdown = document.getElementById(dropdownId);
    this.arrowDown = document.getElementById(`arrow-down-${arrowIdPrefix}`); // Arrow down specific to this dropdown
    this.arrowUp = document.getElementById(`arrow-up-${arrowIdPrefix}`); // Arrow up specific to this dropdown
    this.filterCallback = filterCallback;

    if (!this.button || !this.dropdown) {
      console.error(
        `Button or Dropdown not found: ${buttonId} or ${dropdownId}`
      );
      return;
    }

    if (!this.arrowDown || !this.arrowUp) {
      console.error(`Arrow elements not found for dropdown: ${dropdownId}`);
      return;
    }
    // console.log("Dropdown initialized for:", buttonId, dropdownId);
    this.setupEventListeners();
  }

  // Setup event listeners for dropdown toggle and input filtering
  setupEventListeners() {
    // Toggle dropdown visibility and arrows when the button is clicked
    this.button.addEventListener("click", (event) => {
      // console.log("Button clicked:", this.button.id); // Check if button click is registered
      event.stopPropagation(); // Prevent closing the dropdown when clicking the button

      this.dropdown.classList.toggle("hidden"); // Toggle the 'hidden' class
      this.toggleArrows(); // Update the arrow direction
    });

    // Close dropdown if clicking outside of the button and dropdown
    document.addEventListener("click", (event) => {
      if (
        !this.dropdown.contains(event.target) &&
        !this.button.contains(event.target)
      ) {
        // console.log("Click outside dropdown, closing dropdown");
        this.dropdown.classList.add("hidden"); // Close the dropdown
        this.arrowDown.classList.remove("hidden"); // Show down arrow
        this.arrowUp.classList.add("hidden"); // Hide up arrow
      }
    });

    // Add input listener to filter dropdown items (if the search input exists)
    const searchInput = this.dropdown.querySelector('input[type="text"]');
    if (searchInput) {
      searchInput.addEventListener("input", (event) => {
        this.filterDropdownItems(event.target.value); // Filter dropdown items based on input
      });
    }

    this.updateDropdownItems(); // Setup click events for dropdown items
  }

  // Toggle the visibility of the dropdown arrows
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

  // Dynamically update the dropdown with new items based on current tags
  updateOptions(items, tags) {
    const ul = this.dropdown.querySelector("ul");
    ul.innerHTML = ""; // Clear the current list

    // Mapping dropdownId to the corresponding tag type
    const dropdownTypeMap = {
      ingredientsDropdown: "ingredient",
      appliancesDropdown: "appliance",
      utensilsDropdown: "utensil",
    };

    // Identify the current tag type
    const currentTagKey = dropdownTypeMap[this.dropdownId];

    // If tags are present and valid, filter out the already selected ones
    if (tags && currentTagKey && Array.isArray(tags[currentTagKey])) {
      items = items.filter(
        (item) =>
          !tags[currentTagKey].some(
            (selectedTag) => selectedTag.toLowerCase() === item.toLowerCase()
          )
      );
    }

    // Use a Map to ensure no duplicate items (case-insensitive)
    const uniqueItems = new Map();
    items.forEach((item) => {
      const lowerCaseItem = item.toLowerCase(); // Convert to lowercase for uniqueness
      const capitalizedItem =
        item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(); // Capitalize for display

      if (!uniqueItems.has(lowerCaseItem)) {
        uniqueItems.set(lowerCaseItem, capitalizedItem); // Store the capitalized version
      }
    });

    // Convert the unique items to an array and sort alphabetically
    const sortedItems = Array.from(uniqueItems.values()).sort();

    // Append sorted items to the dropdown
    sortedItems.forEach((originalItem) => {
      const li = document.createElement("li");
      li.textContent = originalItem;
      li.classList.add(
        "px-4",
        "py-2",
        "text-gray-700",
        "hover:bg-customYellow-400",
        "cursor-pointer"
      );
      ul.appendChild(li);
    });

    this.updateDropdownItems(); // Reattach click event listeners for new dropdown items
  }

  // Attach click events to dropdown items
  updateDropdownItems() {
    const listItems = this.dropdown.querySelectorAll("li");
    listItems.forEach((item) => {
      item.addEventListener("click", () => {
        const selectedValue = item.textContent; // Get the selected tag value
        this.filterCallback(selectedValue); // Trigger the filter callback

        this.dropdown.classList.add("hidden"); // Close the dropdown after selection
        this.toggleArrows(); // Update arrow visibility after selection
      });
    });
  }

  // Filter dropdown items based on search term input
  filterDropdownItems(searchTerm) {
    const listItems = this.dropdown.querySelectorAll("li");
    listItems.forEach((item) => {
      const itemText = item.textContent.toLowerCase();
      item.style.display = itemText.includes(searchTerm.toLowerCase())
        ? ""
        : "none"; // Show/hide items based on match
    });
  }
}

export default Dropdown;
