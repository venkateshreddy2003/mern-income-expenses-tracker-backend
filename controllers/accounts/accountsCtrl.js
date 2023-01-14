const Account = require("../../model/accounts/Account");
const User = require("../../model/users/User");
const { appErr } = require("../../utils/appErr");

//create
const createAccountCtrl = async (req, res, next) => {
  const { name, initialBalance, accountType, notes } = req.body;
  // console.log(req.body);
  try {
    const userFound = await User.findById(req.user);
    const account = await Account.create({
      name,
      initialBalance,
      accountType,
      notes,
      createdBy: req.user,
    });
    userFound.accounts.push(account._id);
    await userFound.save();
    // console.log(userFound);
    res.json({
      status: "success",
      data: account,
    });
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

//all
const getAccountsCtrl = async (req, res) => {
  try {
    const accounts = await Account.find({}).populate("transactions");
    res.json(accounts);
  } catch (error) {
    res.json(error);
  }
};

//single
const getAccountCtrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await Account.findById(id).populate("transactions");
    res.json({
      status: "success",
      data: account,
    });
  } catch (error) {
    next(appErr(error.message, 500));
  }
};

//delete
const deleteAccountCtrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Account.findByIdAndDelete(id);
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(appErr(error.message, 500));
  }
};

//update
const updateAccountCtrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await Account.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ status: "success", data: account });
  } catch (error) {
    next(appErr(error.message, 500));
  }
};

module.exports = {
  createAccountCtrl,
  getAccountCtrl,
  deleteAccountCtrl,
  updateAccountCtrl,
  getAccountsCtrl,
};
