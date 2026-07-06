const Certificate = require("../models/Certificate");
const Progress = require("../models/Progress");

/* GET MY CERTIFICATES */
exports.getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({
      user: req.user._id
    })
      .populate("course")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: certificates.length,
      certificates
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* ISSUE CERTIFICATE */
exports.issueCertificate = async (req, res) => {
  try {
    const { courseId, certificateUrl } = req.body;

    const progress = await Progress.findOne({
      user: req.user._id,
      course: courseId
    });

    if (!progress || progress.percentage < 100) {
      return res.status(400).json({
        success: false,
        message: "Complete course first"
      });
    }

    const existingCertificate =
      await Certificate.findOne({
        user: req.user._id,
        course: courseId
      });

    if (existingCertificate) {
      return res.status(200).json({
        success: true,
        message: "Certificate already issued",
        certificate: existingCertificate
      });
    }

    const certificate = await Certificate.create({
      user: req.user._id,
      course: courseId,
      certificateId: `ST-${Date.now()}`,
      certificateUrl: certificateUrl || ""
    });

    res.status(201).json({
      success: true,
      message: "Certificate issued",
      certificate
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};