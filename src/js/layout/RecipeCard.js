export class RecipeCard
{
	constructor(recipe)
	{
		this.recipe = recipe;
	}

	// Méthode pour créer la carte de recette
	createRecipeCard()
	{
		// Création de l'élément container de la carte
		const card = document.createElement('div');
		card.classList.add('bg-white', 'rounded-lg', 'shadow-lg', 'overflow-hidden', 'relative');

		// Image de la recette
		const img = document.createElement('img');
		img.src = `../src/assets/images/${this.recipe.image}`; // Lien dynamique vers l'image
		img.alt = this.recipe.name;
		img.classList.add('w-full', 'h-48', 'object-cover'); // Tailwind classes pour l'image
		card.appendChild(img);

		// Ajout du badge temps (ex: "10 min")
		const timeBadge = document.createElement('div');
		timeBadge.textContent = `${this.recipe.time}min`;
		timeBadge.classList.add('absolute', 'top-2', 'right-2', 'bg-customYellow-400', 'text-white', 'text-12px', 'px-2', 'py-1', 'rounded-full', 'font-bold');
		card.appendChild(timeBadge);

		// Conteneur du contenu textuel
		const content = document.createElement('div');
		content.classList.add('p-6'); // Padding pour le contenu
		card.appendChild(content);

		// Titre de la recette
		const title = document.createElement('h3');
		title.textContent = this.recipe.name;
		title.classList.add('text-18px', 'font-bold', 'mb-4'); // Taille et espacement du titre
		content.appendChild(title);

		// Sous-titre "Recette"
		const recetteSubtitle = document.createElement('h4');
		recetteSubtitle.textContent = 'RECETTE';
		recetteSubtitle.classList.add('uppercase', 'text-12px', 'font-semibold', 'text-gray-600', 'mb-2');
		content.appendChild(recetteSubtitle);

		// Description de la recette
		const description = document.createElement('p');
		description.textContent = this.recipe.description;
		description.classList.add('text-14px','text-gray-700', 'mb-4'); // Couleur grise pour le texte
		content.appendChild(description);

		// Sous-titre "Ingrédients"
		const ingredientsSubtitle = document.createElement('h4');
		ingredientsSubtitle.textContent = 'Ingrédients';
		ingredientsSubtitle.classList.add('uppercase', 'text-12px', 'font-semibold', 'text-gray-600', 'mb-2');
		content.appendChild(ingredientsSubtitle);

		// Liste des ingrédients
		const ingredientsGrid = document.createElement('div');
		ingredientsGrid.classList.add('text-14px','grid', 'grid-cols-2', 'gap-y-2'); // Grid layout for ingredients
		this.recipe.ingredients.forEach(ingredient => {
			const ingredientItem = document.createElement('div');
			ingredientItem.innerHTML = `<span class="font-semibold">${ingredient.ingredient}</span> <span class="text-gray-500">${ingredient.quantity || ''} ${ingredient.unit || ''}</span>`;
			ingredientsGrid.appendChild(ingredientItem);
		});
		content.appendChild(ingredientsGrid);

		return card;
	}
}
