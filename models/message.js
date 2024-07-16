const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  receiver: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  message: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Message", MessageSchema);
