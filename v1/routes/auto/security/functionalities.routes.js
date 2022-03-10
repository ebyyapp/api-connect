const express = require("express");
const router = express.Router();

const Ctrl = require("../../../controllers/security/functionalities.controllers");
const security = require("../../../middleware/security/security.middlewares");
const _database = require("../../../middleware/db.switch");

router.post(
  "/security/functionality/new",
  security.accessAPI,
  _database.switch,
  security.accessUser("connect.functionality.create"),
  Ctrl.create
);
router.post(
  "/security/functionality/set/:id",
  security.accessAPI,
  _database.switch,
  security.accessUser("connect.functionality.set"),
  Ctrl.setGroupRoles
);

module.exports = router;
