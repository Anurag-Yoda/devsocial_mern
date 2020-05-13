const express = require("express");
const connectDB = require("./config/db");
const app = express();
const userRoute = require("./routes/api/users");
const postRoute = require("./routes/api/posts");
const profileRoute = require("./routes/api/profile");
const authRoute = require("./routes/api/auth");
const app = require("path");

connectDB(); // mongooseDB connect

app.use(express.json({ extended: false })); //body parser



//Define routes below
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use("/api/posts", postRoute);

//Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set Static Folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Example app listening on port port!`));
