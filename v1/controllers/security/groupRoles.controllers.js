const {
  newGroupRoles,
  _setFunctionalities,
} = require("../../configs/rules/groupRole.rules");
const { ObjectOf } = require("../../../propstypes");

exports.create = async (req, res) => {
  try {
    const { db } = req;
    const result = ObjectOf(req.body, newGroupRoles);
    if (!result.correct) {
      return res.status(result?.status || 500).json(result || {});
    }
    const { functionalities } = req.body;
    const funcs = functionalities || [];
    const group = await db.groupRole.create(req.body);
    const findFuncs = await db.functionality.findAll({
      where: { id: funcs },
    });
    await group.addFunctionalities(findFuncs);
    const newGroupResult = await db.groupRole.findOne({
      where: { id: group.id },
      include: db.functionality,
    });
    res.send(newGroupResult);
  } catch (err) {
    console.log(err);
    res
      .status(err?.status || 500)
      .json(err?.data || { err, error: "Error Server" });
  }
};

exports.setFunctionalities = async (req, res) => {
  try {
    const { db } = req;
    const result = ObjectOf(req.body, _setFunctionalities);
    if (!result.correct) {
      return res.status(result?.status || 500).json(result || {});
    }
    const { functionalities, action } = req.body;
    const { id } = req.params;
    const funcs = functionalities || [];
    const group = await db.groupRole.findOne({ where: { id } });
    const findFuncs = await db.functionality.findAll({
      where: { id: funcs },
    });

    switch (action) {
      case "add":
        await group.addFunctionalities(findFuncs);
        break;
      case "set":
        await group.setFunctionalities(findFuncs);
        break;
      case "delete":
        await group.removeFunctionalities(findFuncs);
        break;
      default:
        break;
    }

    const newGroupResult = await db.groupRole.findOne({
      where: { id: group.id },
      include: db.functionality,
    });
    res.send(newGroupResult);
  } catch (err) {
    console.log(err);
    res
      .status(err?.status || 500)
      .json(err?.data || { err, error: "Error Server" });
  }
};
