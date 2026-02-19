const db = require("../config/db");

exports.checkIn = (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().slice(0, 10);

  db.query(
    "INSERT INTO attendance (user_id, date, in_time, status) VALUES (?, ?, CURTIME(), 'Present')",
    [userId, today],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Checked in" });
    }
  );
};

exports.checkOut = (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().slice(0, 10);

  db.query(
    "UPDATE attendance SET out_time=CURTIME() WHERE user_id=? AND date=?",
    [userId, today],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Checked out" });
    }
  );
};

exports.getByUser = (req, res) => {
  const { userId } = req.params;

  db.query(
    "SELECT * FROM attendance WHERE user_id=?",
    [userId],
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data);
    }
  );
};
