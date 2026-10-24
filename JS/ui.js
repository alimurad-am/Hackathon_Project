document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const saved = localStorage.getItem("hcm_theme") || "dark";
  root.dataset.theme = saved;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "theme-toggle";
  button.setAttribute("aria-label", "Toggle light and dark theme");
  const update = () => {
    const dark = root.dataset.theme !== "light";
    button.innerHTML = dark
      ? '<span class="theme-icon">☼</span><span>Light mode</span>'
      : '<span class="theme-icon">☾</span><span>Dark mode</span>';
  };
  button.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    localStorage.setItem("hcm_theme", root.dataset.theme);
    update();
    if (window.HCM?.toast)
      HCM.toast(
        `${root.dataset.theme === "light" ? "Light" : "Dark"} theme enabled`,
        "success",
      );
  });
  update();
  const topbar = document.querySelector(".topbar");
  if (topbar) {
    const actions = document.createElement("div");
    actions.className = "topbar-actions";
    const user = document.querySelector("#currentUser");
    if (user) actions.append(user);
    actions.append(button);
    topbar.append(actions);
  } else {
    button.classList.add("theme-toggle-floating");
    document.body.append(button);
  }
  const toastHost = document.createElement("div");
  toastHost.className = "toast-stack";
  toastHost.setAttribute("aria-live", "polite");
  toastHost.setAttribute("aria-atomic", "true");
  document.body.append(toastHost);
  window.HCM = window.HCM || {};
  window.HCM.toast = (message, type = "success") => {
    const item = document.createElement("div");
    item.className = `toast toast-${type}`;
    const symbol = type === "error" ? "!" : type === "warning" ? "◷" : "✓";
    item.innerHTML = `<span class="toast-mark">${symbol}</span><span class="toast-copy"><strong>${type === "error" ? "Something needs attention" : type === "warning" ? "Please review" : "All set"}</strong><small></small></span><button type="button" aria-label="Dismiss notification">×</button>`;
    item.querySelector("small").textContent = message;
    item.querySelector("button").addEventListener("click", () => item.remove());
    toastHost.append(item);
    requestAnimationFrame(() => item.classList.add("show"));
    setTimeout(() => {
      item.classList.remove("show");
      setTimeout(() => item.remove(), 260);
    }, 4200);
  };
  document
    .querySelectorAll(".panel,.stat-card,.welcome-banner")
    .forEach((el, i) => {
      el.classList.add("motion-in");
      el.style.setProperty("--motion-delay", `${Math.min(i * 45, 360)}ms`);
    });
});
