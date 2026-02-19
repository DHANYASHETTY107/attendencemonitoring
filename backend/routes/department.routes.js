
const router = require("express").Router();
const controller = require("../controllers/department.controller");
const auth = require("../middleware/auth.middleware");

router.get("/", auth, controller.getAll);
router.post("/", auth, controller.create);

module.exports = router;



