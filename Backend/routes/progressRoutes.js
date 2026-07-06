const express = require("express");

const {
  markChapterComplete,
  getCourseProgress
} = require("../controllers/progressController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/mark-complete", protect, markChapterComplete);

router.get("/:courseId", protect, getCourseProgress);

module.exports = router;