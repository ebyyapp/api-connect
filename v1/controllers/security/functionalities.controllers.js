const {
  newFunc,
  _setGroupRoles,
} = require("../../configs/rules/functionality.rules");
const { ObjectOf } = require("../../../propstypes");
const { Op } = require("sequelize");

exports.create = async (req, res) => {
  try {
    const { db } = req;
    const result = ObjectOf(req.body, newFunc);
    if (!result.correct) {
      return res.status(result?.status || 500).json(result || {});
    }
    const { groupRoles } = req.body;
    const roles = groupRoles || [];

    const [func, created] = await db.functionality.findOrCreate({
      where: { code: req.body.code, endpoint: req.body.endpoint },
      defaults: req.body,
    });
    const findGroups = await db.groupRole.findAll({
      where: { [Op.or]: [{ id: roles }, { name: roles }] },
    });
    await func.addGroupRoles(findGroups);
    const newFuncResult = await db.functionality.findOne({
      where: { id: func.id },
      include: db.groupRole,
    });
    res.send(newFuncResult);
  } catch (err) {
    console.log(err);
    res
      .status(err?.status || 500)
      .json(err?.data || { err, error: "Error Server" });
  }
};

exports.setGroupRoles = async (req, res) => {
  try {
    const { db } = req;
    const result = ObjectOf(req.body, _setGroupRoles);
    if (!result.correct) {
      return res.status(result?.status || 500).json(result || {});
    }
    const { groupRoles, action } = req.body;
    const { id } = req.params;
    const roles = groupRoles || [];
    const func = await db.functionality.findOne({
      where: { id },
    });
    const findGroups = await db.groupRole.findAll({
      where: { [Op.or]: [{ id: roles }, { name: roles }] },
    });

    switch (action) {
      case "add":
        await func.addGroupRoles(findGroups);
        break;
      case "set":
        await func.setGroupRoles(findGroups);
        break;
      case "delete":
        await func.removeGroupRoles(findGroups);
        break;
      default:
        break;
    }

    const newFuncResult = await db.functionality.findOne({
      where: { id: func.id },
      include: db.groupRole,
    });
    res.send(newFuncResult);
  } catch (err) {
    console.log(err);
    res
      .status(err?.status || 500)
      .json(err?.data || { err, error: "Error Server" });
  }
};
