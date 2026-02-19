// const router = require("express").Router();
// const controller = require("../controllers/section.controller");
// const auth = require("../middleware/auth.middleware");

// router.get("/", auth, controller.getAll);
// router.post("/", auth, controller.create);

// module.exports = router;
const router = require("express").Router();
const controller = require("../controllers/section.controller");
const auth = require("../middleware/auth.middleware");

router.get("/", auth, controller.getAll);
router.post("/", auth, controller.create);

module.exports = router;


