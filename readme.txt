========================================================
  STEPZ – Site e-commerce de chaussures
========================================================

DESCRIPTION DU SITE
-------------------
STEPZ est un mini site e-commerce dédié à la vente de
chaussures pour Homme, Femme et Enfant.
Il simule les fonctionnalités essentielles d'une boutique
en ligne moderne (style Zalando) : catalogue filtrable,
panier dynamique, authentification simulée et commande.

PAGES DU SITE
-------------
1. index.html         – Page d'accueil (héros + catégories + vedettes)
2. content/products.html  – Catalogue produits (filtre, recherche, tri)
3. content/login.html     – Connexion utilisateur
4. content/register.html  – Inscription utilisateur
5. content/order.html     – Panier et formulaire de commande

FONCTIONNALITÉS
---------------
- 18 produits répartis en 3 catégories (Homme / Femme / Enfant)
- Filtrage côté client (sans rechargement de page)
- Barre de recherche en temps réel
- Tri par prix et par note
- Système de panier avec localStorage (ajout, suppression, quantité)
- Authentification simulée avec localStorage
- Validation des formulaires avec expressions régulières (RegEx)
- Design responsive (mobile, tablette, desktop)
- Balises HTML5 sémantiques et attributs ARIA

INSTRUCTIONS D'UTILISATION
---------------------------
1. Ouvrir index.html dans un navigateur web moderne.
2. Naviguer via le menu de navigation.
3. Sur la page Produits : filtrer par catégorie, rechercher
   ou trier les articles, choisir une taille et cliquer
   "Ajouter" pour mettre un produit dans le panier.
4. Page Panier : modifier les quantités, supprimer des
   articles, remplir le formulaire de livraison et valider.
5. Connexion de démonstration :
     Email    : jean.dupont@email.com
     Mot de passe : Test1234!
6. Ou créer un nouveau compte via la page Inscription.

ORGANISATION DES FICHIERS
--------------------------
ShoesStore/
├── index.html
├── content/
│   ├── products.html
│   ├── login.html
│   ├── register.html
│   └── order.html
├── style/
│   ├── main.css        (global, nav, footer, hero)
│   ├── products.css    (catalogue, filtres, cartes)
│   ├── auth.css        (connexion & inscription)
│   └── order.css       (panier & commande)
├── javascript/
│   ├── data.js         (produits + utilisateurs)
│   ├── nav.js          (navigation, session, panier)
│   ├── auth.js         (connexion & inscription + RegEx)
│   ├── products.js     (affichage & filtrage produits)
│   └── cart.js         (gestion panier & commande)
├── images/
└── readme.txt

TECHNOLOGIES
------------
- HTML5 sémantique
- CSS3 (Flexbox, Grid, variables CSS, responsive)
- JavaScript ES6 (DOM, localStorage, RegEx, modules)
- Google Fonts (Montserrat)

RÉALISÉ PAR
-----------
- Boubekeur Ouardia
- Feddak Malika
- Ferrah Ghania
- Mehouel Nacera

