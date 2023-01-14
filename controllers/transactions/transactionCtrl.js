//create
const Account = require("../../model/accounts/Account");
const Transaction = require("../../model/transactions/Transaction");
const User = require("../../model/users/User");
const { appErr } = require("../../utils/appErr");
const createTransactionCtrl = async (req, res, next) => {
  // console.log(req.body);
  const { name, amount, notes, transactionType, account, category } = req.body;
  if (!name || !amount || !notes || !transactionType || !account || !category) {
    // console.log("a");
    return next(appErr("enter all fields", 500));
  }

  try {
    const userFound = await User.findById(req.user);
    if (!userFound) {
      return next(appErr("user not found", 404));
    }
    const accountFound = await Account.findById(account);
    if (!accountFound) {
      return next(appErr("account not found", 404));
    }
    // console.log(userFound);
    // console.log(accountFound);
    const transaction = await Transaction.create({
      amount,
      notes,
      account,
      transactionType,
      category,
      name,
      createdBy: req.user,
    });
    accountFound.transactions.push(transaction._id);
    // console.log(transaction);
    await accountFound.save();
    // console.log("ok");
    res.json({
      status: "sucess",
      data: transaction,
    });
  } catch (error) {
    // console.log(error);
    res.json(error);
  }
};

//all
const getTransactionsCtrl = async (req, res, next) => {
  try {
    const trans = await Transaction.find().populate("createdBy");
    res.json({
      status: "success",
      data: trans,
    });
  } catch (error) {
    next(appErr(error.message, 500));
  }
};

//single
const getTransactionCtrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trans = await Transaction.findById(id);
    res.json({ status: "success", data: trans });
  } catch (error) {
    next(appErr(error.message, 500));
  }
};

//delete
const deleteTransactionCtrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.json({ status: "success", data: null });
  } catch (error) {
    next(appErr(error.message, 500));
  }
};

//update
const updateTransactionCtrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trans = await Transaction.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ status: "success", data: trans });
  } catch (error) {
    next(appErr(error.message, 500));
  }
};

module.exports = {
  createTransactionCtrl,
  getTransactionsCtrl,
  getTransactionsCtrl,
  getTransactionCtrl,
  deleteTransactionCtrl,
  updateTransactionCtrl,
};
