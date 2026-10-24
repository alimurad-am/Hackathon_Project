document.addEventListener("DOMContentLoaded", () => {
  const H = window.HCM;
  if (!H || !document.querySelector("#employeeForm")) return;
  const form = document.querySelector("#employeeForm"),
    rows = document.querySelector("#employeeRows"),
    search = document.querySelector("#employeeSearch"),
    filter = document.querySelector("#departmentFilter"),
    msg = document.querySelector("#employeeMessage"),
    cancel = document.querySelector("#cancelEdit");
  let editing = null;
  function render() {
    const users = H.getUsers().filter((u) => u.role === "employee"),
      q = search.value.trim().toLowerCase(),
      dep = filter.value;
    const deps = [...new Set(users.map((u) => u.department).filter(Boolean))];
    filter.innerHTML =
      '<option value="">All departments</option>' +
      deps.map((d) => `<option>${H.escapeHTML(d)}</option>`).join("");
    filter.value = dep;
    const list = users.filter(
      (u) =>
        (!q ||
          [u.name, u.email, u.department].some((v) =>
            String(v).toLowerCase().includes(q),
          )) &&
        (!dep || u.department === dep),
    );
    document.querySelector("#employeeCount").textContent =
      `${users.length} employee${users.length === 1 ? "" : "s"}`;
    rows.innerHTML = list.length
      ? list
          .map(
            (u) =>
              `<tr><td>${H.escapeHTML(u.name)}</td><td>${H.escapeHTML(u.email)}</td><td>${H.escapeHTML(u.department)}</td><td>${H.money(u.salary)}</td><td><button class="table-action" data-edit="${u.id}">Edit</button><button class="table-action danger" data-delete="${u.id}">Delete</button></td></tr>`,
          )
          .join("")
      : '<tr><td colspan="5" class="empty-row">No employees found. Add your first employee above.</td></tr>';
  }
  function reset() {
    form.reset();
    form.elements.id.value = "";
    editing = null;
    form.elements.password.required = true;
    document.querySelector("#employeeFormTitle").textContent =
      "Add an employee";
    document.querySelector("#saveEmployee").textContent = "Add employee";
    cancel.classList.add("hidden");
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(form),
      id = f.get("id"),
      name = f.get("name").trim(),
      email = f.get("email").trim().toLowerCase(),
      department = f.get("department").trim(),
      salary = Number(f.get("salary")),
      password = f.get("password");
    if (!name || !email || !department || salary <= 0) {
      H.setMessage(
        msg,
        "Complete all required fields and use a salary greater than zero.",
        "error",
      );
      return;
    }
    let users = H.getUsers();
    if (
      users.some(
        (u) => u.email.toLowerCase() === email && String(u.id) !== String(id),
      )
    ) {
      H.setMessage(msg, "This email is already registered.", "error");
      return;
    }
    if (!id && (!password || password.length < 6)) {
      H.setMessage(
        msg,
        "A temporary password of at least 6 characters is required.",
        "error",
      );
      return;
    }
    if (id) {
      users = users.map((u) =>
        String(u.id) === String(id)
          ? {
              ...u,
              name,
              email,
              department,
              salary,
              ...(password ? { password } : {}),
            }
          : u,
      );
      H.setMessage(msg, "Employee updated successfully.", "success");
    } else {
      users.push({
        id: Date.now(),
        name,
        email,
        department,
        salary,
        password,
        role: "employee",
      });
      H.setMessage(msg, "Employee and login account created.", "success");
    }
    H.saveUsers(users);
    reset();
    render();
  });
  rows.addEventListener("click", (e) => {
    const edit = e.target.closest("[data-edit]"),
      del = e.target.closest("[data-delete]");
    if (edit) {
      const u = H.byId(edit.dataset.edit);
      if (!u) return;
      editing = u.id;
      for (const k of ["id", "name", "email", "department", "salary"])
        form.elements[k].value = u[k] ?? "";
      form.elements.password.value = "";
      form.elements.password.required = false;
      document.querySelector("#employeeFormTitle").textContent =
        "Edit employee";
      document.querySelector("#saveEmployee").textContent = "Save changes";
      cancel.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (del) {
      const u = H.byId(del.dataset.delete);
      if (
        !u ||
        !confirm(
          `Delete ${u.name}? Their related attendance and leave records will also be removed.`,
        )
      )
        return;
      H.saveUsers(H.getUsers().filter((x) => String(x.id) !== String(u.id)));
      H.saveAttendance(
        H.getAttendance().filter((a) => String(a.userId) !== String(u.id)),
      );
      H.saveLeaves(
        H.getLeaves().filter((l) => String(l.userId) !== String(u.id)),
      );
      render();
    }
  });
  cancel.addEventListener("click", reset);
  search.addEventListener("input", render);
  filter.addEventListener("change", render);
  render();
});
