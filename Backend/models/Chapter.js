const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
{
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  moduleTitle: {
    type: String,
    default: ""
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ""
  },

  videoUrl: {
    type: String,
    default: ""
  },

  notesUrl: {
    type: String,
    default: ""
  },

  assignmentUrl: {
    type: String,
    default: ""
  },

  duration: {
    type: String,
    default: ""
  },

  order: {
    type: Number,
    required: true
  },

  isPreview: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: true
});

module.exports =
mongoose.model("Chapter", chapterSchema);