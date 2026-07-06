const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

/* CREATE RAZORPAY ORDER */
exports.createOrder = async (req, res) => {
  try {
    console.log("===== CREATE ORDER START =====");
    console.log("User:", req.user);
    console.log("Body:", req.body);

    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }

    const course = await Course.findById(courseId);

    console.log("Course:", course);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    if (course.isFree) {
      return res.status(400).json({
        success: false,
        message: "This course is free"
      });
    }

    const alreadyEnrolled = await Enrollment.findOne({
      user: req.user._id,
      course: courseId
    });

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled"
      });
    }

    console.log("Creating Razorpay order...");

    const order = await razorpay.orders.create({
      amount: course.price * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    });

    console.log("Order Created:", order);

    return res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      order,
      course
    });

  } catch (error) {
    console.log("FULL CREATE ORDER ERROR:");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
      statusCode: error.statusCode || 500
    });
  }
};


/* VERIFY PAYMENT */
exports.verifyPayment = async (req, res) => {
  try {
    const {
      courseId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (
      !courseId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details missing"
      });
    }

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(body.toString())
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    const alreadyEnrolled = await Enrollment.findOne({
      user: req.user._id,
      course: courseId
    });

    if (alreadyEnrolled) {
      return res.status(200).json({
        success: true,
        message: "Already enrolled",
        enrollment: alreadyEnrolled
      });
    }

    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: courseId,
      paymentStatus: "paid"
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified and course unlocked",
      enrollment
    });

  } catch (error) {
    console.log("FULL VERIFY PAYMENT ERROR:");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
      statusCode: error.statusCode || 500
    });
  }
};