const { appErr } = require("../utils/appErr");

const globalErrhandler = (err, req, res, next) => {
  const statusCode = (err.statusCode = err.statusCode || 500);
  const status = err.status || "error";
  const message = err.message;
  const stack = err.stack;
  res.status(statusCode).json({
    status,
    message,
    stack,
  });
};
const notFound = (req, res, next) => {
  return next(appErr("not found", 400));
};
module.exports = {
  globalErrhandler,
  notFound,
};
