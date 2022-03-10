const databases = require("../../models");
const jwt = require("jsonwebtoken");
const secrets = require("../../configs/secret.config");
const jwtKey = secrets.jwtKey;

const { Op } = require("sequelize");

const checkAccessToken = ({ token, code, endpoint }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!token) {
        return reject({
          status: 401,
          data: {
            err: { "x-access-token": "Is required" },
            error: "Not authorized",
          },
        });
      }

      const decoded = jwt.decode(token);
      const type = decoded?.type;
      const environement = decoded?.environement;

      if (!environement) {
        return reject({
          status: 498,
          data: { err: {}, error: "Token malformed" },
        });
      }

      const db = databases[environement];
      let userId;
      switch (type) {
        case "access":
          const auth = await db.auth.findOne({
            where: {
              authToken: token,
              authStatus: "success",
            },
          });
          if (!auth) {
            return reject({
              status: 498,
              data: { err, error: "Token expired" },
            });
          }
          const { authToken, refrechToken } = auth;
          jwt.verify(authToken, jwtKey, async (err, data) => {
            if (!err) {
              userId = data.id;
            } else {
              jwt.verify(refrechToken, jwtKey, async (err, data) => {
                if (!err) {
                  userId = data.id;
                }
              });
            }
          });
          break;
        case "oAuth":
          const oAuth = await db.oAuth.findOne({
            where: {
              authToken: token,
              status: "activated",
            },
          });
          if (!oAuth) {
            return reject({
              status: 498,
              data: { err, error: "Token expired" },
            });
          }
          jwt.verify(oAuth.authToken, jwtKey, async (err, data) => {
            if (!err) {
              userId = data.id;
            }
          });
          break;

        default:
          return reject({
            status: 498,
            data: { err: {}, error: "Token malformed" },
          });
      }
      if (!userId) {
        return reject({
          status: 498,
          data: { err: {}, error: "Token expired" },
        });
      }

      const user = await db.user.findOne({
        where: { id: userId, status: "activated" },
        include: [
          {
            model: db.shop,
          },
          {
            model: db.groupRole,
            through: {
              attributes: [],
            },
            where: { status: "activated" },
            include: [
              {
                model: db.functionality,
                through: {
                  attributes: [],
                },
                where: {
                  [Op.or]: [
                    {
                      [Op.and]: [
                        {
                          code,
                        },
                        {
                          endpoint,
                        },
                        {
                          status: "activated",
                        },
                      ],
                    },
                    {
                      [Op.and]: [
                        {
                          code: "*",
                        },
                        {
                          endpoint,
                        },
                        {
                          status: "activated",
                        },
                      ],
                    },
                    {
                      [Op.and]: [
                        {
                          code: "**",
                        },
                        {
                          status: "activated",
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        ],
      });
      if (user) {
        resolve({
          status: 200,
          data: user,
        });
      } else {
        reject({
          status: 401,
          data: {
            err: { [code]: "you do not have the necessary rights" },
            error: "Not authorized",
          },
        });
      }
    } catch (err) {
      reject({
        status: 500,
        data: { err, error: "Error server" },
      });
    }
  });
};

module.exports = {
  checkAccessToken,
};
