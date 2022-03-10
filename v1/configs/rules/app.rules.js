const { PropTypes } = require("../../../propstypes");

module.exports = {
  newApp: {
    name: PropTypes().isRequired().isString(),
    redirectUrl: PropTypes().isRequired().isString(),
    type: PropTypes().isRequired().oneOf(["partner", "user", "team"]),
  },
};
