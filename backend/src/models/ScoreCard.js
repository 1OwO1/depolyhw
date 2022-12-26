import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ScoreCardSchema = new Schema({
  // Number is shorthand for {type: Number}
  name: String,
  subject: String,
  score: String,
});
const ScoreCard = mongoose.model("ScoreCard", ScoreCardSchema);
export default ScoreCard;
