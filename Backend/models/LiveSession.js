const mongoose = require("mongoose");

const liveSessionSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  roomName: {
    type: String,
    required: true,
    unique: true
  },

  description: {
    type: String,
    default: ""
  },

  sessionDate: {
    type: Date,
    required: true
  },

  duration: {
    type: Number,
    default: 60
  },

  status: {
    type: String,
    enum: [
      "upcoming",
      "live",
      "ended"
    ],
    default: "upcoming"
  },

  recordingUrl: {
    type: String,
    default: ""
  },

  notesUrl: {
    type: String,
    default: ""
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

},
{
  timestamps: true
});

module.exports =
mongoose.model(
  "LiveSession",
  liveSessionSchema
);