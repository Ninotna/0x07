import globals from "globals";
import pluginJs from "@eslint/js";
import tailwindcss from "eslint-plugin-tailwindcss";  // Plugin pour Tailwind CSS
import jsxA11y from "eslint-plugin-jsx-a11y";  // Plugin pour l'accessibilité
import promise from "eslint-plugin-promise";  // Plugin pour les promesses
import importPlugin from "eslint-plugin-import";  // Plugin pour la gestion des imports

export default [
  // Configuration des options de langage pour le navigateur
  {
    languageOptions: {
      globals: globals.browser,  // Utilise les globales du navigateur
      ecmaVersion: "latest",  // Utilise la version ECMAScript la plus récente
      sourceType: "module",  // Utilise le mode module ES6
    },
  },

  // Règles ESLint recommandées pour JavaScript
  pluginJs.configs.recommended,

  // Plugins et règles personnalisées
  {
    plugins: {
      tailwindcss: tailwindcss,  // Plugin Tailwind CSS
      jsxA11y: jsxA11y,  // Plugin pour l'accessibilité
      promise: promise,  // Plugin pour les promesses
      import: importPlugin,  // Plugin pour la gestion des imports
    },
    rules: {
      // Style et bonnes pratiques
      "quotes": ["error", "single"],  // Utilisation des guillemets simples
      "semi": ["error", "always"],  // Imposition des points-virgules
      "no-unused-vars": ["warn"],  // Avertit pour les variables inutilisées
      "eqeqeq": ["error", "always"],  // Enforce usage de === et !==
      "no-console": "warn",  // Avertit lors de l'utilisation de console.log

      // Gestion des promesses (via eslint-plugin-promise)
      "promise/catch-or-return": "error",  // Assure que catch est utilisé avec les promesses
      "promise/always-return": "error",  // Oblige les promesses à renvoyer une valeur

      // Gestion des imports (via eslint-plugin-import)
      "import/no-unresolved": "error",  // Avertit si les modules ne peuvent pas être résolus
      "import/export": "error",  // Avertit si les exports/imports sont incorrects

      // Tailwind CSS
      "tailwindcss/no-custom-classname": "off",  // Désactive les avertissements pour les classes personnalisées

      // Accessibilité (jsx-a11y)
      "jsx-a11y/anchor-is-valid": "warn",  // Vérifie que les balises <a> sont valides
    },
  },
];
