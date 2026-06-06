const products = [

  {
    id: 1,
    name: "Air Force 1 '07",
    brand: "Nike",
    category: "homme",
    price: 18000,
    oldPrice: null,
    image: "images/shoe-1.webp",
    sizes: [40, 41, 42, 43, 44, 45, 46],
    color: "Blanc",
    rating: 4.8,
    reviews: 412,
    badge: "bestseller",
    description: "La sneaker iconique en cuir blanc avec amorti Nike Air."
  },
  {
    id: 2,
    name: "Ultraboost 1.0",
    brand: "Adidas",
    category: "homme",
    price: 27000,
    oldPrice: 30000,
    image: "images/shoe-2.webp",
    sizes: [40, 41, 42, 43, 44, 45, 46],
    color: "Noir",
    rating: 4.7,
    reviews: 268,
    badge: "promo",
    description: "Running haute performance avec retour d'énergie Boost."
  },
  {
    id: 3,
    name: "Suede Classic",
    brand: "Puma",
    category: "homme",
    price: 12000,
    oldPrice: null,
    image: "images/shoe-3.webp",
    sizes: [40, 41, 42, 43, 44, 45],
    color: "Noir",
    rating: 4.5,
    reviews: 187,
    badge: null,
    description: "Le daim culte de Puma, style streetwear intemporel."
  },

  {
    id: 4,
    name: "Air Max 90",
    brand: "Nike",
    category: "femme",
    price: 22000,
    oldPrice: null,
    image: "images/shoe-4.webp",
    sizes: [36, 37, 38, 39, 40, 41],
    color: "Blanc / Multicolore",
    rating: 4.6,
    reviews: 231,
    badge: "nouveaute",
    description: "Amorti Max Air visible et look rétro running coloré."
  },
  {
    id: 5,
    name: "Stan Smith",
    brand: "Adidas",
    category: "femme",
    price: 15000,
    oldPrice: null,
    image: "images/shoe-5.webp",
    sizes: [36, 37, 38, 39, 40, 41],
    color: "Blanc / Vert",
    rating: 4.7,
    reviews: 421,
    badge: "bestseller",
    description: "Le classique iconique en cuir blanc à talon vert."
  },
  {
    id: 6,
    name: "Cali",
    brand: "Puma",
    category: "femme",
    price: 13500,
    oldPrice: 16500,
    image: "images/shoe-6.webp",
    sizes: [36, 37, 38, 39, 40],
    color: "Blanc",
    rating: 4.4,
    reviews: 143,
    badge: "promo",
    description: "Sneaker plateforme tendance inspirée du tennis vintage."
  },

  {
    id: 7,
    name: "Air Force 1",
    brand: "Nike",
    category: "enfant",
    price: 11000,
    oldPrice: null,
    image: "images/shoe-7.webp",
    sizes: [28, 29, 30, 31, 32, 33, 34],
    color: "Blanc",
    rating: 4.8,
    reviews: 156,
    badge: "bestseller",
    description: "La AF1 iconique en version enfant, tout cuir blanc."
  },
  {
    id: 8,
    name: "Grand Court",
    brand: "Adidas",
    category: "enfant",
    price: 6500,
    oldPrice: 8000,
    image: "images/shoe-8.webp",
    sizes: [28, 29, 30, 31, 32, 33, 34],
    color: "Vert",
    rating: 4.5,
    reviews: 98,
    badge: "promo",
    description: "Sneaker enfant confortable en daim, style tennis."
  },
  {
    id: 9,
    name: "Smash 3.0",
    brand: "Puma",
    category: "enfant",
    price: 6000,
    oldPrice: null,
    image: "images/shoe-9.webp",
    sizes: [28, 29, 30, 31, 32, 33, 34],
    color: "Bleu marine",
    rating: 4.6,
    reviews: 74,
    badge: "nouveaute",
    description: "Basket enfant classique en cuir, semelle souple."
  }
];

const ASSET_BASE = window.location.pathname.includes("/content/") ? "../" : "";
products.forEach((p) => {
  p.image = ASSET_BASE + p.image;
});

const users = [
  {
    email: "test@mail.com",
    password: "Test1234!",
    firstName: "Test",
    lastName: "User"
  }
];
