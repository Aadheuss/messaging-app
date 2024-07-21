const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InboxSchema = new Schema({
  last_message: { type: Schema.Types.ObjectId, ref: "Message" },
  created_at: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Inbox", InboxSchema);
