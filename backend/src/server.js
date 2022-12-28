import express from "express";
import cors from "cors";
import db from "./db";
import routes from "./routes";
import ScoreCard from "./models/ScoreCard";
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

db.connect();
app.use("/api", routes);
if (process.env.NODE_ENV === "development") {
  app.use(cors());
}
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend", "build")));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
