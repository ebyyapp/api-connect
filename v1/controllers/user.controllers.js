const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const configs = require("../configs/secret.config");
const jwtKey = configs.jwtKey;
const { Op } = require("sequelize");
const randomstring = require("randomstring");

/* exports.newUser = (req, res) => {
  const { email, password, shop } = req.body;
  db.user
    .findOne({
      where: {
        email,
      },
    })
    .then(async (count) => {
      if (!count) {
        if (password) {
          const hash = await bcrypt.hash(password, 10);
          Object.assign(req.body, { password: hash });
        }
        db.user
          .create(req.body)
          .then(async (new_user) => {
            //Send email
            if (shop) {
              Object.assign(shop, { userId: new_user.id });
              db.shop
                .create(shop)
                .then(async (new_shop) => {
                  const finaly = await db.user.findOne({
                    where: { id: new_user.id },
                    include: [{ model: db.shop }],
                  });
                  res.send(finaly);
                })
                .catch((err) => {
                  res
                    .status(500)
                    .json({ err, error: "Erreur lors du user.create" });
                });
            } else {
              const finaly = await db.user.findOne({
                where: { id: new_user.id },
                include: [{ model: db.shop }],
              });
              res.send(finaly);
            }
          })
          .catch((err) => {
            res.status(500).json({ err, error: "Erreur lors du user.create" });
          });
      } else {
        if (shop) {
          db.shop
            .count({ where: { shopId: shop.shopId, userId: count.id } })
            .then((count_shop) => {
              if (!count_shop) {
                Object.assign(shop, { userId: count.id });
                db.shop
                  .create(shop)
                  .then(async (new_shop) => {
                    const finaly = await db.user.findOne({
                      where: { id: count.id },
                      include: [{ model: db.shop }],
                    });
                    res.send(finaly);
                  })
                  .catch((err) => {
                    console.log(err);
                    res
                      .status(500)
                      .json({ err, error: "Erreur lors du shop.create" });
                  });
              } else {
                res.status(409).json({
                  err: { item: "email", value: email },
                  error: "Item déjà existant",
                });
              }
            })
            .catch((err) => {
              res.status(500).json({ err, error: "Erreur lors du shop.count" });
            });
        } else {
          res.status(409).json({
            err: { item: "email", value: email },
            error: "Item déjà existant",
          });
        }
      }
    })
    .catch((err) => {
      res.status(500).json({ err, error: "Erreur lors du user.findOne" });
    });
}; */

const renderFunctionalities = (groups) => {
  const array = [];
  groups.forEach((group) => {
    group.functionalities.forEach((func) => {
      array.push({ code: func.code, endpoint: func.endpoint });
    });
  });
  return array;
};

exports.create = async (req, res) => {
  try {
    const { db } = req;
    const { type } = req.app;

    res.send(req.user);
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, res, next) => {
  const { db, environement } = req;
  const { email, password, device } = req.body;
  const { id } = req.app;
  try {
    const user = await db.user.findOne({
      where: {
        email,
        status: "activated",
      },
      include: db.shop,
    });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(403).json({
        err: {},
        error: "Password incorrect",
      });
    }
    const expireIn = 24;
    const authToken = jwt.sign(
      {
        id: user.id,
        type: "access",
        appId: id,
        environement,
      },
      jwtKey,
      { expiresIn: `${expireIn}h` }
    );

    const refrechToken = jwt.sign(
      {
        id: user.id,
        type: "access",
        appId: id,
        environement,
      },
      jwtKey,
      { expiresIn: `${expireIn * 2}h` }
    );
    const body = Object.assign(device, {
      sessionId: device.sessionId || `ses_${randomstring.generate(15)}`,
      authToken,
      refrechToken,
      authStatus: "success",
      userId: user.id,
      appId: id,
    });
    db.auth
      .create(body)
      .then(async (new_auth) => {
        await db.auth.update(
          { authStatus: "killed" },
          {
            where: {
              sessionId: new_auth.sessionId,
              id: { [Op.ne]: new_auth.id },
            },
          }
        );
        const result = await db.auth.findOne({
          where: { id: new_auth.id },
          include: [
            {
              model: db.user,
              include: [{ model: db.shop }],
            },
            {
              model: db.app,
            },
          ],
        });
        res.send(result);
      })
      .catch((err) => {
        res.status(500).json({ err, error: "Erreur lors du auth.create" });
      });
  } catch (err) {
    console.log(err);
    res
      .status(err?.status || 500)
      .json(err?.data || { err, error: "Error Server" });
  }
};

/* exports.getUsers = async (req, res) => {
  const { userIds } = req.body;
  try {
    const users = await db.user.findAll({ where: { id: userIds } });
    res.send(users);
  } catch (err) {
    console.log(err);
    res
      .status(err?.status || 500)
      .json(err?.data || { err, error: "Error Server" });
  }
}; */
