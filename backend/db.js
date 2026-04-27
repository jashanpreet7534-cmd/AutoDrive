const mysql = require("mysql2");

const db = mysql.createPool({
  host:     process.env.DB_HOST || "localhost",
  user:     process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "autodrive",
  port:     process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

// Test connection on startup
db.query("SELECT 1", (err) => {
  if (err) console.error("❌ DB Connection Failed:", err.message);
  else console.log("✅ MySQL Connected");
});

module.exports = db;