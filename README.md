# Les Petits Plats - Recipe Search Application

## Overview

**Les Petits Plats** is a web-based application that allows users to search from a database of over 1500 daily recipes. Users can search by recipe name, ingredients, appliances, and utensils, making it easy to find recipes tailored to their needs. The application features a modern UI with responsive design, enhanced search functionality, and dynamic filtering capabilities.

## Features

- **Real-time Search**: Users can search by recipe names, ingredients, or appliances in real time.
- **Advanced Filtering**: Filter recipes based on selected tags (ingredients, appliances, utensils).
- **Responsive Design**: The UI is designed to be responsive, working seamlessly on both desktop and mobile devices.
- **Clear Search**: Users can easily clear their search using the clear button for a seamless experience.

## Tech Stack

- **HTML5**: Markup language for structuring content.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **JavaScript (ES6)**: For client-side logic and dynamic content rendering.
- **Sass**: CSS preprocessor used for styling efficiency.
- **Google Fonts**: Custom fonts used (`Anton` and `Manrope`) for a clean and modern look.

## Project Structure

```bash
js/
 ┣ api/
 ┃ ┗ Api.js                # Manages recipe data interactions
 ┣ components/
 ┃ ┣ Dropdown.js           # Manages dropdown filters for search
 ┃ ┣ FilterManager.js      # Central manager for filtering recipes by tags and search term
 ┃ ┣ RecipeSearchManager.js # Handles the main search functionality
 ┃ ┗ TagManager.js         # Manages the addition and removal of tags
 ┣ data/
 ┃ ┗ recipes.js            # Contains recipe data
 ┣ layout/
 ┃ ┗ RecipeCard.js         # Layout component for rendering individual recipe cards
 ┣ utils/
 ┃ ┗ RecipeDisplayManager.js # Manages the display of filtered recipes
 ┗ main.js                 # Main script for initializing the application
