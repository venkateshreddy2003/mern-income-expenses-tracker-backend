const mongoose = require("mongoose");

// connect

const dbConnect = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Db connected successfully");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = dbConnect;
