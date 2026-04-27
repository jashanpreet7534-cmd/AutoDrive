const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
    console.log("SELL BODY:", req.body);

    const {
        owner_name,
        phone,
        email,
        car_name,
        year,
        km_driven,
        expected_price,
        description
    } = req.body;

    const sql = `INSERT INTO sell_requests
        (owner_name, phone, email, car_name, year, km_driven, expected_price, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
        sql,
        [
            owner_name || null,
            phone || null,
            email || null,
            car_name || null,
            year || null,
            km_driven || null,
            expected_price || null,
            description || null
        ],
        (err, result) => {
            if (err) {
                console.log("SELL INSERT ERROR:", err);
                return res.status(500).json({
                    message: "Database insert failed",
                    error: err.message
                });
            }

            res.status(200).json({
                message: "Sell request saved successfully"
            });
        }
    );
});

module.exports = router;