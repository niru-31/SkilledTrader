const Course = require("../models/Course");

/* CREATE COURSE */
exports.createCourse = async (req, res) => {
  try {

    const {
      title,
      description,
      category,
      level,
      price,
      isFree
    } = req.body;

    const course = await Course.create({
      title,
      description,
      category,
      level,
      price,
      isFree
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* GET ALL COURSES */
exports.getCourses = async (req, res) => {
  try {

    const courses = await Course.find();

    res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* GET SINGLE COURSE */
exports.getCourseById = async (req, res) => {
  try {

    const course = await Course.findById(
      req.params.id
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      course
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};