// const db = require("../config/db");

// exports.getAll = async (req, res) => {
//   try {
//     const [rows] = await db.promise().query("SELECT * FROM departments");
//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch departments" });
//   }
// };

// exports.create = async (req, res) => {
//   const { name, description } = req.body;

//   if (!name) {
//     return res.status(400).json({ message: "Department name is required" });
//   }

//   const sql = "INSERT INTO departments (name, description) VALUES (?, ?)";

//   try {
//     const [result] = await db.promise().query(sql, [name, description]);
//     res.json({ id: result.insertId, name, description });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to add department" });
//   }
// };
const db = require("../config/db");

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, description FROM departments"
    );
    res.json(rows);
  } catch (err) {
    console.error("DEPARTMENT ERROR:", err);
    res.status(500).json({ message: "Failed to fetch departments" });
  }
};

exports.create = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Department name is required" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO departments (name, description) VALUES (?, ?)",
      [name, description]
    );

    res.json({
      id: result.insertId,
      name,
      description
    });
  } catch (err) {
    console.error("CREATE DEPARTMENT ERROR:", err);
    res.status(500).json({ message: "Failed to add department" });
  }
};