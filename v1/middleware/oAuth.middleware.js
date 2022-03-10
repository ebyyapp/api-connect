const db = require("../models");

exports.oAuthLoginPartner = (req, res, next) => {
  const { app } = req;
  const { oAuthToken } = req.body;
  if (app.type === "partner") {
    if (oAuthToken) {
      next();
    } else {
      res.status(400).json({
        err: { item: "oAuthToken", value: "le champs shop est obligatoire" },
        error: "Bad request",
      });
    }
  } else {
    next();
  }
};
