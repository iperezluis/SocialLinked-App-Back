const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN_STRING, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
    });
    console.log("database online");
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports = { dbConnection };
