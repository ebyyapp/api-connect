const express = require("express");
const router = express.Router();

const Ctrl = require("../../controllers/app.controllers");
const security = require("../../middleware/security/security.middlewares");
const _database = require("../../middleware/db.switch");

router.post(
  "/app/new",
  security.accessAPI,
  _database.switch,
  security.accessUser("connect.app.create"),
  Ctrl.newApp
);

module.exports = router;
