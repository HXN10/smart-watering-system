document.querySelectorAll(".tab-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tab;
    
    document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    
    document.querySelectorAll(".auth-form").forEach((form) => form.classList.remove("active"));
    document.querySelector(`.auth-form[data-form="${tab}"]`).classList.add("active");
  });
});

document.getElementById("loginFormElement").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const submitBtn = e.target.querySelector(".submit-btn");
  const originalBtnText = submitBtn.innerHTML;

  if (!email || !password) {
    showFormError("Please fill in all fields");
    return;
  }

  const formEl = e.target;
  disableForm(formEl, true);
  submitBtn.innerHTML = '<span>Signing in...</span>';

  console.log("Attempting login with:", { email, password });

  try {
    const data = await apiFetch("/api/login", {
      method: "POST",
      body: { email, password },
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    
  showFormSuccess("Login successful! Redirecting...");
    setTimeout(() => {
      window.location.href = "./dashboard.html";
    }, 800);
  } catch (err) {
    console.error("Login error:", err);
  showFormError(err.message || "Login failed. Please try again.");
  disableForm(formEl, false);
  submitBtn.innerHTML = originalBtnText;
  }
});

document.getElementById("signupFormElement").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const submitBtn = e.target.querySelector(".submit-btn");
  const originalBtnText = submitBtn.innerHTML;

  if (!email || !password) {
    showFormError("Please fill in all fields");
    return;
  }

  if (password.length < 6) {
    showFormError("Password must be at least 6 characters");
    return;
  }

  const formEl = e.target;
  disableForm(formEl, true);
  submitBtn.innerHTML = '<span>Creating account...</span>';

  console.log("Attempting signup with:", { email });

  try {
    const data = await apiFetch("/api/signup", {
      method: "POST",
      body: { email, password },
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    
  showFormSuccess("Account created! Redirecting...");
    setTimeout(() => {
      window.location.href = "./dashboard.html";
    }, 800);
  } catch (err) {
    console.error("Signup error:", err);
  showFormError(err.message || "Signup failed. Please try again.");
  disableForm(formEl, false);
  submitBtn.innerHTML = originalBtnText;
  }
});

function disableForm(formEl, disabled = true) {
  try {
    const controls = Array.from(formEl.elements || []);
    controls.forEach((c) => {
      if (c && typeof c.disabled !== 'undefined') c.disabled = disabled;
    });
  } catch (e) {
    console.warn('disableForm helper error', e);
  }
}

function showFormError(message) {
  removeFormMessages();
  const alertEl = document.createElement("div");
  alertEl.className = "form-alert alert-error";
  alertEl.role = "alert";
  alertEl.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18ZM10 11C10.5523 11 11 10.5523 11 10V6C11 5.44772 10.5523 5 10 5C9.44772 5 9 5.44772 9 6V10C9 10.5523 9.44772 11 10 11ZM11 14C11 14.5523 10.5523 15 10 15C9.44772 15 9 14.5523 9 14C9 13.4477 9.44772 13 10 13C10.5523 13 11 13.4477 11 14Z" fill="currentColor"/>
    </svg>
    <span>${message}</span>
  `;
  const formEl = document.querySelector(".auth-form.active");
  formEl.insertBefore(alertEl, formEl.firstChild);
}

function showFormSuccess(message) {
  removeFormMessages();
  const alertEl = document.createElement("div");
  alertEl.className = "form-alert alert-success";
  alertEl.role = "status";
  alertEl.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18ZM13.5563 7.16345C13.9117 6.77324 14.5382 6.77324 14.8936 7.16345C15.249 7.55365 15.249 8.18868 14.8936 8.57889L9.06989 14.7256C8.71451 15.1158 8.08792 15.1158 7.73254 14.7256L5.62885 12.5077C5.27347 12.1175 5.27347 11.4825 5.62885 11.0923C5.98424 10.7021 6.61083 10.7021 6.96622 11.0923L8.40122 12.5923L13.5563 7.16345Z" fill="currentColor"/>
    </svg>
    <span>${message}</span>
  `;
  const formEl = document.querySelector(".auth-form.active");
  formEl.insertBefore(alertEl, formEl.firstChild);
}

function removeFormMessages() {
  document.querySelectorAll(".form-alert").forEach(el => el.remove());
}
