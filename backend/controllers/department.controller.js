const db = require("../config/db");

exports.getAll = (req, res) => {
  db.query("SELECT * FROM departments", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch departments" });
    }
    res.json(data);
  });
};

exports.create = (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Department name is required" });
  }

  const sql =
    "INSERT INTO departments (name, description) VALUES (?, ?)";

  db.query(sql, [name, description], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to add department" });
    }

    res.json({
      id: result.insertId,
      name,
      description
    });
  });
};
