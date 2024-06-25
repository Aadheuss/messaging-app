const mongoose = require("mongoose");

const Schema = mongoose.schema;

const UserSchema = new Schema({
  username: { type: String, required: true, maxLength: 50 },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);
