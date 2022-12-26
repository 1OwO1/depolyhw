import cors from "cors";
import express from "express";
import db from "./db.js";
import routes from "./routes/scoreCard";

import path from "path";
const app = express();
if (process.env.NODE_ENV === "development") {
  console.log("jojiosdf");
  app.use(cors());
}

if (process.env.NODE_ENV === "production") {
  console.log("jojiosdf");
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend", "build")));
  //   app.get("/*", function (req, res) {
  //     res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  //   });
}

app.use(express.json());
app.use("/api", routes);

db.connect();

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
