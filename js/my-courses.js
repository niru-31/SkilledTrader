document.addEventListener("DOMContentLoaded", () => {

  const API = "http://localhost:5000/api";

  const myCoursesGrid =
    document.getElementById("myCoursesGrid");

  const totalCourses =
    document.getElementById("totalCourses");

  const completedCourses =
    document.getElementById("completedCourses");

  const inProgressCourses =
    document.getElementById("inProgressCourses");

  const averageProgress =
    document.getElementById("averageProgress");

  const searchInput =
    document.getElementById("courseSearch");

  const filterButtons =
    document.querySelectorAll(".filter-btn");

  const token =
    localStorage.getItem("token");

  let enrolledCourses = [];

  if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
  }

  async function loadMyCourses() {

    try {

      const response =
        await fetch(
          `${API}/enrollments/my-courses`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const data =
        await response.json();

      if (!data.success) {

        myCoursesGrid.innerHTML =
          "<p>Unable to load your courses.</p>";

        return;

      }

      enrolledCourses =
        data.enrollments || [];

      await attachProgressToCourses();

      renderCourses(enrolledCourses);

      updateStats(enrolledCourses);

    } catch (error) {

      console.log(error);

      myCoursesGrid.innerHTML =
        "<p>Backend not connected.</p>";

    }

  }

  async function attachProgressToCourses() {

    for (const enrollment of enrolledCourses) {

      try {

        const courseId =
          enrollment.course._id;

        const response =
          await fetch(
            `${API}/progress/${courseId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        const data =
          await response.json();

        enrollment.progress =
          data.progress || {
            percentage: 0,
            completedChapters: []
          };

      } catch (error) {

        console.log(error);

        enrollment.progress = {
          percentage: 0,
          completedChapters: []
        };

      }

    }

  }

  function renderCourses(enrollments) {

    if (enrollments.length === 0) {

      myCoursesGrid.innerHTML =
        "<p>You have not enrolled in any course yet.</p>";

      return;

    }

    myCoursesGrid.innerHTML = "";

    enrollments.forEach((enrollment) => {

      const course =
        enrollment.course;

      const progress =
        enrollment.progress || {};

      const percent =
        progress.percentage || 0;

      const completedCount =
        progress.completedChapters
          ? progress.completedChapters.length
          : 0;

      const status =
        percent === 100
          ? "completed"
          : "active";

      const link =
        course.isFree
          ? `free-course.html?courseId=${course._id}`
          : `foundation-program.html?courseId=${course._id}`;

      const card =
        document.createElement("div");

      card.className =
        percent === 100
          ? "course-card completed-course"
          : "course-card active-course";

      card.dataset.status =
        status;

      card.innerHTML =
        `
        <div class="course-banner green">
          ${course.isFree ? "FREE COURSE" : "PAID COURSE"}
        </div>

        <div class="course-content">

          <div class="course-tag ${percent === 100 ? "completed" : ""}">
            ${percent === 100 ? "Completed" : "Active"}
          </div>

          <h3>
            ${course.title}
          </h3>

          <p>
            ${course.description}
          </p>

          <div class="progress-track">
            <span style="width:${percent}%"></span>
          </div>

          <div class="progress-row">
            <small>${percent}% Complete</small>
            <strong>
              ${completedCount} Chapters Done
            </strong>
          </div>

          <a
            href="${percent === 100 ? "certificates.html" : link}"
            class="${percent === 100 ? "certificate-btn" : "continue-btn"}"
          >
            ${percent === 100 ? "View Certificate" : "Continue Learning"}
          </a>

        </div>
        `;

      myCoursesGrid.appendChild(card);

    });

  }

  function updateStats(enrollments) {

    const total =
      enrollments.length;

    const completed =
      enrollments.filter((enrollment) => {

        return (
          enrollment.progress &&
          enrollment.progress.percentage === 100
        );

      }).length;

    const inProgress =
      enrollments.filter((enrollment) => {

        return (
          !enrollment.progress ||
          enrollment.progress.percentage < 100
        );

      }).length;

    const totalPercent =
      enrollments.reduce((sum, enrollment) => {

        return sum +
          (enrollment.progress
            ? enrollment.progress.percentage || 0
            : 0);

      }, 0);

    const avg =
      total === 0
        ? 0
        : Math.round(totalPercent / total);

    totalCourses.textContent =
      total;

    completedCourses.textContent =
      completed;

    inProgressCourses.textContent =
      inProgress;

    averageProgress.textContent =
      `${avg}%`;

  }

  if (searchInput) {

    searchInput.addEventListener("keyup", () => {

      const searchValue =
        searchInput.value.toLowerCase();

      const filtered =
        enrolledCourses.filter((enrollment) => {

          return enrollment.course.title
            .toLowerCase()
            .includes(searchValue);

        });

      renderCourses(filtered);

    });

  }

  filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

      filterButtons.forEach((btn) => {

        btn.classList.remove("active");

      });

      button.classList.add("active");

      const filter =
        button.innerText.toLowerCase();

      if (filter === "all") {

        renderCourses(enrolledCourses);

      } else {

        const filtered =
          enrolledCourses.filter((enrollment) => {

            const percent =
              enrollment.progress
                ? enrollment.progress.percentage || 0
                : 0;

            if (filter === "active") {
              return percent < 100;
            }

            if (filter === "completed") {
              return percent === 100;
            }

            return false;

          });

        if (filtered.length === 0) {

          myCoursesGrid.innerHTML =
            `<p>No ${filter} courses found.</p>`;

        } else {

          renderCourses(filtered);

        }

      }

    });

  });

  loadMyCourses();

});