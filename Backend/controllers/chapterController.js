const Chapter = require("../models/Chapter");

/* CREATE CHAPTER */
exports.createChapter = async (req, res) => {
  try {

    const chapter = await Chapter.create(req.body);

    res.status(201).json({
      success: true,
      chapter
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* GET COURSE CHAPTERS */
exports.getCourseChapters = async (req, res) => {

  try {

    const chapters = await Chapter.find({
      course: req.params.courseId
    }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: chapters.length,
      chapters
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};