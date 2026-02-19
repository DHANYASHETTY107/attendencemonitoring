// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/department.controller");
// const auth = require("../middleware/auth.middleware");

// router.get("/", auth, controller.getAll);
// router.post("/", auth, controller.create);

// module.exports = router;
const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");

// ❌ NO auth middleware on login/register
router.post("/login", controller.login);
router.post("/register", controller.register);

module.exports = router;

