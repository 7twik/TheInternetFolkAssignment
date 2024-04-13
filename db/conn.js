const mongoose = require("mongoose");
require("dotenv").config();

  const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.sjxr9uv.mongodb.net/tif?retryWrites=true&w=majority`;
 mongoose
  .connect(connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Database connected!!!"))
  .catch((error) => {
    console.log("Error connecting database");
    console.log(connectionString)
    console.log(error);
  });
