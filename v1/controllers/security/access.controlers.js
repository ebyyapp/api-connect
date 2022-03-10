const { checkAccess } = require("../../configs/rules/access.rules");
const { ObjectOf } = require("../../../propstypes");
const _access = require("../../functions/security/access.functions");

exports.checkToken = async (req, res) => {
  try {
    const result = ObjectOf(req.body, checkAccess);
    if (!result.correct) {
      return res.status(result?.status || 500).json(result || {});
    }
    const check = await _access.checkAccessToken(req.body);
    res.send(check?.data || {});
  } catch (err) {
    console.log(err);
    res
      .status(err?.status || 500)
      .json(err?.data || { err, error: "Error Server" });
  }
};
