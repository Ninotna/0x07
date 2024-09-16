export default class Api {
    constructor(data) {
        // Vérification que les données sont correctement passées
        if (!Array.isArray(data)) {
            throw new Error('Les données des recettes doivent être un tableau.');
        }
        this.data = data;
    }

    // Récupérer tous les ingrédients uniques
    getAllIngredients() {
        if (!this.data || !Array.isArray(this.data)) {
            return [];
        }
    
        // Use a Map to ensure uniqueness (case-insensitive) and preserve original casing
        const ingredientsMap = new Map();
    
        this.data.forEach(recipe => {
            recipe.ingredients.forEach(ingredient => {
                const lowerCaseIngredient = ingredient.ingredient.toLowerCase();
                if (!ingredientsMap.has(lowerCaseIngredient)) {
                    ingredientsMap.set(lowerCaseIngredient, ingredient.ingredient);
                }
            });
        });
    
        // Return an array of unique ingredients with their original casing
        return Array.from(ingredientsMap.values());
    }
    
    // Récupérer tous les appareils uniques
    getAllAppliances() {
        if (!this.data || !Array.isArray(this.data)) {
            return [];
        }

        const appliancesSet = new Set();
        this.data.forEach(recipe => {
            appliancesSet.add(recipe.appliance);
        });
        return Array.from(appliancesSet); // Retourne un tableau d'appareils uniques
    }

    // Récupérer tous les ustensiles uniques
    getAllUtensils() {
        if (!this.data || !Array.isArray(this.data)) {
            return [];
        }

        const utensilsSet = new Set();
        this.data.forEach(recipe => {
            recipe.ustensils.forEach(utensil => {
                utensilsSet.add(utensil);
            });
        });
        return Array.from(utensilsSet); // Retourne un tableau d'ustensiles uniques
    }

    // Filtrer les recettes par ingrédient
    getRecipesByIngredient(ingredient) {
        if (!this.data || !Array.isArray(this.data)) {
            return [];
        }

        return this.data.filter(recipe => 
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase() === ingredient.toLowerCase())
        );
    }

// Fetch all recipes matching the selected tags
getRecipesByTags(selectedIngredients, selectedAppliances, selectedUtensils) {
    return this.data.filter(recipe => {
        const matchesIngredients = selectedIngredients.every(ingredient =>
            recipe.ingredients.some(i => i.ingredient.toLowerCase() === ingredient.toLowerCase())
        );
        const matchesAppliance = !selectedAppliances.length || selectedAppliances.includes(recipe.appliance);
        const matchesUtensils = selectedUtensils.every(utensil =>
            recipe.ustensils.includes(utensil)
        );
        return matchesIngredients && matchesAppliance && matchesUtensils;
    });
}

}
