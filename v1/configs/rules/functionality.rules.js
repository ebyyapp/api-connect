const { PropTypes } = require("../../../propstypes");

module.exports = {
  newFunc: {
    name: PropTypes().isRequired().isString(),
    code: PropTypes().isRequired().isString(),
    endpoint: PropTypes().isRequired().isString(),
    groupRoles: PropTypes().isArray(),
  },
  _setGroupRoles: {
    groupRoles: PropTypes().isRequired().isArray(),
    action: PropTypes().isRequired().oneOf(["set", "add", "delete"]),
  },
};
