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
// Exemple de méthode dans la classe Api pour filtrer les recettes par tags
getRecipesByTags(ingredients, appliances, utensils) {
    return this.data.filter((recipe) => {
        // Vérifie que toutes les conditions de filtrage sont remplies (AND logique)
        const ingredientMatch = ingredients.length === 0 || 
            ingredients.every((ingredient) => recipe.ingredients.some((ing) => ing.ingredient.toLowerCase() === ingredient.toLowerCase()));
        
        const applianceMatch = appliances.length === 0 || 
            appliances.includes(recipe.appliance.toLowerCase());
        
        const utensilMatch = utensils.length === 0 || 
            utensils.every((utensil) => recipe.ustensils.some((ut) => ut.toLowerCase() === utensil.toLowerCase()));

        // Renvoie vrai uniquement si toutes les conditions sont remplies
        return ingredientMatch && applianceMatch && utensilMatch;
    });
}


}
