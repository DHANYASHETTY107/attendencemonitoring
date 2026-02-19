const router = require("express").Router();
const controller = require("../controllers/attendance.controller");
const auth = require("../middleware/auth.middleware");

router.post("/check-in", auth, controller.checkIn);
router.post("/check-out", auth, controller.checkOut);
router.get("/:userId", auth, controller.getByUser);

module.exports = router;
