document.addEventListener("DOMContentLoaded", () => {

  console.log("JS Loaded");

  const coursesGrid =
    document.getElementById("coursesGrid");

  console.log("coursesGrid:", coursesGrid);

  async function loadCourses() {

    try {

      const response =
        await fetch("http://localhost:5000/api/courses");

      const data =
        await response.json();

      console.log("Courses data:", data);

      if (!data.success) {
        coursesGrid.innerHTML =
          "<p>Unable to load courses.</p>";
        return;
      }

      coursesGrid.innerHTML = "";

      data.courses.forEach((course) => {

        const card =
          document.createElement("div");

      card.className = "course-card reveal visible";
        card.innerHTML = `
          <div class="course-image">
            <div class="premium-badge">
              ${course.isFree ? "FREE" : "LOCKED"}            
              </div>
          </div>

          <div class="course-content">

            <div class="course-tag">
              ${course.level}
            </div>

            <h3>
              ${course.title}
            </h3>

            <p>
              ${course.description}
            </p>

            <div class="course-meta">
              <span>⭐ 4.9 Rating</span>
              <span>👨‍🎓 Students</span>
            </div>

            <div class="course-bottom">

              <div class="course-price">
                ₹${course.price}
              </div>

              <button
                class="btn-primary enroll-btn"
                data-id="${course._id}"
                data-free="${course.isFree}">
                ${course.isFree ? "Start Free" : "🔒 Unlock Course"}              
                </button>

            </div>

          </div>
        `;

        coursesGrid.appendChild(card);

      });

      attachEnrollEvents();

    } catch (error) {

      console.log(error);

      coursesGrid.innerHTML =
        "<p>Backend not connected.</p>";

    }

  }

  function attachEnrollEvents() {

    const buttons =
      document.querySelectorAll(".enroll-btn");

    buttons.forEach((button) => {

      button.addEventListener("click", async () => {

        const courseId =
          button.dataset.id;

        const isFree =
          button.dataset.free === "true";

        if (!isFree) {

          window.location.href =
            `payment-foundation.html?courseId=${courseId}`;

          return;

        }

        const token =
          localStorage.getItem("token");

        if (!token) {
          alert("Please login first.");
          window.location.href = "login.html";
          return;
        }

        try {

          const response =
            await fetch(
              "http://localhost:5000/api/enrollments",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                  courseId
                })
              }
            );

          const data =
            await response.json();

          if (
            data.success ||
            data.message === "Already enrolled in this course"
          ) {

            window.location.href =
              `free-course.html?courseId=${courseId}`;

          } else {

            alert(data.message);

          }

        } catch (error) {

          console.log(error);
          alert("Enrollment failed.");

        }

      });

    });

  }

  loadCourses();

});