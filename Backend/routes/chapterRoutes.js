const express = require("express");

const {
  createChapter,
  getCourseChapters
} = require("../controllers/chapterController");

const router = express.Router();

router.post("/", createChapter);

router.get("/:courseId", getCourseChapters);

module.exports = router;