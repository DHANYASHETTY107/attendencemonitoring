const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 5000;

app.get("/test", (req, res) => {
  res.send("Backend working");
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/departments", require("./routes/department.routes"));
app.use("/api/sections", require("./routes/section.routes"));
app.use("/api/attendance", require("./routes/attendance.routes"));
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/employees", require("./routes/employee.routes"));

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
