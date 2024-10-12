export default class RecipeSearchManager {
  constructor(recipes, resultContainerId, messageContainerId, stemmer) {
    this.recipes = recipes; // Store the list of recipes
    this.resultContainer = document.getElementById(resultContainerId); // Container for displaying results
    this.messageContainer = document.getElementById(messageContainerId); // Container for no results message
    this.stemmer = stemmer; // Make sure stemmer is passed and stored
  }

  /**
   * Function to normalize and stem words
   * @param {string} word - The word to be normalized and stemmed
   * @returns {string} - The normalized (stemmed) version of the word
   */
  normalizeWord(word) {
    return this.stemmer ? this.stemmer.stem(word.toLowerCase().trim()) : word;
  }

  /**
   * Search for recipes that match the given search term using native loops and regex
   * @param {string} searchTerm - The search term entered by the user
   * @param {Array} [filteredRecipes=this.recipes] - (Optional) Subset of recipes to search within
   * @returns {Array} - An array of filtered recipes or an empty array if none found
   */
  searchRecipes(searchTerm, recipes = []) {
    const minChars = 3; // Minimum number of characters required for search

    // Return an empty array if the search term is too short
    if (searchTerm.length < minChars) {
      return [];
    }

    const foundRecipes = []; // Array to store found recipes
    const normalizedSearchTerm = this.normalizeWord(searchTerm); // Stemmed search term
    const regex = new RegExp(normalizedSearchTerm, "i"); // Create regex with case-insensitive search

    // Loop through all recipes to find matches
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];

      // Stemmed recipe name and description
      const recipeName = this.normalizeWord(recipe.name);
      const recipeDescription = this.normalizeWord(recipe.description);

      let ingredientMatch = false; // Indicator for matching ingredients
      const ingredientList = recipe.ingredients;

      // Loop through the ingredients of the recipe
      for (let j = 0; j < ingredientList.length; j++) {
        const ingredient = this.normalizeWord(ingredientList[j].ingredient);

        // Check if the normalized ingredient matches the regex
        if (regex.test(ingredient)) {
          ingredientMatch = true;
          break; // Exit loop once a match is found
        }
      }

      // Check if the normalized search term matches the recipe name, description, or ingredients
      if (
        regex.test(recipeName) ||
        regex.test(recipeDescription) ||
        ingredientMatch
      ) {
        foundRecipes.push(recipe); // Add the found recipe to the array
      }
    }

    return foundRecipes;
  }

  /**
   * Search for recipes that match specific tags (ingredients, appliances, utensils)
   * @param {Array} ingredients - Array of ingredient tags
   * @param {Array} appliances - Array of appliance tags
   * @param {Array} utensils - Array of utensil tags
   * @returns {Array} - An array of filtered recipes based on the tags
   */
  searchRecipesByTags(ingredients, appliances, utensils) {
    return this.recipes.filter((recipe) => {
      // Normalize ingredients, appliances, and utensils from the recipe
      const recipeIngredients = recipe.ingredients.map((ing) => ({
        original: ing.ingredient,
        normalized: this.normalizeWord(ing.ingredient),
      }));
      const recipeAppliance = {
        original: recipe.appliance,
        normalized: this.normalizeWord(recipe.appliance),
      };
      const recipeUtensils = recipe.ustensils.map((ut) => ({
        original: ut,
        normalized: this.normalizeWord(ut),
      }));

      // Check if all tags match
      const ingredientMatch =
        ingredients.length === 0 ||
        ingredients.every((tag) =>
          recipeIngredients.some(
            (ing) => this.normalizeWord(tag) === ing.normalized
          )
        );
      const applianceMatch =
        appliances.length === 0 ||
        appliances.every(
          (tag) => recipeAppliance.normalized === this.normalizeWord(tag)
        );
      const utensilMatch =
        utensils.length === 0 ||
        utensils.every((tag) =>
          recipeUtensils.some((ut) => this.normalizeWord(tag) === ut.normalized)
        );

      // Return true if all tags match
      return ingredientMatch && applianceMatch && utensilMatch;
    });
  }

  /**
   * Displays a message if no recipes are found
   * @param {string} searchTerm - The search term entered by the user
   */
  displayNoResultsMessage(searchTerm) {
    this.messageContainer.innerHTML = ""; // Clear previous messages

    const message = document.createElement("p");
    message.textContent = `Aucune recette ne contient '${searchTerm}'. Vous pouvez chercher « tarte aux pommes », « poisson », etc.`;

    // Append the no-results message to the message container
    this.messageContainer.appendChild(message);
    this.resultContainer.innerHTML = ""; // Clear previous search results
  }

  /**
   * Displays the found recipes in the result container
   * @param {Array} filteredRecipes - The filtered recipes to display
   * @param {string} searchTerm - The search term used for filtering (used for displaying no results message)
   */
  displayRecipes(filteredRecipes, searchTerm) {
    this.resultContainer.innerHTML = ""; // Clear previous results

    if (!filteredRecipes || filteredRecipes.length === 0) {
      this.displayNoResultsMessage(searchTerm); // Show no results message if no recipes found
      return;
    }

    // Loop through each filtered recipe and display its card
    filteredRecipes.forEach((recipe) => {
      const recipeCard = new RecipeCard(recipe);
      this.resultContainer.appendChild(recipeCard.createRecipeCard());
    });
  }
}
