const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/change-password", auth, async (req, res) => {
  try {
    const requestedUserId = Number(req.body.userId || req.user?.id);
    const password = String(req.body.password || req.body.newPassword || "");

    if (!requestedUserId || !password) {
      return res.status(400).json({ message: "User and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    if (req.user.role !== "admin" && Number(req.user.id) !== requestedUserId) {
      return res.status(403).json({ message: "You can only change your own password" });
    }

    const [users] = await db.query("SELECT id FROM users WHERE id = ?", [
      requestedUserId
    ]);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, requestedUserId]
    );

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: "Password was not updated" });
    }

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({
      message: "Password update failed. Check MySQL and the users table schema."
    });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, role, emp_code FROM users WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Fetch user error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
