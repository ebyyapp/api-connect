const axios = require("axios");
const configs = require("../../configs/general.config");
const apiMain = configs.apis.main;
const _access = require("../../functions/security/access.functions");

exports.accessAPI = async (req, res, next) => {
  const autorization = req.headers.authorization?.split(" ");
  const token = autorization?.[1] || req.query?.authorization;
  if (!token) {
    return res
      .status(401)
      .json({ err: { autorization: "Is required" }, error: "Not authorized" });
  }
  try {
    const response = await axios({
      method: "POST",
      url: `${apiMain.url}/${apiMain.fixe}/access/check/access`,
      data: {
        token,
      },
    });
    const environement = response.data.environement;
    req.environement = environement;
    next();
  } catch (err) {
    console.log(err);
    res
      .status(err?.response?.status || err?.status || 500)
      .json(err?.response?.data || err?.data || { err, error: "Error Server" });
  }
};

exports.accessUser = (code) => {
  return async (req, res, next) => {
    try {
      const token = req.headers["x-access-token"];
      const user = await _access.checkAccessToken({
        token,
        code,
        endpoint: "connect",
      });
      req.user = user?.data || {};
      next();
    } catch (err) {
      console.log(err);
      res
        .status(err?.response?.status || err?.status || 500)
        .json(
          err?.response?.data || err?.data || { err, error: "Error Server" }
        );
    }
  };
};
