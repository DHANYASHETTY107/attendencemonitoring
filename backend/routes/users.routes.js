// const express = require("express");
// const router = express.Router();
// const db = require("../config/db"); // adjust if your db path is different

// // ✅ Get single user by ID
// router.get("/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const [rows] = await db.query(
//       "SELECT id, name FROM users WHERE id = ?",
//       [id]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs"); // added for password hashing


// ✅ Get single user by ID (OLD CODE — unchanged)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT id, name FROM users WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ NEW: Change Password
router.post("/change-password", async (req, res) => {
  const { userId, password } = req.body;

  try {

    if (!userId || !password) {
      return res.status(400).json({ message: "Missing data" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, userId]
    );

    res.json({
      message: "Password updated successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Password update failed" });
  }
});


module.exports = router;