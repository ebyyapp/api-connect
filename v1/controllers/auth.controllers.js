const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const configs = require("../configs/secret.config");
const jwtKey = configs.jwtKey;
const { Op } = require("sequelize");

exports.checkAuth = (req, res, next) => {
  const { oAuth } = req.body;
  const { type } = req.app;
  if (oAuth) {
    db.auth
      .findOne({
        where: {
          [Op.or]: [
            {
              sessionId: oAuth,
              authStatus: "success",
            },
            {
              authToken: oAuth,
              authStatus: "success",
            },
          ],
        },
        attributes: [
          "id",
          "type",
          "sessionId",
          "macAdress",
          "ipAdress",
          "authToken",
          "refrechToken",
          "authStatus",
        ],
        include: [
          {
            model: db.user,
            attributes: [
              "id",
              "email",
              "civility",
              "firstName",
              "lastName",
              "phoneNumber",
              "team",
              "cgv",
              "status",
            ],
            include: type === "partner" ? [{ model: db.shop }] : [],
          },
          {
            model: db.app,
          },
        ],
      })
      .then((auth) => {
        if (auth) {
          jwt.verify(auth.authToken, jwtKey, (err, decodedToken) => {
            if (err) {
              jwt.verify(auth.refrechToken, jwtKey, (err, decodedRefresh) => {
                if (err) {
                  db.auth.update(
                    { authStatus: "killed" },
                    { where: { id: auth.id } }
                  );
                  res.status(403).json({ err, error: "Not auth" });
                } else {
                  const new_refrech = jwt.sign(
                    {
                      userId: auth.userId,
                    },
                    jwtKey,
                    { expiresIn: `${48}h` }
                  );
                  if (type === "partner") {
                    if (auth.user?.shops && auth.user.shops.length) {
                      res.send(auth);
                    } else {
                      res
                        .status(401)
                        .json({ err: {}, error: "Not authorized" });
                    }
                  } else if (type === "user") {
                    res.send(auth);
                  } else {
                    res.status(401).json({ err: {}, error: "Not authorized" });
                  }
                }
              });
            } else {
              if (type === "partner") {
                if (auth.user?.shops && auth.user.shops.length) {
                  res.send(auth);
                } else {
                  res.status(401).json({ err: {}, error: "Not authorized" });
                }
              } else if (type === "user") {
                res.send(auth);
              } else {
                res.status(401).json({ err: {}, error: "Not authorized" });
              }
            }
          });
        } else {
          res.status(403).json({ err: {}, error: "Not auth" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ err, error: "Erreur lors du auth.findOne" });
      });
  } else {
    res.status(400).json({
      err: {
        item: "Attributs manquants",
        value: "Définissez un oAuth",
      },
      error: "Bad request",
    });
  }
};
