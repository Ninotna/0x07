# PetitsPlats2.0
P7 JS 2.0 Les petits plats


## Architecture JS

/src
  /data
    recipes.js           # Fichier contenant les données des recettes
  /js
    /api                 # Sous-dossier pour la gestion des données
      Api.js             # Classe pour gérer les données des recettes
    /components          # Sous-dossier pour les composants (filtres, dropdowns, etc.)
      FilterManager.js    # Classe pour gérer la logique des filtres
      Dropdown.js        # Classe pour gérer l'affichage et les interactions des dropdowns
    main.js              # Point d'entrée pour instancier et lier les composants
