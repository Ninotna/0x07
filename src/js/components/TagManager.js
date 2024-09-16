export default class TagManager {
    constructor(filterManager, containerId) {
        this.filterManager = filterManager;
        this.tagsContainer = document.getElementById(containerId);
    }

    // Fonction pour ajouter un tag
    addTag(type, value) {
        // Vérifie si le tag existe déjà
        if (document.getElementById(`tag-${type}-${value}`)) {
            return;
        }

        // Crée un nouvel élément de tag
        const tag = document.createElement('div');
        tag.id = `tag-${type}-${value}`;
        tag.className = 'bg-yellow-300 text-black px-4 py-2 rounded flex items-center';
        tag.innerHTML = `
            ${value} 
            <button class="ml-2 text-black font-bold" data-type="${type}" data-value="${value}">&times;</button>
        `;
        
        // Ajouter le tag au conteneur
        this.tagsContainer.appendChild(tag);

        // Ajoute un événement de suppression au bouton "×"
        tag.querySelector('button').addEventListener('click', (e) => {
            const type = e.target.getAttribute('data-type');
            const value = e.target.getAttribute('data-value');

            // Supprimer le tag du DOM
            this.removeTag(type, value);
        });

        // Ajoute le filtre dans le filterManager
        this.filterManager.addFilter(type, value);

        // Met à jour les recettes
        this.updateRecipes();
    }

    // Fonction pour retirer un tag
    removeTag(type, value) {
        const tag = document.getElementById(`tag-${type}-${value}`);
        if (tag) {
            this.tagsContainer.removeChild(tag);
            this.filterManager.removeFilter(type, value);

            // Met à jour les recettes après suppression du filtre
            this.updateRecipes();
        }
    }

    // Fonction pour mettre à jour les recettes après ajout ou suppression de tags
    updateRecipes() {
        const filteredRecipes = this.filterManager.getFilteredRecipes();
        renderRecipes(filteredRecipes);
    }
}
