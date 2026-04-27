const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");


// 🔐 REGISTER
router.post("/register", async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
        return res.json({ success: false, message: "All fields required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, phone, hashedPassword], (err) => {
        if (err) {
            return res.json({ success: false, message: "Email already exists" });
        }
        res.json({ success: true, message: "Registered successfully" });
    });
});


// 🔑 LOGIN
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, result) => {
        if (err || result.length === 0) {
            return res.json({ success: false, message: "User not found" });
        }

        const user = result[0];

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.json({ success: false, message: "Wrong password" });
        }

        res.json({ success: true, message: "Login successful", user });
    });
});

module.exports = router;