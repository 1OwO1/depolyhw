import express from "express";
//import cors from "cors";
import mongo from "./mongo";
import mongoose from "mongoose";
import http from "http";
import WebSocket from "ws";
import wsConnect from "./wsConnect";
import dotenv from "dotenv-defaults";
//import routes from "./routes"
mongo.connect();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const db = mongoose.connection;
db.once("open", () => {
  console.log("MongoDB connected!");
  //console.log(typeof wss);
  wss.on("connection", (ws) => {
    //wsConnect.initData(ws);
    ws.box = ""; //record active ChatBox name
    ws.onmessage = wsConnect.onMessage(ws);
    //ws = Client-Side WebSocket
    //Define WebSocket connection logic
  });
});

// init middleware
if (process.env.NODE_ENV === "development") {
  app.use(cors());
}
// define routes
app.get("/api", (req, res) => {
  // send the request back to the client
  console.log("GET /api");
  res.send({ message: "Hello from the server!" }).status(200);
});

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend", "build")));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
}

// define server
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
