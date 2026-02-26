const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to SQLite database file
const db = new sqlite3.Database("./news_app.db");

// Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// ADD NEWS
app.post("/api/news", (req, res) => {
  const { title, content, image_url } = req.body;

  db.run(
    "INSERT INTO news (title, content, image_url) VALUES (?, ?, ?)",
    [title, content, image_url],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ message: "News added successfully" });
    }
  );
});

// GET ALL NEWS
app.get("/api/news", (req, res) => {
  db.all("SELECT * FROM news ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});