const { PropTypes } = require("../../../propstypes");

module.exports = {
  newGroupRoles: {
    name: PropTypes().isRequired().isString(),
  },
  _setFunctionalities: {
    functionalities: PropTypes().isRequired().isArray(),
    action: PropTypes().isRequired().oneOf(["set", "add", "delete"]),
  },
};
