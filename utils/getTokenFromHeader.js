const getTokenFromHeader = (req) => {
  const token = req?.headers["authorization"]?.split(" ")[1];
  if (token == undefined) {
    return {
      status: "failed",
      message: "there is no token attached to header",
    };
  } else {
    return token;
  }
};
module.exports = getTokenFromHeader;
