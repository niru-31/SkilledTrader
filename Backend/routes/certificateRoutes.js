const express = require("express");

const {
  getMyCertificates,
  issueCertificate
} = require("../controllers/certificateController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/my-certificates", protect, getMyCertificates);

router.post("/issue", protect, issueCertificate);

module.exports = router;