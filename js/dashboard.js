document.addEventListener("DOMContentLoaded", () => {

  const API = "http://localhost:5000/api";

  const token =
    localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  let enrolledCourses = [];

  window.logout = function () {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  };

  async function loadProfile() {
    try {
      const response = await fetch(`${API}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        const name = data.user.name;

        document.getElementById("userName").textContent = name;
        document.getElementById("userNameSmall").textContent = name;
        document.getElementById("userInitial").textContent =
          name.charAt(0).toUpperCase();

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

    } catch (error) {
      console.log(error);
    }
  }

  async function loadDashboardData() {
    try {
      const response = await fetch(`${API}/enrollments/my-courses`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!data.success) return;

      enrolledCourses = data.enrollments || [];

for (const enrollment of enrolledCourses) {

  try {

    const progressResponse =
      await fetch(
        `${API}/progress/${enrollment.course._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

    enrollment.progress =
  progressData.progress || {
    percentage: 0,
    completedChapters: []
  };

enrollment.totalChapters =
  progressData.totalChapters || 0;

  } catch (error) {

    enrollment.progress = {
      percentage: 0,
      completedChapters: []
    };

  }

}

updateMetrics();
updateContinueLearning();
updateActivity();
generateCandles("7D");

    } catch (error) {
      console.log(error);
    }
  }

  function updateMetrics() {
    const totalCourses = enrolledCourses.length;

    let completedLessons = 0;
    let totalLessons = 0;

    enrolledCourses.forEach((enrollment) => {
      const progress = enrollment.progress || {};

      completedLessons +=
  progress.completedChapters
    ? progress.completedChapters.length
    : 0;

totalLessons +=
  enrollment.totalChapters || 0;
    });

    const averageProgress =
      totalLessons === 0
        ? 0
        : Math.round((completedLessons / totalLessons) * 100);

    const learningScore =
      Math.min(100, averageProgress + totalCourses * 5);

    document.getElementById("learningScore").innerHTML =
      `${learningScore}<span>/100</span>`;

    document.getElementById("learningScoreLabel").textContent =
      learningScore >= 70 ? "Bullish Trend" : "Building Trend";

    document.getElementById("studyTime").textContent =
      `${completedLessons * 20}m`;

    document.getElementById("studyStreak").innerHTML =
      `${completedLessons > 0 ? 1 : 0}<span>days</span>`;

    document.getElementById("certificateCount").textContent =
      averageProgress === 100 ? 1 : 0;

    document.getElementById("trendPercent").textContent =
      `${averageProgress}%`;

    document.getElementById("trendLabel").textContent =
      averageProgress >= 70 ? "Bullish" : "Learning";

    document.getElementById("trendText").textContent =
      averageProgress >= 70
        ? "Your learning consistency is strong."
        : "Complete more lessons to improve your learning trend.";

    document.getElementById("lessonsCompleted").textContent =
      completedLessons;

    document.getElementById("quizzesTaken").textContent =
      0;

    document.getElementById("notesDownloaded").textContent =
      0;

    document.getElementById("liveSessions").textContent =
      0;

    document.getElementById("assignmentCount").textContent =
      0;

    document.getElementById("notificationCount").textContent =
      0;

    document.getElementById("streakText").textContent =
      `${completedLessons > 0 ? 1 : 0} Days`;

    document.getElementById("dashboardSubtitle").textContent =
      totalCourses > 0
        ? `You are enrolled in ${totalCourses} course(s).`
        : "Start your first course today.";

    document.getElementById("dateRange").textContent =
      `📅 ${new Date().toLocaleDateString()}`;
  }

  function updateContinueLearning() {
    const cardTitle =
      document.getElementById("continueCourseTitle");

    const cardMeta =
      document.getElementById("continueCourseMeta");

    const cardThumb =
      document.getElementById("continueCourseThumb");

    const progressText =
      document.getElementById("continueProgressText");

    const progressBar =
      document.getElementById("continueProgressBar");

    const link =
      document.getElementById("continueCourseLink");

    if (enrolledCourses.length === 0) {
      cardTitle.textContent = "No course enrolled";
      cardMeta.textContent = "Go to courses and start learning.";
      cardThumb.innerHTML = "No<br>Course";
      progressText.textContent = "0% Complete";
      progressBar.style.width = "0%";
      link.href = "courses.html";
      return;
    }

    const enrollment = enrolledCourses[0];
    const course = enrollment.course;

    const progress = enrollment.progress || {};
    const completed =
  progress.completedChapters
    ? progress.completedChapters.length
    : 0;

    const total =
  enrollment.totalChapters || 0;

    const percent =
      total === 0 ? 0 : Math.round((completed / total) * 100);

    cardTitle.textContent =
      course.title;

    cardMeta.textContent =
      `${completed} of ${total} chapters completed`;

    cardThumb.innerHTML =
      course.isFree ? "Free<br>Course" : "Premium<br>Course";

    progressText.textContent =
      `${percent}% Complete`;

    progressBar.style.width =
      `${percent}%`;

    link.href =
      course.isFree
        ? `free-course.html?courseId=${course._id}`
        : `foundation-program.html?courseId=${course._id}`;

    document.getElementById("sidebarContinueLink").href =
      link.href;
  }

  function updateActivity() {
    const activityList =
      document.getElementById("activityList");

    if (enrolledCourses.length === 0) {
      activityList.innerHTML =
        "<p>No recent activity yet.</p>";
      return;
    }

    activityList.innerHTML = "";

    enrolledCourses.slice(0, 3).forEach((enrollment) => {
      const course = enrollment.course;

      const item = document.createElement("div");

      item.innerHTML = `
        <span class="green-bg">▶</span>
        <p>Enrolled in ${course.title}</p>
        <small>Recently</small>
      `;

      activityList.appendChild(item);
    });
  }

  const candleSets = {
    "7D": ["green", "green", "red", "green", "green big", "red", "green"],
    "15D": ["green", "red", "green", "green big", "red", "green"],
    "1M": ["green", "green", "red", "green big", "green", "red"],
    "3M": ["green big", "green", "red", "green", "green big"],
    "1Y": ["green", "green big", "green", "red", "green"]
  };

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  function generateCandles(range) {
    const board = document.getElementById("chartBoard");

    if (!board) return;

    board.innerHTML = `<div class="target-line"></div>`;

    const candles = candleSets[range] || candleSets["7D"];

    candles.forEach((type, index) => {
      const candle = document.createElement("div");

      candle.className = `study-candle ${type}`;

      candle.dataset.info =
        type.includes("green")
          ? "Study activity recorded."
          : "Low study activity.";

      candle.innerHTML = `
        <i></i>
        <b></b>
        <span>${labels[index] || "Day"}</span>
      `;

      board.appendChild(candle);
    });
  }

  const rangeButtons =
    document.querySelectorAll(".range-tabs button");

  rangeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      rangeButtons.forEach((btn) =>
        btn.classList.remove("active")
      );

      button.classList.add("active");
      generateCandles(button.innerText);
    });
  });

  document.addEventListener("click", (e) => {
    const candle = e.target.closest(".study-candle");

    if (!candle) return;

    alert(candle.dataset.info);
  });

  const metricCards =
    document.querySelectorAll(".metric-card");

  metricCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 120);
  });

  const quickRows =
    document.querySelectorAll(".quick-row");

  quickRows.forEach((row) => {
    row.addEventListener("mouseenter", () => {
      row.style.transform = "translateX(6px)";
    });

    row.addEventListener("mouseleave", () => {
      row.style.transform = "translateX(0)";
    });
  });

  loadProfile();
  loadDashboardData();

});