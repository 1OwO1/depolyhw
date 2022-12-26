import cors from 'cors';
import express from 'express';
import db from './db.js';
import routes from './routes/scoreCard';

import path from "path";

const app = express();

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend", "build")));
//   app.get("/*", function (req, res) {
//     res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
//   });
}
if (process.env.NODE_ENV === "development") {
	app.use(cors());
}
app.use(express.json());
app.use('/api', routes);

db.connect();


const port=process.env.PORT || 4000;

app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}!`)
})

