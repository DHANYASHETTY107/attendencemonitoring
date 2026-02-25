
// const db = require("../config/db");

// exports.getAll = async (req, res) => {
//   const query = `
//     SELECT 
//       sections.id,
//       sections.name,
//       sections.description,
//       departments.name AS department
//     FROM sections
//     JOIN departments ON sections.department_id = departments.id
//   `;

//   try {
//     const [rows] = await db.promise().query(query);
//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch sections" });
//   }
// };

// exports.create = async (req, res) => {
//   const { name, department_id, description } = req.body;

//   if (!name || !department_id) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   const sql = "INSERT INTO sections (name, department_id, description) VALUES (?,?,?)";

//   try {
//     const [result] = await db.promise().query(sql, [name, department_id, description]);
//     res.json({ id: result.insertId, name, department_id, description });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to add section" });
//   }
// };
const db = require("../config/db");

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
         s.id,
         s.name,
         s.description,
         d.name AS department
       FROM sections s
       JOIN departments d ON s.department_id = d.id`
    );

    res.json(rows);
  } catch (err) {
    console.error("SECTION ERROR:", err);
    res.status(500).json({ message: "Failed to fetch sections" });
  }
};

exports.create = async (req, res) => {
  const { name, department_id, description } = req.body;

  if (!name || !department_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO sections (name, department_id, description) VALUES (?, ?, ?)",
      [name, department_id, description]
    );

    res.json({
      id: result.insertId,
      name,
      department_id,
      description
    });
  } catch (err) {
    console.error("CREATE SECTION ERROR:", err);
    res.status(500).json({ message: "Failed to add section" });
  }
};