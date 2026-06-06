let currentCategory = "tous";
let searchQuery     = "";
let currentSort     = "default";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  const urlQuery = params.get("q");
  if (urlQuery) {
    searchQuery = urlQuery.toLowerCase().trim();
    const si = document.getElementById("search-input");
    if (si) si.value = urlQuery;
  }

  const urlCat = params.get("cat");
  if (urlCat && ["homme", "femme", "enfant"].includes(urlCat)) {
    currentCategory = urlCat;
    document.querySelectorAll(".filter-btn").forEach((b) =>
      b.classList.toggle("active", b.dataset.category === urlCat)
    );
  }

  renderProducts();

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      renderProducts();
    });
  });

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchQuery = searchInput.value.toLowerCase().trim();
      renderProducts();
    });
  }

  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      currentSort = sortSelect.value;
      renderProducts();
    });
  }
});

function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  let filtered = [...products];

  if (currentCategory !== "tous") {
    filtered = filtered.filter(p => p.category === currentCategory);
  }

  if (searchQuery) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchQuery) ||
      p.brand.toLowerCase().includes(searchQuery)
    );
  }

  if (currentSort === "price-asc")  filtered.sort((a, b) => a.price - b.price);
  if (currentSort === "price-desc") filtered.sort((a, b) => b.price - a.price);
  if (currentSort === "rating")     filtered.sort((a, b) => b.rating - a.rating);

  const countEl = document.getElementById("results-count");
  if (countEl) {
    const unit = (typeof LANG !== "undefined" && LANG === "ar")
      ? "منتج"
      : (filtered.length !== 1 ? "articles" : "article");
    countEl.textContent = `${filtered.length} ${unit}`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="no-results">${t("no_results")}</p>`;
    return;
  }

  grid.innerHTML = filtered.map(p => renderCard(p)).join("");

  if (typeof wireWishlistButtons === "function") wireWishlistButtons(grid);

  grid.querySelectorAll(".btn-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const id   = parseInt(btn.dataset.id);
      const size = btn.dataset.size;
      addToCart(id, parseInt(size));
    });
  });

  grid.querySelectorAll(".size-select").forEach(sel => {
    sel.addEventListener("change", () => {
      const card = sel.closest(".product-card");
      const btn  = card.querySelector(".btn-cart");
      if (btn) btn.dataset.size = sel.value;
    });
  });
}

function renderCard(p) {
  const discount = p.oldPrice
    ? `<span class="discount">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>`
    : "";
  const badge = p.badge
    ? `<span class="badge badge-${p.badge}">${tBadge(p.badge)}</span>`
    : "";
  const stars = renderStars(p.rating);
  const sizeOptions = p.sizes.map(s =>
    `<option value="${s}">${s}</option>`
  ).join("");
  const oldPriceHtml = p.oldPrice
    ? `<span class="old-price">${formatPrice(p.oldPrice)}</span>`
    : "";

  return `
  <article class="product-card reveal">
    <div class="card-img-wrap">
      ${badge}
      ${discount}
      ${wishlistButtonHTML(p.id)}
      <a class="card-img-link" href="product.html?id=${p.id}" aria-label="${p.name}"><img src="${p.image}" alt="${p.name}" loading="lazy" decoding="async" /></a>
    </div>
    <div class="card-body">
      <p class="card-brand">${p.brand}</p>
      <a class="card-name-link" href="product.html?id=${p.id}"><h3 class="card-name">${pName(p)}</h3></a>
      <p class="card-color">${tColor(p.color)}</p>
      <div class="card-rating">
        ${stars}
        <span class="review-count">(${p.reviews})</span>
      </div>
      <div class="card-footer">
        <div class="card-price">
          <span class="current-price">${formatPrice(p.price)}</span>
          ${oldPriceHtml}
        </div>
        <div class="card-actions">
          <select class="size-select" aria-label="${t("card_size")}">
            <option value="" disabled selected>${t("card_size")}</option>
            ${sizeOptions}
          </select>
          <button class="btn-cart" data-id="${p.id}" data-size="">${t("card_add")}</button>
        </div>
      </div>
    </div>
  </article>`;
}

function renderStars(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    if (rating >= i)       html += `<span class="star full">&#9733;</span>`;
    else if (rating >= i - 0.5) html += `<span class="star half">&#9733;</span>`;
    else                   html += `<span class="star empty">&#9733;</span>`;
  }
  return html;
}

function addToCart(productId, size) {
  if (!size) {
    alert(t("select_size_alert"));
    return;
  }
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const key  = `${productId}-${size}`;
  const idx  = cart.findIndex(i => i.key === key);

  if (idx > -1) {
    cart[idx].qty++;
  } else {
    cart.push({ key, productId, size, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  if (typeof openCartDrawer === "function") openCartDrawer();

  const btn = document.querySelector(`.btn-cart[data-id="${productId}"]`);
  if (btn) {
    const original = btn.textContent;
    btn.textContent = t("card_added");
    btn.classList.add("added");
    setTimeout(() => { btn.textContent = original; btn.classList.remove("added"); }, 1500);
  }
}
