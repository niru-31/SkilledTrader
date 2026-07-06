const express = require("express");

const {
  enrollCourse,
  getMyCourses
} = require("../controllers/enrollmentController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, enrollCourse);

router.get("/my-courses", protect, getMyCourses);

module.exports = router;