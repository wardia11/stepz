document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  const orderForm = document.getElementById("order-form");
  if (orderForm) initOrderForm(orderForm);
});

function renderCart() {
  const container = document.getElementById("cart-items");
  const summaryEl = document.getElementById("cart-summary");
  if (!container) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <p class="empty-cart-text">${t("empty_cart")}</p>
        <a href="products.html" class="btn-primary">${t("discover_shoes")}</a>
      </div>`;
    if (summaryEl) summaryEl.style.display = "none";
    return;
  }

  let html = "";
  let subtotal = 0;

  cart.forEach((item, idx) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return;
    const lineTotal = product.price * item.qty;
    subtotal += lineTotal;

    html += `
    <div class="cart-item" data-index="${idx}">
      <div class="cart-item-img">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="cart-item-info">
        <p class="cart-item-brand">${product.brand}</p>
        <h4 class="cart-item-name">${pName(product)}</h4>
        <p class="cart-item-details">${t("cart_color")} : ${tColor(product.color)} &nbsp;|&nbsp; ${t("cart_size")} : ${item.size}</p>
        <div class="cart-item-qty">
          <button class="qty-btn" data-action="dec" data-index="${idx}">&#8722;</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-index="${idx}">&#43;</button>
        </div>
      </div>
      <div class="cart-item-right">
        <p class="cart-item-price">${formatPrice(lineTotal)}</p>
        <button class="remove-btn" data-index="${idx}">${t("cart_remove")}</button>
      </div>
    </div>`;
  });

  container.innerHTML = html;

  const shipping   = subtotal >= 10000 ? 0 : 500;
  const total      = subtotal + shipping;
  const shippingTxt = shipping === 0 ? t("shipping_free") : formatPrice(shipping);

  if (summaryEl) {
    summaryEl.style.display = "block";
    document.getElementById("summary-subtotal").textContent = formatPrice(subtotal);
    document.getElementById("summary-shipping").textContent = shippingTxt;
    document.getElementById("summary-total").textContent    = formatPrice(total);
  }

  container.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", () => changeQty(parseInt(btn.dataset.index), btn.dataset.action));
  });
  container.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => removeItem(parseInt(btn.dataset.index)));
  });
}

function changeQty(index, action) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart[index]) return;
  if (action === "inc") cart[index].qty++;
  else if (action === "dec") {
    cart[index].qty--;
    if (cart[index].qty <= 0) { cart.splice(index, 1); }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function initOrderForm(form) {

  const session = JSON.parse(localStorage.getItem("session"));
  if (session) {
    const fnEl = document.getElementById("o-firstname");
    const lnEl = document.getElementById("o-lastname");
    const emEl = document.getElementById("o-email");
    if (fnEl) fnEl.value = session.firstName;
    if (lnEl) lnEl.value = session.lastName;
    if (emEl) emEl.value = session.email;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearOrderErrors();

    const firstName = document.getElementById("o-firstname").value.trim();
    const lastName  = document.getElementById("o-lastname").value.trim();
    const email     = document.getElementById("o-email").value.trim();
    const address   = document.getElementById("o-address").value.trim();
    const city      = document.getElementById("o-city").value.trim();
    const zip       = document.getElementById("o-zip").value.trim();
    const phone     = document.getElementById("o-phone").value.trim();

    let valid = true;

    const nameRegex  = /^[A-Za-zÀ-ÿ؀-ۿ\s\-]{2,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    const zipRegex   = /^\d{4,6}$/;

    const phoneClean = phone.replace(/[\s.\-]/g, "");
    const phoneRegex = /^(?:\+213|0)(?:5|6|7)[0-9]{8}$/;

    if (!nameRegex.test(firstName)) {
      showOrderError("o-firstname-err", t("err_firstname_short")); valid = false;
    }
    if (!nameRegex.test(lastName)) {
      showOrderError("o-lastname-err", t("err_lastname_short")); valid = false;
    }
    if (!emailRegex.test(email)) {
      showOrderError("o-email-err", t("err_email")); valid = false;
    }
    if (address.length < 5) {
      showOrderError("o-address-err", t("err_address")); valid = false;
    }
    if (city.length < 2) {
      showOrderError("o-city-err", t("err_city")); valid = false;
    }
    if (!zipRegex.test(zip)) {
      showOrderError("o-zip-err", t("err_zip")); valid = false;
    }
    if (!phoneRegex.test(phoneClean)) {
      showOrderError("o-phone-err", t("err_phone")); valid = false;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      showOrderError("order-global-msg", t("empty_cart")); valid = false;
    }

    if (!valid) return;

    localStorage.removeItem("cart");
    updateCartCount();

    document.getElementById("cart-items").innerHTML = "";
    document.getElementById("cart-summary").style.display = "none";
    form.style.display = "none";

    document.getElementById("order-confirm").style.display = "block";
    document.getElementById("confirm-name").textContent = firstName;
  });
}

function showOrderError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.className = "field-msg error"; }
}

function clearOrderErrors() {
  document.querySelectorAll(".field-msg").forEach(el => {
    el.textContent = "";
    el.className = "field-msg";
  });
}
