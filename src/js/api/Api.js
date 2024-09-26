// api/Api.js

export default class Api {
  constructor(data) {
    // Ensure the passed data is an array of recipes
    if (!Array.isArray(data)) {
      throw new Error("Recipe data must be an array.");
    }
    this.data = data;
  }

  // Retrieve all unique ingredients from the recipes
  getAllIngredients() {
    if (!this.data || !Array.isArray(this.data)) {
      return [];
    }

    // Use a Map to ensure uniqueness (case-insensitive) and preserve original casing
    const ingredientsMap = new Map();

    this.data.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        const lowerCaseIngredient = ingredient.ingredient.toLowerCase();
        if (!ingredientsMap.has(lowerCaseIngredient)) {
          ingredientsMap.set(lowerCaseIngredient, ingredient.ingredient);
        }
      });
    });

    // Return an array of unique ingredients with their original casing
    return Array.from(ingredientsMap.values());
  }

  // Retrieve all unique appliances from the recipes
  getAllAppliances() {
    if (!this.data || !Array.isArray(this.data)) {
      return [];
    }

    const appliancesSet = new Set();
    this.data.forEach((recipe) => {
      appliancesSet.add(recipe.appliance);
    });

    // Return an array of unique appliances
    return Array.from(appliancesSet);
  }

  // Retrieve all unique utensils from the recipes
  getAllUtensils() {
    if (!this.data || !Array.isArray(this.data)) {
      return [];
    }

    const utensilsSet = new Set();
    this.data.forEach((recipe) => {
      recipe.ustensils.forEach((utensil) => {
        utensilsSet.add(utensil);
      });
    });

    // Return an array of unique utensils
    return Array.from(utensilsSet);
  }

  // Filter recipes by a specific ingredient
  getRecipesByIngredient(ingredient) {
    if (!this.data || !Array.isArray(this.data)) {
      return [];
    }

    return this.data.filter((recipe) =>
      recipe.ingredients.some(
        (ing) => ing.ingredient.toLowerCase() === ingredient.toLowerCase()
      )
    );
  }

  // Filter recipes by multiple tags (ingredients, appliances, utensils)
  getRecipesByTags(ingredients, appliances, utensils) {
    return this.data.filter((recipe) => {
      // Match ingredients (AND logic)
      const ingredientMatch =
        ingredients.length === 0 ||
        ingredients.every((ingredient) =>
          recipe.ingredients.some(
            (ing) => ing.ingredient.toLowerCase() === ingredient.toLowerCase()
          )
        );

      // Match appliances (AND logic)
      const applianceMatch =
        appliances.length === 0 ||
        appliances
          .map((appliance) => appliance.toLowerCase())
          .includes(recipe.appliance.toLowerCase());

      // Match utensils (AND logic)
      const utensilMatch =
        utensils.length === 0 ||
        utensils.every((utensil) =>
          recipe.ustensils.some(
            (ut) => ut.toLowerCase() === utensil.toLowerCase()
          )
        );

      // Return true only if all conditions are met
      return ingredientMatch && applianceMatch && utensilMatch;
    });
  }
}

