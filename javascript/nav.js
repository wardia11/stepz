document.addEventListener("DOMContentLoaded", () => {
  injectNavSearch();
  injectCartDrawer();
  updateCartCount();
  updateNavSession();
  setActiveLink();
  initNavbarScroll();
});

function injectNavSearch() {
  const container = document.querySelector(".nav-container");
  if (!container || container.querySelector(".nav-search")) return;

  const lastSeg = (window.location.pathname.split("/").pop() || "").replace(/\.html$/, "");
  const onProducts = lastSeg === "products";
  const inContent = window.location.pathname.includes("/content/");
  const productsBase = inContent ? "products.html" : "content/products.html";

  const phLabel = (typeof t === "function") ? t("search_ph") : "Rechercher une chaussure, une marque…";
  const form = document.createElement("form");
  form.className = "nav-search";
  form.setAttribute("role", "search");
  form.innerHTML = `
    <svg class="nav-search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
    </svg>
    <input type="search" aria-label="${phLabel}" data-i18n-ph="search_ph" placeholder="${phLabel}" />`;

  const logo = container.querySelector(".nav-logo");
  if (logo) logo.insertAdjacentElement("afterend", form);
  else container.insertBefore(form, container.firstChild);

  const input = form.querySelector("input");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (onProducts) {
      const main = document.getElementById("search-input");
      if (main) { main.value = q; main.dispatchEvent(new Event("input")); }
    } else {
      window.location.href = productsBase + (q ? "?q=" + encodeURIComponent(q) : "");
    }
  });
}

function initNavbarScroll() {
  const header = document.querySelector("header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((acc, item) => acc + item.qty, 0);
  const badge = document.getElementById("cart-count");
  if (badge) {
    badge.textContent = total;
    badge.style.display = total > 0 ? "inline-flex" : "none";
    if (total > 0) {

      badge.classList.remove("bump");
      void badge.offsetWidth;
      badge.classList.add("bump");
    }
  }
  renderMiniCart();
}

function renderMiniCart() {
  const box = document.getElementById("mini-cart");
  if (!box || typeof products === "undefined") return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const orderHref = window.location.pathname.includes("/content/") ? "order.html" : "content/order.html";

  if (cart.length === 0) {
    box.innerHTML = `<p class="mini-cart-empty">${t("empty_cart")}</p>`;
    return;
  }

  let total = 0;
  let rows = "";
  cart.forEach((item) => {
    const p = products.find((x) => x.id === item.productId);
    if (!p) return;
    const line = p.price * item.qty;
    total += line;
    rows += `
      <div class="mini-cart-item">
        <img src="${p.image}" alt="${p.name}" />
        <div>
          <div class="mc-name">${pName(p)}</div>
          <div class="mc-meta">${t("card_size")} ${item.size} × ${item.qty}</div>
        </div>
        <div class="mc-price">${formatPrice(line)}</div>
      </div>`;
  });

  box.innerHTML =
    rows +
    `<div class="mini-cart-foot"><span>${t("total")}</span><span class="mc-total">${formatPrice(total)}</span></div>
     <a href="${orderHref}" class="mini-cart-btn">${t("view_cart")}</a>`;
}

function accountIconSVG() {
  return `<svg class="nav-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.2 4-6.5 8-6.5s8 2.3 8 6.5"/></svg>`;
}
function logoutIconSVG() {
  return `<svg class="nav-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>`;
}

function updateNavSession() {
  const session = JSON.parse(localStorage.getItem("session"));
  const accountLink = document.getElementById("nav-account");
  const logoutBtn = document.getElementById("nav-logout");

  if (accountLink) {
    const label = session ? (t("nav_hello") + session.firstName) : t("nav_account");
    accountLink.classList.add("nav-icon-link");
    accountLink.classList.toggle("logged-in", !!session);
    accountLink.setAttribute("title", label);
    accountLink.setAttribute("aria-label", label);
    accountLink.innerHTML = accountIconSVG() + `<span class="sr-only">${label}</span>`;
    if (logoutBtn) logoutBtn.style.display = session ? "inline-flex" : "none";
  }

  if (logoutBtn && !logoutBtn._wired) {
    logoutBtn._wired = true;
    logoutBtn.removeAttribute("data-i18n");
    logoutBtn.classList.add("nav-icon-link");
    logoutBtn.setAttribute("title", t("nav_logout"));
    logoutBtn.setAttribute("aria-label", t("nav_logout"));
    logoutBtn.innerHTML = logoutIconSVG() + `<span class="sr-only">${t("nav_logout")}</span>`;
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("session");
      window.location.reload();
    });
  }
}

function setActiveLink() {
  const pageSeg = (window.location.pathname.split("/").pop() || "").replace(/\.html$/, "") || "index";
  document.querySelectorAll(".nav-links a").forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;
    const hrefSeg = (href.split("/").pop() || "").split("?")[0].replace(/\.html$/, "") || "index";
    if (hrefSeg === pageSeg) link.classList.add("active");
  });
}

window.addEventListener("storage", (e) => {
  if (e.key === "cart") updateCartCount();
});

