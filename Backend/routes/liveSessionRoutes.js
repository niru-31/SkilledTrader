const express = require("express");

const {
  createLiveSession,
  getLiveSessions,
  getActiveLiveSession,
  startLiveSession,
  endLiveSession
} = require("../controllers/liveSessionController");

const {
  protect
} = require("../middleware/authMiddleware");

const {
  adminOnly
} = require("../middleware/adminMiddleware");

const router =
  express.Router();

/* STUDENT / PUBLIC ROUTES */

router.get(
  "/",
  getLiveSessions
);

router.get(
  "/active",
  getActiveLiveSession
);

/* ADMIN ROUTES */

router.post(
  "/create",
  protect,
  adminOnly,
  createLiveSession
);

router.put(
  "/start/:id",
  protect,
  adminOnly,
  startLiveSession
);

router.put(
  "/end/:id",
  protect,
  adminOnly,
  endLiveSession
);

module.exports =
  router;