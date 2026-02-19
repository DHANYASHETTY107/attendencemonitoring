// const db = require("../config/db");

// exports.getAll = (req, res) => {
//   const query = `
//     SELECT sections.*, departments.name AS department
//     FROM sections
//     JOIN departments ON sections.department_id = departments.id
//   `;

//   db.query(query, (err, data) => {
//     if (err) return res.status(500).json(err);
//     res.json(data);
//   });
// };

// exports.create = (req, res) => {
//   const { name, department_id, description } = req.body;

//   db.query(
//     "INSERT INTO sections (name, department_id, description) VALUES (?,?,?)",
//     [name, department_id, description],
//     (err) => {
//       if (err) return res.status(500).json(err);
//       res.json({ message: "Section added successfully" });
//     }
//   );
// };
const db = require("../config/db");

exports.getAll = (req, res) => {
  const query = `
    SELECT 
      sections.id,
      sections.name,
      sections.description,
      departments.name AS department
    FROM sections
    JOIN departments ON sections.department_id = departments.id
  `;

  db.query(query, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch sections" });
    }
    res.json(data);
  });
};

exports.create = (req, res) => {
  const { name, department_id, description } = req.body;

  if (!name || !department_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql =
    "INSERT INTO sections (name, department_id, description) VALUES (?,?,?)";

  db.query(sql, [name, department_id, description], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to add section" });
    }

    res.json({
      id: result.insertId,
      name,
      department_id,
      description
    });
  });
};
