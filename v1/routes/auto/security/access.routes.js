const express = require("express");
const router = express.Router();

const Ctrl = require("../../../controllers/security/access.controlers");
const security = require("../../../middleware/security/security.middlewares");

router.post("/security/x-access/check", Ctrl.checkToken);

module.exports = router;
