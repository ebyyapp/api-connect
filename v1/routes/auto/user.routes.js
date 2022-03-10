const express = require("express");
const router = express.Router();

const Ctrl = require("../../controllers/user.controllers");
const security = require("../../middleware/security/security.middlewares");
const _database = require("../../middleware/db.switch");
const _app = require("../../middleware/app.middleware");

router.post(
  "/user/new",
  security.accessAPI,
  _database.switch,
  security.accessUser("connect.user.connect"),
  _app.getApp,
  Ctrl.create
);
router.post(
  "/user/login",
  security.accessAPI,
  _database.switch,
  _app.getApp,
  Ctrl.login
);

module.exports = router;
