// /components/RecipeSearchManager.js

class RecipeSearchManager {
  constructor(recipes, resultContainerId, messageContainerId) {
    this.recipes = recipes; // Store the list of recipes
    this.resultContainer = document.getElementById(resultContainerId); // Container for displaying results
    this.messageContainer = document.getElementById(messageContainerId); // Container for no results message
  }

  /**
   * Search for recipes that match the given search term
   * @param {string} searchTerm - The search term entered by the user
   * @returns {Array} - An array of filtered recipes or an empty array if none found
   */
  searchRecipes(searchTerm) {
    const minChars = 3; // Minimum number of characters required for search

    // Return an empty array if the search term is too short
    if (searchTerm.length < minChars) {
      return [];
    }

    const foundRecipes = []; // Array to store found recipes

    // Loop through all recipes to find matches
    for (let i = 0; i < this.recipes.length; i++) {
      const recipe = this.recipes[i];

      // Convert values to lowercase for case-insensitive search
      const recipeName = recipe.name.toLowerCase();
      const recipeDescription = recipe.description.toLowerCase();

      let ingredientMatch = false; // Indicator for matching ingredients
      const ingredientList = recipe.ingredients;

      // Loop through the ingredients of the recipe
      for (let j = 0; j < ingredientList.length; j++) {
        const ingredient = ingredientList[j].ingredient.toLowerCase();

        // Check if the ingredient matches the search term
        if (ingredient.includes(searchTerm.toLowerCase())) {
          ingredientMatch = true; // Mark ingredient as found
          break; // Exit loop once match is found
        }
      }

      // Check if the search term is in the recipe name, description, or ingredients
      if (
        recipeName.includes(searchTerm.toLowerCase()) ||
        recipeDescription.includes(searchTerm.toLowerCase()) ||
        ingredientMatch
      ) {
        foundRecipes.push(recipe); // Add the found recipe to the array
      }
    }

    return foundRecipes;
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

export default RecipeSearchManager;

