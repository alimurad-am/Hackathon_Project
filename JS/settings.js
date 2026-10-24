document.addEventListener("DOMContentLoaded", () => {
  const H = window.HCM,
    form = document.querySelector("#settingsForm");
  if (!H || !form) return;
  const c = H.getCompany();
  form.elements.name.value = c.name;
  form.elements.officeStart.value = c.settings.officeStart;
  form.elements.graceMinutes.value = c.settings.graceMinutes;
  form.elements.leaveQuota.value = c.settings.leaveQuota;
  form
    .querySelectorAll('[name="workingDays"]')
    .forEach(
      (el) => (el.checked = c.settings.workingDays.includes(Number(el.value))),
    );
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(form),
      workingDays = f.getAll("workingDays").map(Number);
    if (!workingDays.length) {
      H.setMessage(
        document.querySelector("#settingsMessage"),
        "Choose at least one working day.",
        "error",
      );
      return;
    }
    H.saveCompany({
      name: f.get("name").trim(),
      settings: {
        officeStart: f.get("officeStart"),
        graceMinutes: Number(f.get("graceMinutes")),
        leaveQuota: Number(f.get("leaveQuota")),
        workingDays,
      },
    });
    H.setMessage(
      document.querySelector("#settingsMessage"),
      "Company settings saved successfully.",
      "success",
    );
  });
});
