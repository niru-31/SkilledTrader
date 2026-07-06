const LiveSession = require("../models/LiveSession");

/* CREATE LIVE SESSION */
exports.createLiveSession = async (req, res) => {
  try {
    const {
      title,
      course,
      roomName,
      description,
      sessionDate,
      duration,
      notesUrl
    } = req.body;

    const liveSession = await LiveSession.create({
      title,
      course,
      roomName,
      description,
      sessionDate,
      duration,
      notesUrl,
      createdBy: req.user ? req.user._id : null
    });

    res.status(201).json({
      success: true,
      message: "Live session created successfully",
      liveSession
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* GET ALL LIVE SESSIONS */
exports.getLiveSessions = async (req, res) => {
  try {
    const liveSessions = await LiveSession.find()
      .populate("course")
      .sort({ sessionDate: 1 });

    res.status(200).json({
      success: true,
      count: liveSessions.length,
      liveSessions
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* GET ACTIVE LIVE SESSION */
exports.getActiveLiveSession = async (req, res) => {
  try {
    const liveSession = await LiveSession.findOne({
      status: "live"
    })
      .populate("course")
      .sort({ sessionDate: 1 });

    res.status(200).json({
      success: true,
      liveSession
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* START LIVE SESSION */
exports.startLiveSession = async (req, res) => {
  try {
    const liveSession = await LiveSession.findById(
      req.params.id
    );

    if (!liveSession) {
      return res.status(404).json({
        success: false,
        message: "Live session not found"
      });
    }

    liveSession.status = "live";

    await liveSession.save();

    res.status(200).json({
      success: true,
      message: "Live session started",
      liveSession
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* END LIVE SESSION */
exports.endLiveSession = async (req, res) => {
  try {
    const {
      recordingUrl
    } = req.body;

    const liveSession = await LiveSession.findById(
      req.params.id
    );

    if (!liveSession) {
      return res.status(404).json({
        success: false,
        message: "Live session not found"
      });
    }

    liveSession.status = "ended";

    if (recordingUrl) {
      liveSession.recordingUrl = recordingUrl;
    }

    await liveSession.save();

    res.status(200).json({
      success: true,
      message: "Live session ended",
      liveSession
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};