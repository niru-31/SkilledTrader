const Progress = require("../models/Progress");
const Chapter = require("../models/Chapter");

/* MARK CHAPTER COMPLETE */
exports.markChapterComplete = async (req, res) => {
  try {
    const { courseId, chapterId } = req.body;

    let progress = await Progress.findOne({
      user: req.user._id,
      course: courseId
    });

    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        course: courseId,
        completedChapters: [],
        percentage: 0
      });
    }

    const alreadyCompleted =
      progress.completedChapters.some(
        (id) => id.toString() === chapterId
      );

    if (!alreadyCompleted) {
      progress.completedChapters.push(chapterId);
    }

    progress.lastWatchedChapter = chapterId;

    const totalChapters =
      await Chapter.countDocuments({
        course: courseId
      });

    progress.percentage =
      totalChapters === 0
        ? 0
        : Math.round(
            (progress.completedChapters.length / totalChapters) * 100
          );

    await progress.save();

    res.status(200).json({
      success: true,
      message: "Progress updated",
      progress,
      totalChapters
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* GET COURSE PROGRESS */
exports.getCourseProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user._id,
      course: req.params.courseId
    })
      .populate("completedChapters")
      .populate("lastWatchedChapter");

    const totalChapters =
      await Chapter.countDocuments({
        course: req.params.courseId
      });

    res.status(200).json({
      success: true,
      progress,
      totalChapters
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};