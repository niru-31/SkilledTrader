const express = require("express");
const fs = require("fs");
const path = require("path");

const { uploadFile } = require("../services/driveService");

const router = express.Router();

router.get("/upload-test", async (req, res) => {
  try {
    const testFilePath = path.join(__dirname, "../test-certificate.pdf");

    fs.writeFileSync(
      testFilePath,
      "This is a test certificate PDF file."
    );

    const result = await uploadFile(
      testFilePath,
      "test-certificate.pdf"
    );

    fs.unlinkSync(testFilePath);

    res.status(200).json({
      success: true,
      message: "File uploaded to Google Drive",
      result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;