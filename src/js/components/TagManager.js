export default class TagManager {
    constructor(filterManager, containerId) {
        this.filterManager = filterManager;
        this.container = document.getElementById(containerId);
        this.tags = {}; // Initialize tags object
    }

    // Method to add a tag
    addTag(type, value) {
        if (this.tags[type] && this.tags[type].includes(value)) {
            return; // Prevent duplicate tags
        }

        // Create the tag element
        const tag = document.createElement('div');
        tag.classList.add('bg-yellow-400', 'text-black', 'px-4', 'py-2', 'rounded-full', 'flex', 'items-center', 'gap-2');
        tag.setAttribute('data-type', type);
        tag.setAttribute('data-value', value);

        // Create the text for the tag
        const tagText = document.createElement('span');
        tagText.textContent = value;

        // Create the close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;'; // "×" character
        closeButton.classList.add('text-black', 'font-bold', 'cursor-pointer');
        closeButton.addEventListener('click', () => {
            this.removeTag(type, value); // Remove the tag and update filters
            tag.remove(); // Remove the tag from the UI
        });

        // Append the text and close button to the tag
        tag.appendChild(tagText);
        tag.appendChild(closeButton);

        // Add the tag to the container
        this.container.appendChild(tag);

        // Keep track of added tags
        if (!this.tags[type]) {
            this.tags[type] = [];
        }
        this.tags[type].push(value);
    }

    // Method to remove a tag
    removeTag(type, value) {
        if (!this.tags[type]) {
            return;
        }

        // Remove the tag from the internal tracking
        const index = this.tags[type].indexOf(value);
        if (index !== -1) {
            this.tags[type].splice(index, 1);
        }

        // Call the removeFilter method from FilterManager to update filters
        if (this.filterManager && typeof this.filterManager.removeFilter === 'function') {
            this.filterManager.removeFilter(type, value);
        } else {
            console.error('filterManager.removeFilter is not defined or is not a function');
        }
    }

    // Optionally, you can clear all tags
    clearTags() {
        this.container.innerHTML = '';
        this.tags = {};
    }
}
