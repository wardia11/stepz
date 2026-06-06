document.addEventListener("DOMContentLoaded", () => {

  const registerForm = document.getElementById("register-form");
  if (registerForm) initRegister(registerForm);

  const loginForm = document.getElementById("login-form");
  if (loginForm) initLogin(loginForm);
});

function initRegister(form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName  = document.getElementById("lastName").value.trim();
    const email     = document.getElementById("email").value.trim();
    const password  = document.getElementById("password").value;
    const confirm   = document.getElementById("confirm").value;

    let valid = true;

    const nameRegex = /^[A-Za-zÀ-ÿ؀-ۿ\s\-]{2,50}$/;
    if (!nameRegex.test(firstName)) {
      showError("firstName-error", t("err_firstname"));
      valid = false;
    }
    if (!nameRegex.test(lastName)) {
      showError("lastName-error", t("err_lastname"));
      valid = false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      showError("email-error", t("err_email"));
      valid = false;
    }

    const pwdRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!pwdRegex.test(password)) {
      showError("password-error", t("err_pwd"));
      valid = false;
    }

    if (password !== confirm) {
      showError("confirm-error", t("err_pwd_match"));
      valid = false;
    }

    if (!valid) return;

    const stored = JSON.parse(localStorage.getItem("registeredUsers")) || [...users];
    const exists = stored.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      showError("email-error", t("err_email_exists"));
      return;
    }

    stored.push({ firstName, lastName, email, password });
    localStorage.setItem("registeredUsers", JSON.stringify(stored));

    showSuccess("register-msg", t("register_success"));
    form.reset();
    setTimeout(() => { window.location.href = "login.html"; }, 2000);
  });
}

function initLogin(form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const email    = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    let valid = true;

    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      showError("email-error", t("err_email"));
      valid = false;
    }
    if (password.length < 6) {
      showError("password-error", t("err_pwd_short"));
      valid = false;
    }

    if (!valid) return;

    const stored = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const allUsers = [...users, ...stored];

    const found = allUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      showError("login-msg", t("err_login"), "error");
      return;
    }

    localStorage.setItem("session", JSON.stringify({
      email: found.email,
      firstName: found.firstName,
      lastName: found.lastName
    }));

    showSuccess("login-msg", t("login_welcome_1") + found.firstName + t("login_welcome_2"));
    setTimeout(() => { window.location.href = "../index.html"; }, 1500);
  });
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.className = "field-msg error"; }
}

function showSuccess(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.className = "field-msg success"; }
}

function clearErrors() {
  document.querySelectorAll(".field-msg").forEach(el => {
    el.textContent = "";
    el.className = "field-msg";
  });
}
