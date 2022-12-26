import mongoose from "mongoose";
import dotenv from "dotenv-defaults";
import ScoreCard from "./models/ScoreCard";
dotenv.config();

export default {
  connect: () => {
    mongoose
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((res) => console.log("mongo db connection created"));
    const db = mongoose.connection;
    db.on("error", (err) => console.log(err));
    db.once("open", async () => {
      /*await deleteDB();
      await saveScoreCard("Ric", "Math", 55);
      await saveScoreCard("Sandy", "Math", 55);
      await saveScoreCard("Peter", "Math", 55);*/
    });
  },
};
const saveScoreCard = async (name, subject, score) => {
  const existing = await ScoreCard.findOne({ name });
  if (existing) throw new Error(`data ${name} exists!!`);
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
