import React, { useEffect, useMemo, useState } from "react";

const DEFAULT_API_BASE = "http://localhost:8080/api/students";

function parseApiBase() {
  const url = new URL(window.location.href);
  return url.searchParams.get("api")?.trim() || DEFAULT_API_BASE;
}

async function parseApiError(res) {
  try {
    const data = await res.json();
    return data?.message || `${res.status} ${res.statusText}`;
  } catch {
    return `${res.status} ${res.statusText}`;
  }
}

export default function App() {
  const apiBase = useMemo(() => parseApiBase(), []);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", kind: "" }); 

  const [form, setForm] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    course: "",
    age: 18,
  });

  const isEdit = Boolean(String(form.id || "").trim());

  function clearForm() {
    setForm({ id: "", firstName: "", lastName: "", email: "", course: "", age: 18 });
  }

  function setEditMode(student) {
    setForm({
      id: String(student.id ?? ""),
      firstName: student.firstName ?? "",
      lastName: student.lastName ?? "",
      email: student.email ?? "",
      course: student.course ?? "",
      age: Number(student.age ?? 18),
    });
  }

  async function refresh() {
    setLoading(true);
    setMessage({ text: "Loading...", kind: "" });
    try {
      const res = await fetch(apiBase);
      if (!res.ok) throw new Error(await parseApiError(res));
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
      setMessage({ text: `Loaded ${Array.isArray(data) ? data.length : 0} student(s).`, kind: "" });
    } catch (e) {
      setMessage({ text: e.message || String(e), kind: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [apiBase]);

  async function onSubmit(e) {
    e.preventDefault();
    setMessage({ text: "", kind: "" });

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      course: form.course.trim(),
      age: Number(form.age),
    };

    try {
      if (isEdit) {
        const res = await fetch(`${apiBase}/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await parseApiError(res));
        setMessage({ text: "Student updated.", kind: "success" });
      } else {
        const res = await fetch(apiBase, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await parseApiError(res));
        setMessage({ text: "Student created.", kind: "success" });
      }
      clearForm();
      await refresh();
    } catch (err) {
      setMessage({ text: err.message || String(err), kind: "error" });
    }
  }

  async function onDelete(id) {
    if (!confirm(`Delete student #${id}?`)) return;
    setMessage({ text: "", kind: "" });
    try {
      const res = await fetch(`${apiBase}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await parseApiError(res));
      setMessage({ text: "Student deleted.", kind: "success" });
      await refresh();
    } catch (err) {
      setMessage({ text: err.message || String(err), kind: "error" });
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Student Management</h1>
        <p className="sub">Simple CRUD (Spring Boot + React)</p>
      </header>

      <section className="card">
        <div className="row between">
          <h2>{isEdit ? `Edit Student #${form.id}` : "Add Student"}</h2>
          <span className="pill" title="Backend API base (override via ?api=...)">
            {apiBase}
          </span>
        </div>

        <form onSubmit={onSubmit} autoComplete="off">
          <div className="grid">
            <label>
              First Name
              <input
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                type="text"
                required
                minLength={1}
              />
            </label>
            <label>
              Last Name
              <input
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                type="text"
                required
                minLength={1}
              />
            </label>
            <label>
              Email
              <input
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                type="email"
                required
              />
            </label>
            <label>
              Course
              <input
                value={form.course}
                onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))}
                type="text"
                required
                minLength={1}
              />
            </label>
            <label>
              Age
              <input
                value={form.age}
                onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                type="number"
                required
                min={1}
              />
            </label>
          </div>

          <div className="row gap">
            <button className="btn primary" type="submit" disabled={loading}>
              {isEdit ? "Update" : "Create"}
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => {
                clearForm();
                setMessage({ text: "", kind: "" });
              }}
              hidden={!isEdit}
            >
              Cancel
            </button>
            <button
              className="btn danger"
              type="button"
              onClick={() => {
                clearForm();
                setMessage({ text: "", kind: "" });
              }}
            >
              Clear Form
            </button>
            <button className="btn" type="button" onClick={refresh} disabled={loading}>
              Refresh
            </button>
          </div>

          <p className={`message ${message.kind || ""}`} role="status" aria-live="polite">
            {message.text}
          </p>
        </form>
      </section>

      <section className="card">
        <div className="row between">
          <h2>Students</h2>
          <span className="muted">{students.length} total</span>
        </div>

        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Age</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>
                    {(s.firstName || "").trim()} {(s.lastName || "").trim()}
                  </td>
                  <td>{s.email}</td>
                  <td>{s.course}</td>
                  <td>{s.age}</td>
                  <td>
                    <div className="actions">
                      <button className="btn" type="button" onClick={() => setEditMode(s)}>
                        Edit
                      </button>
                      <button className="btn danger" type="button" onClick={() => onDelete(s.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={6} className="muted">
                    No students yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="footer">hi first devops projects </footer>
    </div>
  );
}
