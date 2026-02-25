// const db = require("../config/db");

// exports.checkIn = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const today = new Date().toISOString().slice(0, 10);

//     await db.query(
//       "INSERT INTO attendance (user_id, date, in_time, status) VALUES (?, ?, CURTIME(), 'Present')",
//       [userId, today]
//     );

//     res.json({ message: "Checked in" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Check-in failed" });
//   }
// };

// exports.checkOut = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const today = new Date().toISOString().slice(0, 10);

//     await db.query("UPDATE attendance SET out_time=CURTIME() WHERE user_id=? AND date=?", [userId, today]);

//     res.json({ message: "Checked out" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Check-out failed" });
//   }
// };

// exports.getByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const [rows] = await db.query("SELECT * FROM attendance WHERE user_id=?", [userId]);
//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch attendance" });
//   }
// };
const db = require("../config/db");

/**
 * CHECK-IN
 * Uses logged-in user → maps to employee → inserts attendance
 */
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT
    const today = new Date().toISOString().slice(0, 10);

    // 🔹 Find employee using emp_code
    const [[employee]] = await db.query(
      "SELECT id FROM employees WHERE emp_code = ?",
      [userId] // assuming users.id == emp_code
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // 🔹 Prevent double check-in
    const [[existing]] = await db.query(
      "SELECT id FROM attendance WHERE employee_id = ? AND date = ?",
      [employee.id, today]
    );

    if (existing) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    // 🔹 Insert attendance
    await db.query(
      `INSERT INTO attendance (employee_id, date, in_time, status)
       VALUES (?, ?, CURTIME(), 'Present')`,
      [employee.id, today]
    );

    res.json({ message: "Checked in successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Check-in failed" });
  }
};

/**
 * CHECK-OUT
 * Updates out_time for today
 */
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().slice(0, 10);

    const [[employee]] = await db.query(
      "SELECT id FROM employees WHERE emp_code = ?",
      [userId]
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await db.query(
      `UPDATE attendance
       SET out_time = CURTIME()
       WHERE employee_id = ? AND date = ?`,
      [employee.id, today]
    );

    res.json({ message: "Checked out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Check-out failed" });
  }
};

/**
 * GET ATTENDANCE BY EMPLOYEE (Dashboard)
 */
exports.getByEmployee = async (req, res) => {
  try {
    const { id } = req.params; // employees.id

    const [rows] = await db.query(
      `SELECT *
       FROM attendance
       WHERE employee_id = ?
       ORDER BY date ASC`,
      [id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
};