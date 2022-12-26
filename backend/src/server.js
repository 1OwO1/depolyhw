import express from "express";
import cors from "cors";
import db from "./db";
import routes from "./routes";
import path from "path";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend", "build")));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
}
if (process.env.NODE_ENV === "development") {
  app.use(cors());
}

db.connect();
app.use("/", routes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
