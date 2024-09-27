// components/TagManager.js 

export default class TagManager {
    constructor(filterManager, containerId) {
        this.filterManager = filterManager;
        this.container = document.getElementById(containerId);
        this.tags = {}; // Object to store tags by type (ingredient, appliance, utensil, etc.)
    }

    /**
     * Add a tag to the UI and update internal tracking.
     * @param {string} type - The type of the tag (ingredient, appliance, utensil).
     * @param {string} value - The value of the tag to be added.
     */
    addTag(type, value) {
        // Prevent duplicate tags
        if (this.tags[type] && this.tags[type].includes(value)) {
            return;
        }

        // Create a new tag element
        const tag = document.createElement('div');
        tag.classList.add('bg-yellow-400', 'text-black', 'px-4', 'py-2', 'rounded-full', 'flex', 'items-center', 'gap-2');
        tag.setAttribute('data-type', type);
        tag.setAttribute('data-value', value);

        // Create the tag text element
        const tagText = document.createElement('span');
        tagText.textContent = value;

        // Create the close button for removing the tag
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;'; // "×" character
        closeButton.classList.add('text-black', 'font-bold', 'cursor-pointer');
        closeButton.addEventListener('click', () => {
            this.removeTag(type, value); // Remove tag from internal state and filters
            tag.remove(); // Remove the tag from the UI
        });

        // Append the text and close button to the tag
        tag.appendChild(tagText);
        tag.appendChild(closeButton);

        // Append the tag to the tag container
        this.container.appendChild(tag);

        // Track added tags by type
        if (!this.tags[type]) {
            this.tags[type] = [];
        }
        this.tags[type].push(value);
    }

    /**
     * Remove a tag from the UI and update filters.
     * @param {string} type - The type of the tag (ingredient, appliance, utensil).
     * @param {string} value - The value of the tag to be removed.
     */
    removeTag(type, value) {
        if (!this.tags[type]) {
            return;
        }

        // Remove the tag from internal tracking
        const index = this.tags[type].indexOf(value);
        if (index !== -1) {
            this.tags[type].splice(index, 1);
        }

        // Notify FilterManager to update filters based on removed tag
        if (this.filterManager && typeof this.filterManager.removeFilter === 'function') {
            this.filterManager.removeFilter(type, value);
        } else {
            console.error('filterManager.removeFilter is not defined or is not a function');
        }
    }
}

