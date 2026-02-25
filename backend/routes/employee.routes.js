// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth.middleware");
// const db = require("../config/db");

// router.get("/", auth, async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       "SELECT id, emp_code, name FROM employees ORDER BY name"
//     );
//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch employees" });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const db = require("../config/db");


// =======================
// GET ALL EMPLOYEES
// =======================
router.get("/", auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, emp_code, name FROM employees ORDER BY name"
    );
    res.json(rows);
  } catch (err) {
    console.error("Fetch employees error:", err);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});


// =======================
// GET EMPLOYEE BY ID  ✅ (THIS FIXES YOUR 404)
// =======================
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT id, emp_code, name FROM employees WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Fetch employee by id error:", err);
    res.status(500).json({ error: "Failed to fetch employee" });
  }
});


module.exports = router;