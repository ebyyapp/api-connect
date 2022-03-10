const express = require("express");
const router = express.Router();

const Ctrl = require("../../../controllers/security/groupRoles.controllers");
const security = require("../../../middleware/security/security.middlewares");
const _database = require("../../../middleware/db.switch");

router.post(
  "/security/groupRoles/new",
  security.accessAPI,
  _database.switch,
  security.accessUser("connect.groupRoles.create"),
  Ctrl.create
);
router.post(
  "/security/groupRoles/set/:id",
  security.accessAPI,
  _database.switch,
  security.accessUser("connect.groupRoles.set"),
  Ctrl.setFunctionalities
);

module.exports = router;
