class RecipeSearchManager {
  constructor(recipes, resultContainerId, messageContainerId) {
    this.recipes = recipes; // Stocker les recettes
    this.resultContainer = document.getElementById(resultContainerId); // Conteneur des résultats
    this.messageContainer = document.getElementById(messageContainerId); // Conteneur pour les messages d'absence de résultats
  }

  /**
   * Recherche des recettes correspondant au terme donné
   * @param {string} searchTerm - Le terme de recherche entré par l'utilisateur
   * @returns {Array} - Les recettes filtrées ou un tableau vide
   */
  searchRecipes(searchTerm) {
    const minChars = 3; // Nombre minimal de caractères à entrer

    // Vérifier que le terme de recherche contient au moins 3 caractères
    if (searchTerm.length < minChars) {
      return []; // Retourner un tableau vide si le terme est trop court
    }

    const foundRecipes = []; // Tableau pour stocker les recettes trouvées

    // Boucle à travers toutes les recettes disponibles
    for (let i = 0; i < this.recipes.length; i++) {
      const recipe = this.recipes[i]; // Accéder à chaque recette

      // Convertir les valeurs en minuscules pour une recherche insensible à la casse
      const recipeName = recipe.name.toLowerCase();
      const recipeDescription = recipe.description.toLowerCase();

      let ingredientMatch = false; // Indicateur si un ingrédient correspond
      let ingredientList = recipe.ingredients;

      // Boucler à travers tous les ingrédients de la recette
      for (let j = 0; j < ingredientList.length; j++) {
        let ingredient = ingredientList[j].ingredient.toLowerCase();

        // Vérifier si l'ingrédient correspond au terme de recherche
        if (ingredient.indexOf(searchTerm.toLowerCase()) !== -1) {
          ingredientMatch = true; // Marquer un ingrédient trouvé
          break; // Sortir de la boucle une fois trouvé
        }
      }

      // Vérifier si le terme de recherche est dans le titre de la recette, la description ou un ingrédient
      if (
        recipeName.indexOf(searchTerm.toLowerCase()) !== -1 ||
        recipeDescription.indexOf(searchTerm.toLowerCase()) !== -1 ||
        ingredientMatch
      ) {
        foundRecipes.push(recipe); // Ajouter la recette trouvée
      }
    }

    return foundRecipes;
  }

  /**
   * Affiche un message si aucune recette n'est trouvée
   * @param {string} searchTerm - Le terme de recherche entré par l'utilisateur
   */
  displayNoResultsMessage(searchTerm) {
    this.messageContainer.innerHTML = ""; // Vider les messages précédents

    const message = document.createElement("p");
    message.textContent = `Aucune recette ne contient '${searchTerm}'. Vous pouvez chercher « tarte aux pommes », « poisson », etc.`;

    // Ajouter le message au conteneur
    this.messageContainer.appendChild(message);
    this.resultContainer.innerHTML = ""; // Vider les résultats de recettes précédentes
  }

  /**
   * Affiche les recettes trouvées
   * @param {Array} filteredRecipes - Les recettes à afficher
   */
  displayRecipes(filteredRecipes, searchTerm) {
    this.resultContainer.innerHTML = ""; // Vider les résultats précédents

    if (!filteredRecipes || filteredRecipes.length === 0) {
      this.displayNoResultsMessage(searchTerm); // Appeler la fonction d'absence de résultats
      return;
    }

    // Boucle à travers les recettes filtrées et affiche chaque carte de recette
    filteredRecipes.forEach((recipe) => {
      const recipeCard = new RecipeCard(recipe);
      this.resultContainer.appendChild(recipeCard.createRecipeCard());
    });
  }
}

export default RecipeSearchManager;
