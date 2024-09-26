// layout/RecipeCard.js

export default class RecipeCard {
	constructor(recipe) {
	  this.recipe = recipe; // Store the recipe object
	}
  
	/**
	 * Creates a recipe card element with all the relevant recipe details.
	 * @returns {HTMLElement} The complete recipe card element.
	 */
	createRecipeCard() {
	  // Create the main container for the card
	  const card = document.createElement('div');
	  card.classList.add('bg-white', 'rounded-lg', 'shadow-lg', 'overflow-hidden', 'relative');
  
	  // Add the recipe image
	  const img = document.createElement('img');
	  img.src = `src/assets/images/${this.recipe.image}`; // Dynamic link to the image
	  img.alt = this.recipe.name; // Alt text for accessibility
	  img.classList.add('w-full', 'h-48', 'object-cover'); // Tailwind classes for styling the image
	  card.appendChild(img);
  
	  // Add a time badge (e.g., "10 min")
	  const timeBadge = document.createElement('div');
	  timeBadge.textContent = `${this.recipe.time} min`; // Display the cooking/preparation time
	  timeBadge.classList.add(
		'absolute', 'top-2', 'right-2', 'bg-customYellow-400', 
		'text-white', 'text-12px', 'px-2', 'py-1', 
		'rounded-full', 'font-bold'
	  );
	  card.appendChild(timeBadge);
  
	  // Create the content container for textual information
	  const content = document.createElement('div');
	  content.classList.add('p-6'); // Padding for content
	  card.appendChild(content);
  
	  // Add the recipe title
	  const title = document.createElement('h3');
	  title.textContent = this.recipe.name;
	  title.classList.add('text-18px', 'font-bold', 'mb-4'); // Tailwind classes for title styling
	  content.appendChild(title);
  
	  // Add the "RECETTE" subtitle
	  const recetteSubtitle = document.createElement('h4');
	  recetteSubtitle.textContent = 'RECETTE';
	  recetteSubtitle.classList.add('uppercase', 'text-12px', 'font-semibold', 'text-gray-600', 'mb-2');
	  content.appendChild(recetteSubtitle);
  
	  // Add the recipe description
	  const description = document.createElement('p');
	  description.textContent = this.recipe.description;
	  description.classList.add(
		'text-14px', 'text-gray-700', 'mb-4', 'overflow-hidden', 'max-h-[5rem]'
	  ); // Limited height for text overflow control
	  content.appendChild(description);
  
	  // Add the "Ingrédients" subtitle
	  const ingredientsSubtitle = document.createElement('h4');
	  ingredientsSubtitle.textContent = 'Ingrédients';
	  ingredientsSubtitle.classList.add('uppercase', 'text-12px', 'font-semibold', 'text-gray-600', 'mb-2');
	  content.appendChild(ingredientsSubtitle);
  
	  // Create a grid to display the list of ingredients
	  const ingredientsGrid = document.createElement('div');
	  ingredientsGrid.classList.add('text-14px', 'grid', 'grid-cols-2', 'gap-y-2'); // Tailwind grid layout
	  this.recipe.ingredients.forEach(ingredient => {
		const ingredientItem = document.createElement('div');
		ingredientItem.innerHTML = `
		  <span class="font-semibold">${ingredient.ingredient}</span>
		  <span class="text-gray-500">${ingredient.quantity || ''} ${ingredient.unit || ''}</span>
		`;
		ingredientsGrid.appendChild(ingredientItem);
	  });
	  content.appendChild(ingredientsGrid);
  
	  return card;
	}
  }
  
