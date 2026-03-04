
const express = require("express");
const router = express.Router();
const multer = require("multer");
const XLSX = require("xlsx");
const auth = require("../middleware/auth.middleware");
const db = require("../config/db");

// =======================
// MULTER CONFIG
// =======================
const upload = multer({ dest: "uploads/" });

/*
=======================================================
GET ATTENDANCE BY EMPLOYEE (DASHBOARD)
✔ Works even if out_time is NULL
✔ Uses total_work_minutes (most reliable)
✔ No fake 12h, no frontend math
=======================================================
*/
// =====================================
// GET SINGLE DAY ATTENDANCE (DAY PAGE)
// =====================================
// =====================================
// GET SINGLE DAY ATTENDANCE (USING USER ID)
// =====================================
// =====================================
// DASHBOARD ATTENDANCE (EMPLOYEE BASED)
// =====================================
router.get("/employee/:employeeId", auth, async (req, res) => {
  try {
    const { employeeId } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        DATE(date) AS date,
        in_time,
        out_time,
        total_work_minutes,
        idle_minutes
      FROM attendance
      WHERE employee_id = ?
      ORDER BY date
      `,
      [employeeId]
    );

    const result = rows.map((r) => ({
      date: r.date,
      in_time: r.in_time,
      out_time: r.out_time,

      hours: Math.floor((r.total_work_minutes || 0) / 60),
      minutes: (r.total_work_minutes || 0) % 60,

      idle_hours: Math.floor((r.idle_minutes || 0) / 60),
      idle_minutes: (r.idle_minutes || 0) % 60,
    }));

    res.json(result);
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ error: "Dashboard fetch failed" });
  }
});
// ===============================
// DAY PAGE (USER → EMPLOYEE)
// ===============================
router.get("/user/:userId/day/:date", auth, async (req, res) => {
  try {
    const { userId, date } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        date,
        in_time,
        out_time,
        total_work_minutes,
        idle_minutes
      FROM attendance
      WHERE employee_id = ?
        AND DATE(date) = ?
      `,
      [userId, date]
    );

    if (rows.length === 0) {
      return res.json(null);
    }

    const r = rows[0];

    res.json({
      date: r.date,
      in_time: r.in_time,
      out_time: r.out_time,
      work_minutes: r.total_work_minutes || 0,
      idle_minutes: r.idle_minutes || 0,
    });

  } catch (err) {
    console.error("Day fetch error:", err);
    res.status(500).json({ error: "Failed to fetch day attendance" });
  }
});
// =======================================
// GET MONTH ATTENDANCE FOR CALENDAR
// =======================================
router.get("/user/:userId/month/:year/:month", auth, async (req, res) => {
  try {
    const { userId, year, month } = req.params;

    // STEP 1: Find employee_id from employees table
    const [empRows] = await db.query(
      "SELECT id FROM employees WHERE id = ?",
      [userId]
    );

    if (empRows.length === 0) {
      return res.json([]);
    }

    const employeeId = empRows[0].id;

    // STEP 2: Fetch attendance
    const [rows] = await db.query(
      `
      SELECT DATE(date) as date, total_work_minutes
      FROM attendance
      WHERE employee_id = ?
        AND YEAR(date) = ?
        AND MONTH(date) = ?
      `,
      [employeeId, year, month]
    );

    res.json(rows);

  } catch (err) {
    console.error("Month calendar fetch error:", err);
    res.status(500).json({ error: "Failed to fetch month attendance" });
  }
});
router.get("/report/:userId", auth, async (req, res) => {
  try {

    const { userId } = req.params;

    const today = new Date();
    const year = 2025;
const month = 12;

const [rows] = await db.query(
  `
  SELECT 
    DATE(date) AS full_date,
    total_work_minutes
  FROM attendance
  WHERE employee_id = ?
  AND YEAR(date) = ?
  AND MONTH(date) = ?
  ORDER BY date ASC
  `,
  [userId, year, month]
);

    const daysInMonth = new Date(year, month, 0).getDate();

    const formatted = [];

    for (let i = 1; i <= daysInMonth; i++) {

      const currentDate = new Date(year, month - 1, i);
      const dayStr = i.toString().padStart(2, "0");

      const found = rows.find(
        (r) => new Date(r.full_date).getDate() === i
      );

      if (currentDate.getDay() === 0) {
        formatted.push({
          day: dayStr,
          hours: 0,
          display: "Sunday",
        });
        continue;
      }

      if (found) {

        const totalMinutes = found.total_work_minutes || 0;
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;

        formatted.push({
          day: dayStr,
          hours: totalMinutes / 60,
          display: `${h}h ${m}m`,
        });

      } else {

        formatted.push({
          day: dayStr,
          hours: 0,
          display: "Absent",
        });

      }

    }

    res.json(formatted);

  } catch (err) {
    console.error("Report fetch error:", err);
    res.status(500).json({ error: "Report fetch failed" });

  }
});
/*
=======================================================
EXCEL UPLOAD
✔ Calculates total_work_minutes ONCE
✔ No duplicates
✔ Safe re-upload
=======================================================
*/
router.post(
  "/upload-excel",
  auth,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const workbook = XLSX.readFile(req.file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const toMinutes = (time) => {
        if (!time) return null;
        const [h, m] = time.toString().split(":").map(Number);
        return h * 60 + m;
      };

      for (const row of rows) {
        const { EmpID, Name, Date, Login1, Logout1, Login2, Logout2 } = row;
        if (!EmpID || !Date) continue;

        // ================= FIND / CREATE EMPLOYEE =================
        const [empRows] = await db.query(
          "SELECT id FROM employees WHERE emp_code = ?",
          [EmpID]
        );

        let employeeId;
        if (empRows.length === 0) {
          const [result] = await db.query(
            "INSERT INTO employees (emp_code, name) VALUES (?, ?)",
            [EmpID, Name || "Unknown"]
          );
          employeeId = result.insertId;
        } else {
          employeeId = empRows[0].id;
        }

        // ================= CALCULATE WORK =================
        let workMinutes = 0;
        let idleMinutes = 0;

        const l1 = toMinutes(Login1);
        const o1 = toMinutes(Logout1);
        const l2 = toMinutes(Login2);
        const o2 = toMinutes(Logout2);

        if (l1 !== null && o1 !== null) {
          workMinutes += o1 - l1;
        }

        if (l2 !== null && o2 !== null) {
          workMinutes += o2 - l2;
          if (o1 !== null) {
            idleMinutes = l2 - o1;
          }
        }

        if (workMinutes < 0) workMinutes = 0;

        const status = workMinutes > 0 ? "Present" : "Absent";

        // ================= UPSERT ATTENDANCE =================
        const [existing] = await db.query(
          "SELECT id FROM attendance WHERE employee_id = ? AND date = ?",
          [employeeId, Date]
        );

        if (existing.length > 0) {
          await db.query(
            `
            UPDATE attendance
            SET in_time = ?, out_time = ?, total_work_minutes = ?, idle_minutes = ?, status = ?
            WHERE employee_id = ? AND date = ?
            `,
            [
              Login1 || null,
              Logout2 || Logout1 || null,
              workMinutes,
              idleMinutes,
              status,
              employeeId,
              Date,
            ]
          );
        } else {
          await db.query(
            `
            INSERT INTO attendance
            (employee_id, date, in_time, out_time, total_work_minutes, idle_minutes, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
              employeeId,
              Date,
              Login1 || null,
              Logout2 || Logout1 || null,
              workMinutes,
              idleMinutes,
              status,
            ]
          );
        }
      }

      res.json({ message: "Excel processed successfully" });
    } catch (err) {
      console.error("Excel upload error:", err);
      res.status(500).json({ error: "Excel upload failed" });
    }
  }
);

module.exports = router;

