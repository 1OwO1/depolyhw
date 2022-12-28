import e, { Router } from "express";
import ScoreCard from "../models/ScoreCard";
var exist = 0;
var existans = [];
const router = Router();
router.delete("/cards", (_, res) => {
  deleteDB();
  res.json({ message: "Database cleared" });
});
router.post("/card", (req, res) => {
  //console.log(saveScoreCard(req.body));
  (async () => {
    console.log("hi");
    await saveScoreCard(req.body); //req.body.name, req.body.subject, req.body.score);
    console.log("hi");
    const name = req.body.name;
    const subject = req.body.subject;
    const score = req.body.score;
    if (exist) {
      res.json({
        message: "Updating (" + name + ", " + subject + ", " + score + ")",
        card: 1,
      });
    } else {
      res.json({
        message: "Adding (" + name + ", " + subject + ", " + score + ")",
        card: 1,
      });
    }
  })();
});
router.get("/cards", (req, res) => {
  const type = req.query.type;
  const queryString = req.query.queryString;
  console.log(type); //findans(req.query);
  (async () => {
    await findans(req.query);
    if (existans.length < 1) {
      //console.log(existans);
      res.json({
        messages: 0,
        message: type + " " + queryString + " not found!",
      });
    } else {
      console.log(existans);

      res.json({
        messages: true
          ? existans.map(
              (e) =>
                "Found " +
                queryString +
                " with " +
                type +
                "(" +
                e.name +
                ", " +
                e.subject +
                ", " +
                e.score +
                ")"
            )
          : 0,
        message: type + " " + queryString + " not found!",
      });
    }
  })();
});
const findans = async ({ type, queryString }) => {
  existans = [];
  if (type == "name") {
    existans = await ScoreCard.find({ name: queryString });
  } else {
    existans = await ScoreCard.find({ subject: queryString });
  }
  console.log("hi");
  //console.log(existans);
  /* if (existans) {
    var messages = 0;
    return messages;
  } else {
    exist = 0;
  }
  return existans;*/
};

const saveScoreCard = async ({ name, subject, score }) => {
  var existing = false;
  existing = await ScoreCard.findOne({ name, subject });
  if (existing) {
    await ScoreCard.deleteOne(existing);
    exist = 1;
  } else {
    exist = 0;
  }
  try {
    const newScoreCard = new ScoreCard({ name, subject, score });
    console.log("Created user", newScoreCard);
    return newScoreCard.save();
  } catch (e) {
    throw new Error("User creation error: " + e);
  }
};
const deleteDB = async () => {
  try {
    await ScoreCard.deleteMany({});
    console.log("Database deleted");
  } catch (e) {
    throw new Error("Database deletion failed");
  }
};
export default router;
