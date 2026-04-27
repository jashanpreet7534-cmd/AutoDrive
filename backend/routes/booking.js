const express = require("express");
const router  = express.Router();
const db      = require("../db");

router.post("/", (req, res) => {
  const {
    first_name, last_name, phone, email,
    address1, address2, city, state, zip,
    vehicle_type, booking_date, booking_time, car
  } = req.body;

  if (
    !first_name || !last_name || !phone    || !email ||
    !address1   || !city      || !state    || !zip   ||
    !vehicle_type || !booking_date || !booking_time  || !car
  ) {
    return res.status(400).json({ success: false, message: "Please fill all required fields" });
  }

  const sql = `
    INSERT INTO bookings
    (first_name, last_name, phone, email, address1, address2, city, state, zip, vehicle_type, booking_date, booking_time, car)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    first_name, last_name, phone, email,
    address1, address2 || "",
    city, state, zip,
    vehicle_type, booking_date, booking_time, car
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.error("Booking insert error:", err);
      return res.status(500).json({ success: false, message: "Booking failed" });
    }
    return res.json({ success: true, message: "Booking successful" });
  });
});

module.exports = router;