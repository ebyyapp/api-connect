const { PropTypes } = require("../../../propstypes");

module.exports = {
  checkAccess: {
    token: PropTypes().isRequired().isString(),
    code: PropTypes().isRequired().isString(),
    endpoint: PropTypes().isRequired().isString(),
  },
};
