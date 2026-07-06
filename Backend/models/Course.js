const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      default: "Trading"
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    },

    price: {
      type: Number,
      default: 0
    },

    isFree: {
      type: Boolean,
      default: true
    },

    thumbnailUrl: {
      type: String,
      default: ""
    },

    instructor: {
      type: String,
      default: "SkilledTrader"
    },

    isPublished: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Course", courseSchema);