exports.getApp = (req, res, next) => {
  const { db } = req;
  const { keyApp } = req.body;
  if (keyApp) {
    db.app
      .findOne({ where: { secretKey: keyApp, status: "activated" } })
      .then((app) => {
        if (app) {
          req.app = app;
          next();
        } else {
          res.status(401).json({
            err: { item: "keyApp", value: "le champs keyApp est incorrect" },
            error: "Not authorized",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({ err, error: "Erreur lors du app.findOne" });
      });
  } else {
    res.status(401).json({
      err: { item: "keyApp", value: "le champs keyApp est obligatoire" },
      error: "Not authorized",
    });
  }
};
