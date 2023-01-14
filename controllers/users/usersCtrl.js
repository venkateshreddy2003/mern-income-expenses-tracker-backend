const User = require("../../model/users/User");
const bcryptjs = require("bcryptjs");
const { use } = require("../../routes/accounts/accountRoute");
const { appErr } = require("../../utils/appErr");
const generateToken = require("../../utils/generateToken");
const verifyToken = require("../../utils/verifyToken");
//Register
const registerUserCtrl = async (req, res, next) => {
  const { fullname, password, email } = req.body;
  try {
    // if email exists
    const userFound = await User.findOne({ email });
    if (userFound) {
      return next(appErr("user already exists", 500));
    }
    // if fields are empty
    if (!email || !password || !fullname) {
      return next(appErr("please provide all the fields ", 500));
    }
    // hash the password

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });
    res.json({
      status: "success",
      fullname: user?.fullname,
      email: user?.email,
      id: user?._id,
    });
  } catch (error) {
    return next(appErr(error.message, 500));
  }
};

//login
const userLoginCtrl = async (req, res, next) => {
  // console.log("login route");
  const { email, password } = req.body;
  if (!email || !password) {
    return next(appErr("enter proper credentials", 500));
  }
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) {
      return next(appErr("Invalid login credentials", 500));
    }
    const ispasswordmatched = await bcryptjs.compare(
      password,
      userFound.password
    );
    // console.log(userFound);
    // console.log(ispasswordmatched);
    if (!ispasswordmatched) {
      return next(appErr("Invalid login credentials", 500));
    }
    res.json({
      status: "success",
      fullname: userFound?.fullname,
      id: userFound?._id,
      token: generateToken(userFound._id),
    });
  } catch (error) {
    return next(appErr(error.message, 500));
  }
};

//profile
const userProfileCtrl = async (req, res, next) => {
  try {
    const user = await User.findById(req.user).populate({
      path: "accounts",
      populate: {
        path: "transactions",
        model: "Transaction",
      },
    });
    res.json(user);
  } catch (error) {
    next(appErr(error.message, 500));
  }
};

//delete
const deleteUserCtrl = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user);
    res.json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(appErr(error.message, 500));
  }
};

//update
const updateUserCtrl = async (req, res, next) => {
  try {
    // console.log(req.body);
    if (Object.keys(req.body).length === 0)
      return next(appErr("enter properly all fields", 500));
    if (req.body.email) {
      const userFound = await User.findOne({ email: req.body.email });
      if (userFound) {
        return next(
          appErr("email is taken or you are entering existing email", 400)
        );
      }
    }
    const salt = await bcryptjs.genSalt(10);
    let hashedPassword;
    if (req.body.password) {
      hashedPassword = await bcryptjs.hash(req.body.password, salt);
    }
    const user = await User.findByIdAndUpdate(
      req.user,
      {
        email: req?.body?.email,
        fullname: req?.body?.fullname,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (req.body.password) {
      user.password = hashedPassword;
      await user.save();
    }
    res.json(
      await User.findById(req.user).populate({
        path: "accounts",
        populate: {
          path: "transactions",
          model: "Transaction",
        },
      })
    );
  } catch (error) {
    next(appErr(error.message, 500));
  }
};

module.exports = {
  registerUserCtrl,
  userLoginCtrl,
  userProfileCtrl,
  deleteUserCtrl,
  updateUserCtrl,
};
