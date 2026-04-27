const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

// ✅ ALL requires FIRST
const authRoute    = require("./routes/auth");
const bookingRoute = require("./routes/booking");
const carsRoute    = require("./routes/cars");
const sellRoute    = require("./routes/sell");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// ✅ Routes ONCE (you had them twice before)
app.use("/api/auth",     authRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/cars",     carsRoute);
app.use("/api/sell",     sellRoute);

/* ── GET all bookings (admin) ── */
app.get("/api/bookings", (req, res) => {
  db.query("SELECT * FROM bookings ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "DB error" });
    res.json(results);
  });
});

/* ── UPDATE booking status ── */
app.patch("/api/bookings/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ['pending', 'confirmed', 'cancelled'];
  if (!allowed.includes(status))
    return res.status(400).json({ success: false, message: "Invalid status" });

  db.query("UPDATE bookings SET status = ? WHERE id = ?", [status, id], (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
});

/* ── GET all sell requests (admin) ── */
app.get("/api/sell", (req, res) => {
  db.query("SELECT * FROM sell_requests ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "DB error" });
    res.json(results);
  });
});

/* ── UPDATE sell request status ── */
app.patch("/api/sell/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ['new', 'reviewed', 'closed'];
  if (!allowed.includes(status))
    return res.status(400).json({ success: false, message: "Invalid status" });

  db.query("UPDATE sell_requests SET status = ? WHERE id = ?", [status, id], (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
});

app.get("/test", (req, res) => res.send("Backend is running"));

// ✅ Error handler LAST
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ success: false, message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));