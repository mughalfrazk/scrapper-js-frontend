const express = require("express");
const path = require("path");
const db = require("./models/db");
const moviesRoutes = require("./controllers/movies-controllers");

const app = express();

app.use("/api", moviesRoutes);
app.use(express.static(path.join("public")));

app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

db.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log("MySQL Connected and Running!");
  }
});

app.listen(process.env.PORT || "5000", () => {});
