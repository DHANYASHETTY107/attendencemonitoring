// // const db = require("../config/db");

// // exports.checkIn = async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     const today = new Date().toISOString().slice(0, 10);

// //     await db.query(
// //       "INSERT INTO attendance (user_id, date, in_time, status) VALUES (?, ?, CURTIME(), 'Present')",
// //       [userId, today]
// //     );

// //     res.json({ message: "Checked in" });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Check-in failed" });
// //   }
// // };

// // exports.checkOut = async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     const today = new Date().toISOString().slice(0, 10);

// //     await db.query("UPDATE attendance SET out_time=CURTIME() WHERE user_id=? AND date=?", [userId, today]);

// //     res.json({ message: "Checked out" });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Check-out failed" });
// //   }
// // };

// // exports.getByUser = async (req, res) => {
// //   try {
// //     const { userId } = req.params;
// //     const [rows] = await db.query("SELECT * FROM attendance WHERE user_id=?", [userId]);
// //     res.json(rows);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Failed to fetch attendance" });
// //   }
// // };
// const db = require("../config/db");

// /**
//  * CHECK-IN
//  * Uses logged-in user → maps to employee → inserts attendance
//  */
// exports.checkIn = async (req, res) => {
//   try {
//     const userId = req.user.id; // from JWT
//     const today = new Date().toISOString().slice(0, 10);

//     // 🔹 Find employee using emp_code
//     const [[employee]] = await db.query(
//       "SELECT id FROM employees WHERE emp_code = ?",
//       [userId] // assuming users.id == emp_code
//     );

//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     // 🔹 Prevent double check-in
//     const [[existing]] = await db.query(
//       "SELECT id FROM attendance WHERE employee_id = ? AND date = ?",
//       [employee.id, today]
//     );

//     if (existing) {
//       return res.status(400).json({ message: "Already checked in today" });
//     }

//     // 🔹 Insert attendance
//     await db.query(
//       `INSERT INTO attendance (employee_id, date, in_time, status)
//        VALUES (?, ?, CURTIME(), 'Present')`,
//       [employee.id, today]
//     );

//     res.json({ message: "Checked in successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Check-in failed" });
//   }
// };

// /**
//  * CHECK-OUT
//  * Updates out_time for today
//  */
// exports.checkOut = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const today = new Date().toISOString().slice(0, 10);

//     const [[employee]] = await db.query(
//       "SELECT id FROM employees WHERE emp_code = ?",
//       [userId]
//     );

//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     await db.query(
//       `UPDATE attendance
//        SET out_time = CURTIME()
//        WHERE employee_id = ? AND date = ?`,
//       [employee.id, today]
//     );

//     res.json({ message: "Checked out successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Check-out failed" });
//   }
// };

// /**
//  * GET ATTENDANCE BY EMPLOYEE (Dashboard)
//  */
// exports.getByEmployee = async (req, res) => {
//   try {
//     const { id } = req.params; // employees.id

//     const [rows] = await db.query(
//       `SELECT *
//        FROM attendance
//        WHERE employee_id = ?
//        ORDER BY date ASC`,
//       [id]
//     );

//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch attendance" });
//   }
// };
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check if user already exists
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email=?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const sql =
      "INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)";

    const [result] = await db.query(sql, [
      name,
      email,
      hashedPassword,
      role || "employee",
    ]);

    res.json({
      message: "User registered successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};