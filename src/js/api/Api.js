import BasicStemmerFr from '../utils/BasicStemmerFr.js'; // Import your custom French stemmer

export default class Api {
  constructor(data) {
    // Ensure the passed data is an array of recipes
    if (!Array.isArray(data)) {
      throw new Error("Recipe data must be an array.");
    }
    this.data = data;
    this.stemmer = new BasicStemmerFr(); // Initialize your custom French stemmer
  }

  // Function to normalize and stem words using your custom stemmer
  normalizeWord(word) {
    return this.stemmer.stem(word.toLowerCase().trim());
  }

  // Retrieve all recipes
  getAllRecipes() {
    // Return the full array of recipes
    return this.data;
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
        const normalizedIngredient = this.normalizeWord(ingredient.ingredient);
        if (!ingredientsMap.has(normalizedIngredient)) {
          ingredientsMap.set(normalizedIngredient, ingredient.ingredient);
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
      appliancesSet.add(this.normalizeWord(recipe.appliance));
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
        utensilsSet.add(this.normalizeWord(utensil));
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

    const normalizedIngredient = this.normalizeWord(ingredient);
    return this.data.filter((recipe) =>
      recipe.ingredients.some(
        (ing) => this.normalizeWord(ing.ingredient) === normalizedIngredient
      )
    );
  }

  // Filter recipes by multiple tags (ingredients, appliances, utensils)
  getRecipesByTags(ingredients, appliances, utensils) {
    return this.data.filter((recipe) => {
      // Normalize the ingredients, appliances, and utensils in the recipe
      const recipeIngredients = recipe.ingredients.map((ing) =>
        this.normalizeWord(ing.ingredient)
      );
      const recipeAppliance = this.normalizeWord(recipe.appliance);
      const recipeUtensils = recipe.ustensils.map((ut) =>
        this.normalizeWord(ut)
      );

      // Match ingredients (AND logic)
      const ingredientMatch =
        ingredients.length === 0 ||
        ingredients.every((ingredient) =>
          recipeIngredients.includes(this.normalizeWord(ingredient))
        );

      // Match appliances (AND logic)
      const applianceMatch =
        appliances.length === 0 ||
        appliances
          .map((appliance) => this.normalizeWord(appliance))
          .includes(recipeAppliance);

      // Match utensils (AND logic)
      const utensilMatch =
        utensils.length === 0 ||
        utensils.every((utensil) =>
          recipeUtensils.includes(this.normalizeWord(utensil))
        );

      // Return true only if all conditions are met
      return ingredientMatch && applianceMatch && utensilMatch;
    });
  }
}
