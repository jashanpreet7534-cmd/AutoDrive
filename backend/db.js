const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "autodrive"
});

db.connect(err => {
    if(err){
        console.log("Database connection failed");
    }else{
        console.log("MySQL Connected");
    }
});

module.exports = db;