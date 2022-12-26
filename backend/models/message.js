import mongoose from "mongoose";
const Schema = mongoose.Schema;
const MessageSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name field is required."],
  },
  body: {
    type: String,
    required: [true, "Body field is required."],
  },
});
//creating a table within database with the defined
const Message = mongoose.model("message", MessageSchema);
//exporting table for querying and mutating
export default Message;
