
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
router.get("/employee/:empId", auth, async (req, res) => {
  try {
    const { empId } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        DATE(date) AS date,
        MIN(in_time) AS in_time,
        MAX(out_time) AS out_time,
        SUM(total_work_minutes) AS total_minutes
      FROM attendance
      WHERE employee_id = ?
      GROUP BY DATE(date)
      ORDER BY DATE(date) ASC
      `,
      [empId]
    );

    const result = rows.map((r) => {
      const total = Number(r.total_minutes || 0);

      return {
        date: r.date,                // YYYY-MM-DD
        in_time: r.in_time || null,  // may be null
        out_time: r.out_time || null,
        hours: Math.floor(total / 60),
        minutes: total % 60,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Fetch attendance error:", err);
    res.status(500).json({ error: "Failed to fetch attendance" });
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
