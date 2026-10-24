document.addEventListener("DOMContentLoaded", () => {
  const H = window.HCM,
    s = H?.getSession();
  if (!H || !s || !document.querySelector("#employeeWelcome")) return;
  document.querySelector("#employeeWelcome").textContent =
    `Welcome, ${s.name}.`;
  document.querySelector("#todayDate").textContent =
    new Date().toLocaleDateString("en-PK", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  document.querySelector("#myLeaveBalance").textContent =
    Math.max(
      0,
      Number(H.getCompany().settings.leaveQuota) -
        H.approvedLeaveDays(s.id, new Date().getFullYear()),
    ) + " days";
});
