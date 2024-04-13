const express = require('express');
const app = express();
const port = 8080;
require("./db/conn");
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.use("/v1", require("./routes/memberRoutes"));
app.use("/v1", require("./routes/communityRoutes"));
app.use("/v1", require("./routes/userRoutes"));
app.use("/v1", require("./routes/roleRoutes"));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
