const { appErr } = require("../utils/appErr");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");

const isLogin = (req, res, next) => {
  const token = getTokenFromHeader(req);
  const decodedUser = verifyToken(token);
  // console.log(decodedUser);
  req.user = decodedUser.id;
  if (!decodedUser.id) {
    return next(appErr("invalid token please login again"));
  }
  next();
};

module.exports = isLogin;
