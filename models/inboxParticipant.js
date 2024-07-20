const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InboxParticipant = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  inbox: { type: Schema.Types.ObjectId, required: true, ref: "Inbox" },
});

module.exports = mongoose.model("Inbox_Participant", InboxParticipant);
