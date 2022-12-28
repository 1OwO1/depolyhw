import express from "express";
import cors from "cors";
import db from "./db";
import routes from "./routes";
import path from "path";

const app = express();
const port = process.env.PORT || 4000;
const __dirname = path.resolve();
console.log(__dirname);
app.use(express.json());
app.use(cors());

console.log({ node_env: process.env.NODE_ENV });

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend", "build")));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
}

if (process.env.NODE_ENV === "development") {
  console.log("Df");
  app.use(cors());
}
app.use(express.json());
app.use("/api", routes);
db.connect();
/*app.get("/", (req, res) => {
  // send the request back to the client
  //  console.log("GET /api");
  res.send({ message: "Hello from the server!" }).status(200);
  const __dirname = path.resolve();
  console.log(__dirname);

  //app.use(express.static(path.join(__dirname, "../../frontend", "build")));
  /*app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../../frontend", "build", "index.html"));
  });
});*/

/*app.get("/api", (req, res) => {
  // send the request back to the client
  console.log("GET /api");
  res.send({ message: "Hello from the server!" }).status(200);
});
app.use("/api", routes);
if (process.env.NODE_ENV === "production") {
  console.log("dhfisfuwhei");
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend", "build")));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
}
*/
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
