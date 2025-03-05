const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: { type: String },
  credits: { type: Number },
});

module.exports = mongoose.model("Course", courseSchema);
