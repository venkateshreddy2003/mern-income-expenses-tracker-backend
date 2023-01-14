const jwt = require("jsonwebtoken");
const { appErr } = require("./appErr");
const verifyToken = (token) => {
  return jwt.verify(token, "key", (err, decoded) => {
    if (err) {
      return err;
    } else {
      return decoded;
    }
  });
};
module.exports = verifyToken;
