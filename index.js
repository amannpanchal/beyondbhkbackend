const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 8080;
const cors = require("cors");
const connectDB = require("./Utils/connectDB.js");


// Middleware
app.use(express.json({}));

app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/api/property", require("./Routes/propertyRoutes.js"));
app.use("/api/city", require("./Routes/cityRoutes.js"));
app.use("/api/category", require("./Routes/categoryRoutes.js"));
app.use("/api/propertytype", require("./Routes/propertyTypeRoutes.js"));
app.use("/api/auth", require("./Routes/userRoutes.js"));
app.use("/api/admin", require("./Routes/adminRoutes.js"));
app.use("/api/superAdmin", require("./Routes/superAdminRoutes.js"));


app.get("/", (req, res) => {
  res.status(200).json({ message: "BBHK server is running" });
});



connectDB(process.env.MONGO_URI);
app.listen(port, () => {
  console.log(`Server Started... on port ${port}`);
});
