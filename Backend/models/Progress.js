const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    completedChapters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter"
      }
    ],

    percentage: {
      type: Number,
      default: 0
    },

    lastWatchedChapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Progress", progressSchema);