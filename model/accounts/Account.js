const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: [
        "Savings",
        "Investment",
        "Checking",
        "Credit Card",
        "Building",
        "School",
        "Project",
        "Utilities",
        "Travel",
        "Personal",
        "Groceries",
        "Entertainment",
        "Loan",
        "Cash Flow",
        "Uncategorised",
      ],
      required: true,
    },
    initialBalance: {
      type: Number,
      default: 0,
    },

    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
