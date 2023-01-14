const jwt = require("jsonwebtoken");
const generateToken = (id) => {
  return jwt.sign({ id }, "key", {
    expiresIn: "10d",
  });
};

module.exports = generateToken;
