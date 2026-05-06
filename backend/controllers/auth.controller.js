
// const db = require("../config/db");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");


// // REGISTER
// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, role, emp_code } = req.body;

//     const hashedPassword = bcrypt.hashSync(password, 10);

//     const sql = `
//       INSERT INTO users (name, email, password, role, emp_code)
//       VALUES (?, ?, ?, ?, ?)
//     `;

//     const [result] = await db.query(sql, [
//       name,
//       email,
//       hashedPassword,
//       role || "employee",
//       emp_code || null
//     ]);

//     res.json({
//       message: "User registered successfully",
//       id: result.insertId
//     });

//   } catch (err) {
//     console.error("Register error:", err);
//     res.status(500).json({ message: "Registration failed" });
//   }
// };



// // LOGIN
// exports.login = async (req, res) => {
//   try {

//     const { email, password } = req.body;

//     const [rows] = await db.query(
//       "SELECT * FROM users WHERE email = ?",
//       [email]
//     );

//     if (!rows || rows.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const user = rows[0];

//     const isMatch = bcrypt.compareSync(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid password" });
//     }

//     const token = jwt.sign(
//       {
//         id: user.id,
//         role: user.role,
//         emp_code: user.emp_code
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         emp_code: user.emp_code
//       }
//     });

//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: "Login failed" });
//   }
// };
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "attendance-monitoring-local-secret";


// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, emp_code } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    const sql = `
      INSERT INTO users (name, email, password, role, emp_code)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      name,
      email,
      hashedPassword,
      role || "employee",
      emp_code || null
    ]);

    res.json({
      message: "User registered successfully",
      id: result.insertId
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

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        emp_code: user.emp_code
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emp_code: user.emp_code
      }
    });

  } catch (err) {
    console.error("Login error:", err);

    if (
      err.code === "ECONNREFUSED" ||
      err.code === "ER_ACCESS_DENIED_ERROR" ||
      err.code === "ER_BAD_DB_ERROR"
    ) {
      return res.status(503).json({
        message: "Database connection failed. Start XAMPP MySQL and check database settings."
      });
    }

    res.status(500).json({ message: err.message || "Login failed" });
  }
};



// ================= CHANGE PASSWORD =================
exports.changePassword = async (req, res) => {
  try {

    const { userId, password } = req.body;

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
    console.error("Password update error:", err);
    res.status(500).json({ message: "Password update failed" });
  }
};
