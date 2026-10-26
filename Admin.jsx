import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Admin.css";

const defaultTours = [
  { id: 1, name: "Goa Beach Tour", location: "Goa", price: 12000, days: 4, image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2" },
  { id: 2, name: "Ooty Hill Station", location: "Ooty", price: 9000, days: 3, image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2" },
  { id: 3, name: "Kerala Tour", location: "Kerala", price: 15000, days: 5, image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944" },
  { id: 4, name: "Manali Adventure", location: "Manali", price: 18000, days: 6, image: "https://images.unsplash.com/photo-1500534623283-312aade485b7" },
  { id: 5, name: "Thailand Beach Tour", location: "Thailand", price: 35000, days: 5, image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1" },
  { id: 6, name: "Bali Island Escape", location: "Bali", price: 40000, days: 5, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4" },
  { id: 7, name: "Dubai City Tour", location: "Dubai", price: 45000, days: 4, image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c" },
  { id: 8, name: "Singapore Holiday", location: "Singapore", price: 38000, days: 4, image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd" },
  { id: 9, name: "Paris Romantic Tour", location: "Paris", price: 85000, days: 7, image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34" },
  { id: 10, name: "Maldives Luxury Trip", location: "Maldives", price: 55000, days: 5, image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8" }
];

const readStore = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export default function Admin() {
  const [tab, setTab] = useState("dashboard");
  const [tours, setTours] = useState(() => readStore("tourPackages", defaultTours));
  const [bookings, setBookings] = useState(() => readStore("tourBookings", []));
  const [reviews, setReviews] = useState(() => readStore("tourReviews", []));
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const emptyForm = { name: "", location: "", price: "", days: "", image: "" };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => localStorage.setItem("tourPackages", JSON.stringify(tours)), [tours]);
  useEffect(() => localStorage.setItem("tourBookings", JSON.stringify(bookings)), [bookings]);
  useEffect(() => localStorage.setItem("tourReviews", JSON.stringify(reviews)), [reviews]);

  const notify = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2500);
  };

  const saveTour = (e) => {
    e.preventDefault();
    const item = {
      id: editingId ?? Date.now(),
      name: form.name.trim(),
      location: form.location.trim(),
      price: Number(form.price),
      days: Number(form.days),
      image: form.image.trim() || "https://images.unsplash.com/photo-1501785887729-0a6f4c7d0f3a"
    };
    if (!item.name || !item.location || item.price <= 0 || item.days <= 0) {
      notify("Please enter valid package details.");
      return;
    }
    if (editingId !== null) {
      setTours(tours.map((tour) => tour.id === editingId ? item : tour));
      notify("Package updated.");
    } else {
      setTours([...tours, item]);
      notify("Package added.");
    }
    setForm(emptyForm);
    setEditingId(null);
  };

  const editTour = (tour) => {
    setEditingId(tour.id);
    setForm({ name: tour.name, location: tour.location, price: String(tour.price), days: String(tour.days), image: tour.image || "" });
    setTab("packages");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteTour = (id) => {
    if (!window.confirm("Delete this package?")) return;
    setTours(tours.filter((tour) => tour.id !== id));
    notify("Package deleted.");
  };

  const updateStatus = (id, status) => {
    setBookings(bookings.map((b) => b.id === id ? { ...b, status, tracking: false } : b));
    notify("Booking status updated.");
  };

  const deleteReview = (id) => {
    if (!window.confirm("Delete this review?")) return;
    setReviews(reviews.filter((r) => r.id !== id));
    notify("Review deleted.");
  };

  const visibleBookings = bookings.filter((b) =>
    `${b.customerName || ""} ${b.userEmail || ""} ${b.tourName || ""} ${b.location || ""}`
      .toLowerCase().includes(search.toLowerCase())
  );
  const revenue = bookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((sum, b) => sum + Number(b.price || 0), 0);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Travel<span>World</span></h2>
        <p className="admin-menu-title">ADMIN MENU</p>
        {[
          ["dashboard", "▦ Dashboard"],
          ["packages", "✈ Tour Packages"],
          ["bookings", "▤ Bookings"],
          ["reviews", "☆ Reviews"]
        ].map(([key, label]) => (
          <button key={key} className={tab === key ? "admin-menu active" : "admin-menu"} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
        <div className="admin-sidebar-bottom">Tour &amp; Travel<br />Management System</div>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage tour packages, customer bookings, and reviews.</p>
          </div>
          <span className="admin-role">Administrator</span>
        </header>

        {message && <div className="alert alert-success">{message}</div>}

        {tab === "dashboard" && <>
          <div className="admin-stats">
            <div className="admin-stat"><p>Total Packages</p><h2>{tours.length}</h2></div>
            <div className="admin-stat"><p>Total Bookings</p><h2>{bookings.length}</h2></div>
            <div className="admin-stat"><p>Confirmed Bookings</p><h2>{bookings.filter(b => b.status === "Confirmed").length}</h2></div>
            <div className="admin-stat"><p>Reviews</p><h2>{reviews.length}</h2></div>
            <div className="admin-stat"><p>Booking Revenue</p><h2>₹{revenue.toLocaleString("en-IN")}</h2></div>
          </div>
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div><h2>Recent Bookings</h2><p>Latest customer bookings</p></div>
              <button className="btn btn-success" onClick={() => setTab("bookings")}>View All</button>
            </div>
            {bookings.length === 0 ? <p className="admin-empty">No bookings yet.</p> :
              <div className="table-responsive"><table className="table admin-table align-middle">
                <thead><tr><th>Customer</th><th>Tour</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>{[...bookings].slice(-5).reverse().map(b => <tr key={b.id}>
                  <td>{b.customerName || "Customer"}<small>{b.userEmail}</small></td>
                  <td>{b.tourName}<small>{b.location}</small></td>
                  <td>{b.travelDate || "—"}</td>
                  <td>₹{Number(b.price || 0).toLocaleString("en-IN")}</td>
                  <td><span className={`status-label ${String(b.status || "").toLowerCase()}`}>{b.status || "Pending"}</span></td>
                </tr>)}</tbody>
              </table></div>}
          </section>
        </>}

        {tab === "packages" && <>
          <section className="admin-panel">
            <h2>{editingId !== null ? "Edit Tour Package" : "Add Tour Package"}</h2>
            <p className="admin-muted">Add a new destination or update an existing one.</p>
            <form onSubmit={saveTour}>
              <div className="admin-form-grid">
                <label>Package Name<input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Thailand Beach Tour" required /></label>
                <label>Location<input className="form-control" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Thailand" required /></label>
                <label>Price per person (₹)<input className="form-control" type="number" min="1" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /></label>
                <label>Duration (days)<input className="form-control" type="number" min="1" value={form.days} onChange={e => setForm({ ...form, days: e.target.value })} required /></label>
                <label className="full-width">Image URL<input className="form-control" type="url" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." /></label>
              </div>
              <button className="btn btn-success mt-3" type="submit">{editingId !== null ? "Update Package" : "Add Package"}</button>
              {editingId !== null && <button className="btn btn-outline-secondary mt-3 ms-2" type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}
            </form>
          </section>
          <section className="admin-panel">
            <div className="admin-panel-heading"><div><h2>All Packages</h2><p>{tours.length} packages available in admin storage</p></div></div>
            {tours.length === 0 ? <p className="admin-empty">No packages available.</p> :
              <div className="table-responsive"><table className="table admin-table align-middle">
                <thead><tr><th>Package</th><th>Location</th><th>Days</th><th>Price</th><th>Actions</th></tr></thead>
                <tbody>{tours.map(t => <tr key={t.id}>
                  <td><div className="admin-package"><img src={t.image} alt="" onError={e => { e.currentTarget.style.visibility = "hidden"; }} />{t.name}</div></td>
                  <td>{t.location}</td><td>{t.days}</td><td>₹{Number(t.price).toLocaleString("en-IN")}</td>
                  <td><button className="btn btn-sm btn-outline-primary me-2" onClick={() => editTour(t)}>Edit</button><button className="btn btn-sm btn-outline-danger" onClick={() => deleteTour(t.id)}>Delete</button></td>
                </tr>)}</tbody>
              </table></div>}
          </section>
        </>}

        {tab === "bookings" && <section className="admin-panel">
          <div className="admin-panel-heading">
            <div><h2>Manage Bookings</h2><p>Search customers and change booking status.</p></div>
            <input className="form-control admin-search" placeholder="Search bookings..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {visibleBookings.length === 0 ? <p className="admin-empty">No matching bookings found.</p> :
            <div className="table-responsive"><table className="table admin-table align-middle">
              <thead><tr><th>Customer</th><th>Tour</th><th>Travel Date</th><th>People</th><th>Price</th><th>Status</th><th>Change Status</th></tr></thead>
              <tbody>{visibleBookings.map(b => <tr key={b.id}>
                <td>{b.customerName || "Customer"}<small>{b.userEmail}</small></td><td>{b.tourName}<small>{b.location}</small></td>
                <td>{b.travelDate || "—"}</td><td>{b.persons || 1}</td><td>₹{Number(b.price || 0).toLocaleString("en-IN")}</td>
                <td><span className={`status-label ${String(b.status || "").toLowerCase()}`}>{b.status || "Pending"}</span></td>
                <td><select className="form-select form-select-sm" value={b.status || "Confirmed"} onChange={e => updateStatus(b.id, e.target.value)}>
                  <option>Confirmed</option><option>Pending</option><option>Cancelled</option><option>Completed</option>
                </select></td>
              </tr>)}</tbody>
            </table></div>}
        </section>}

        {tab === "reviews" && <section className="admin-panel">
          <h2>Customer Reviews</h2><p className="admin-muted">Read and manage reviews submitted by customers.</p>
          {reviews.length === 0 ? <p className="admin-empty">No reviews submitted yet.</p> :
            <div className="admin-review-grid">{[...reviews].reverse().map(r => <article className="admin-review" key={r.id}>
              <div className="d-flex justify-content-between gap-3"><div><h3>{r.userName || "Customer"}</h3><p>{r.tourName} · {r.location}</p></div><strong className="admin-stars">{"★".repeat(Math.max(0, Math.min(5, Number(r.rating) || 0)))}</strong></div>
              <p className="review-comment">{r.comment}</p><div className="d-flex justify-content-between align-items-center"><small>{r.date}</small><button className="btn btn-sm btn-outline-danger" onClick={() => deleteReview(r.id)}>Delete</button></div>
            </article>)}</div>}
        </section>}

        <footer className="admin-footer">© 2026 Tour &amp; Travel Management System</footer>
      </main>
    </div>
  );
}
