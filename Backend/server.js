const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const liveSessionRoutes = require("./routes/liveSessionRoutes");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {

  res.send(
    "SkilledTrader Backend Running 🚀"
  );

});
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/courses", require("./routes/courseRoutes"));

app.use("/api/chapters", require("./routes/chapterRoutes"));

app.use("/api/enrollments", require("./routes/enrollmentRoutes"));

app.use("/api/progress", require("./routes/progressRoutes"));

app.use("/api/certificates",require("./routes/certificateRoutes"));

app.use("/api/test-drive", require("./routes/testDriveRoutes"));

app.use("/api/payments", require("./routes/paymentRoutes"));

app.use("/api/live-sessions",liveSessionRoutes);

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});