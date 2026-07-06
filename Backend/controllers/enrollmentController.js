const Enrollment = require("../models/Enrollment");

/* ENROLL COURSE */
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const alreadyEnrolled = await Enrollment.findOne({
      user: req.user._id,
      course: courseId
    });

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled in this course"
      });
    }

    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: courseId,
      paymentStatus: req.body.paymentStatus || "free"
    });

    res.status(201).json({
      success: true,
      message: "Course enrolled successfully",
      enrollment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* MY COURSES */
exports.getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      user: req.user._id
    }).populate("course");

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};