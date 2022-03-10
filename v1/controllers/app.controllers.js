const { newApp } = require("../configs/rules/app.rules");
const { ObjectOf } = require("../../propstypes");
const randomstring = require("randomstring");

exports.newApp = async (req, res) => {
  try {
    const { db } = req;
    const result = ObjectOf(req.body, newApp);
    if (!result.correct) {
      return res.status(result?.status || 500).json(result || {});
    }
    const secretKey = `sk_${randomstring.generate()}`;
    Object.assign(req.body, { secretKey });

    const newAppResult = await db.app.create(req.body);
    res.send(newAppResult);
  } catch (err) {
    console.log(err);
    res
      .status(err?.status || 500)
      .json(err?.data || { err, error: "Error Server" });
  }
};
