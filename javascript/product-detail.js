function renderProductDetail() {
  const root = document.getElementById("pd-root");
  if (!root) return;

  const id = parseInt(new URLSearchParams(location.search).get("id"));
  const p = (typeof products !== "undefined") ? products.find((x) => x.id === id) : null;

  if (!p) {
    root.innerHTML = `<div class="pd-notfound"><h1>Produit introuvable</h1><a href="products.html" class="btn-primary">Retour au catalogue</a></div>`;
    return;
  }

  document.title = `${p.name} – STEPZ`;
  const ref = "STZ-" + String(p.id).padStart(4, "0");
  const oldPrice = p.oldPrice ? `<span class="pd-old">${formatPrice(p.oldPrice)}</span>` : "";
  const sizeBtns = p.sizes.map((s) => `<button class="pd-size" data-size="${s}" type="button">${s}</button>`).join("");
  const badge = p.badge ? `<span class="pd-badge badge badge-${p.badge}">${tBadge(p.badge)}</span>` : "";

  root.innerHTML = `
    <nav class="breadcrumb pd-breadcrumb" aria-label="Fil d'Ariane">
      <a href="../index.html">Accueil</a><span class="sep">/</span>
      <a href="products.html">Chaussures</a><span class="sep">/</span>
      <span>${pName(p)}</span>
    </nav>
    <div class="pd-grid">
      <div class="pd-gallery">
        <span class="pd-gallery-bar"></span>
        ${badge}
        <img src="${p.image}" alt="${p.name}" fetchpriority="high" decoding="async" />
      </div>
      <div class="pd-info">
        <p class="pd-brand">${p.brand}</p>
        <h1 class="pd-name">${pName(p)}</h1>
        <p class="pd-ref">${ref}</p>
        <div class="pd-rating">${stars(p.rating)}<span class="review-count">(${p.reviews} avis)</span></div>
        <div class="pd-price">${formatPrice(p.price)}${oldPrice}</div>
        <a href="#" class="pd-guide" onclick="return false;">Guide des tailles</a>
        <div class="pd-fav">${wishlistButtonHTML(p.id)}<span>Favoris</span></div>
        <div class="pd-field">
          <span class="pd-label">Pointure</span>
          <div class="pd-sizes">${sizeBtns}</div>
        </div>
        <div class="pd-field">
          <span class="pd-label">Couleur</span>
          <span class="pd-color"><span class="pd-color-dot" style="background:${colorHex(p.color)}"></span> ${tColor(p.color)}</span>
        </div>
        <button class="pd-add" id="pd-add" type="button" disabled>Choisir une pointure</button>
        <div class="pd-desc">
          <h3>Description</h3>
          <p>${p.description || ""}</p>
        </div>
        <ul class="pd-perks">
          <li>🚚 Livraison gratuite dès 10&nbsp;000&nbsp;DA</li>
          <li>↩️ Retours gratuits sous 30 jours</li>
          <li>🔒 Paiement 100% sécurisé</li>
        </ul>
      </div>
    </div>`;

  if (typeof wireWishlistButtons === "function") wireWishlistButtons(root);

  let selectedSize = null;
  const addBtn = root.querySelector("#pd-add");

  root.querySelectorAll(".pd-size").forEach((b) => {
    b.addEventListener("click", () => {
      root.querySelectorAll(".pd-size").forEach((x) => x.classList.remove("selected"));
      b.classList.add("selected");
      selectedSize = parseInt(b.dataset.size);
      addBtn.disabled = false;
      addBtn.textContent = "Ajouter au panier";
    });
  });

  addBtn.addEventListener("click", () => {
    if (!selectedSize) return;
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const key = `${p.id}-${selectedSize}`;
    const i = cart.findIndex((it) => it.key === key);
    if (i > -1) cart[i].qty++;
    else cart.push({ key, productId: p.id, size: selectedSize, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    if (typeof updateCartCount === "function") updateCartCount();
    if (typeof openCartDrawer === "function") openCartDrawer();
  });
}
document.addEventListener("DOMContentLoaded", renderProductDetail);

function stars(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) html += `<span class="star full">&#9733;</span>`;
    else if (rating >= i - 0.5) html += `<span class="star half">&#9733;</span>`;
    else html += `<span class="star empty">&#9733;</span>`;
  }
  return html;
}

function colorHex(name) {
  const n = (name || "").toLowerCase();
  if (n.includes("blanc") && n.includes("vert")) return "linear-gradient(135deg,#f2f2f2 50%,#2e7d32 50%)";
  if (n.includes("multicolore")) return "linear-gradient(135deg,#f0556b,#ffb400,#2e7d9a)";
  if (n.includes("blanc")) return "#f2f2f2";
  if (n.includes("noir")) return "#16181d";
  if (n.includes("vert")) return "#2e7d32";
  if (n.includes("bleu")) return "#1f2a4a";
  return "#cccccc";
}