function getWishlist() { return JSON.parse(localStorage.getItem("wishlist") || "[]"); }
function isWished(id) { return getWishlist().includes(id); }
function wishlistButtonHTML(id) {
  return `<button class="wishlist-btn ${isWished(id) ? "active" : ""}" data-wish="${id}" type="button" aria-label="Ajouter aux favoris">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
  </button>`;
}
function wireWishlistButtons(scope) {
  (scope || document).querySelectorAll(".wishlist-btn").forEach((btn) => {
    if (btn._wired) return;
    btn._wired = true;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = parseInt(btn.dataset.wish);
      const w = getWishlist();
      const i = w.indexOf(id);
      if (i > -1) { w.splice(i, 1); btn.classList.remove("active"); }
      else { w.push(id); btn.classList.add("active"); }
      localStorage.setItem("wishlist", JSON.stringify(w));
    });
  });
}

function injectCartDrawer() {
  if (document.getElementById("cart-drawer")) return;
  const inContent = window.location.pathname.includes("/content/");
  const orderHref = inContent ? "order.html" : "content/order.html";
  const productsHref = inContent ? "products.html" : "content/products.html";

  const overlay = document.createElement("div");
  overlay.className = "drawer-overlay";
  overlay.id = "drawer-overlay";

  const drawer = document.createElement("aside");
  drawer.className = "cart-drawer";
  drawer.id = "cart-drawer";
  drawer.setAttribute("aria-label", "Panier");
  drawer.innerHTML = `
    <div class="drawer-head">
      <h2>PANIER</h2>
      <button class="drawer-close" id="drawer-close" aria-label="Fermer">&times;</button>
    </div>
    <div class="drawer-body" id="drawer-body"></div>
    <div class="drawer-foot" id="drawer-foot"></div>`;
  drawer.dataset.orderHref = orderHref;
  drawer.dataset.productsHref = productsHref;

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  overlay.addEventListener("click", closeCartDrawer);
  drawer.querySelector("#drawer-close").addEventListener("click", closeCartDrawer);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCartDrawer(); });

  document.querySelectorAll(".nav-cart-link").forEach((link) => {
    link.addEventListener("click", (e) => { e.preventDefault(); openCartDrawer(); });
  });
}

function openCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("drawer-overlay");
  if (!drawer) return;
  renderCartDrawer();
  overlay.classList.add("open");
  drawer.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("drawer-overlay");
  if (!drawer) return;
  overlay.classList.remove("open");
  drawer.classList.remove("open");
  document.body.style.overflow = "";
}

function renderCartDrawer() {
  const body = document.getElementById("drawer-body");
  const foot = document.getElementById("drawer-foot");
  const drawer = document.getElementById("cart-drawer");
  if (!body || typeof products === "undefined") return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    body.innerHTML = `<p class="drawer-empty">${typeof t === "function" ? t("empty_cart") : "Votre panier est vide."}</p>`;
    foot.innerHTML = `<a href="${drawer.dataset.productsHref}" class="drawer-checkout">Découvrir les chaussures</a>`;
    return;
  }

  let subtotal = 0;
  let rows = "";
  cart.forEach((item, idx) => {
    const p = products.find((x) => x.id === item.productId);
    if (!p) return;
    const line = p.price * item.qty;
    subtotal += line;
    const name = typeof pName === "function" ? pName(p) : p.name;
    const colTxt = typeof tColor === "function" ? tColor(p.color) : p.color;
    rows += `
      <div class="drawer-item">
        <div class="drawer-item-img"><img src="${p.image}" alt="${p.name}" /></div>
        <div>
          <div class="drawer-item-name">${name}</div>
          <div class="drawer-item-meta">${p.brand} · ${colTxt} · T.${item.size}</div>
          <div class="drawer-qty">
            <button data-dr="dec" data-idx="${idx}" aria-label="Moins">&minus;</button>
            <span>${item.qty}</span>
            <button data-dr="inc" data-idx="${idx}" aria-label="Plus">&plus;</button>
          </div>
          <div class="drawer-item-price">${formatPrice(line)}</div>
        </div>
        <button class="drawer-item-remove" data-dr="rm" data-idx="${idx}" aria-label="Retirer">&times;</button>
      </div>`;
  });
  body.innerHTML = rows;

  const shipping = subtotal >= 10000 ? 0 : 500;
  const total = subtotal + shipping;
  const shipTxt = shipping === 0 ? (typeof t === "function" ? t("shipping_free") : "Offerte") : formatPrice(shipping);

  foot.innerHTML = `
    <div class="drawer-row"><span>Sous-total</span><span>${formatPrice(subtotal)}</span></div>
    <div class="drawer-row"><span>Livraison</span><span>${shipTxt}</span></div>
    <div class="drawer-row total"><span>Total</span><span class="dr-amount">${formatPrice(total)}</span></div>
    <a href="${drawer.dataset.orderHref}" class="drawer-checkout">Commander</a>
    <a href="#" class="drawer-continue" id="drawer-continue">Continuer mes achats</a>`;

  body.querySelectorAll("[data-dr]").forEach((btn) => {
    btn.addEventListener("click", () => drawerCartAction(parseInt(btn.dataset.idx), btn.dataset.dr));
  });
  const cont = foot.querySelector("#drawer-continue");
  if (cont) cont.addEventListener("click", (e) => { e.preventDefault(); closeCartDrawer(); });
}

function drawerCartAction(index, action) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart[index]) return;
  if (action === "inc") cart[index].qty++;
  else if (action === "dec") { cart[index].qty--; if (cart[index].qty <= 0) cart.splice(index, 1); }
  else if (action === "rm") cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCartDrawer();
  if (typeof renderCart === "function") renderCart();
}
