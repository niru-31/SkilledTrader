document.addEventListener("DOMContentLoaded", () => {

  const courseSelect =
    document.getElementById("courseSelect");

  const contentForm =
    document.getElementById("contentForm");

  /* ==========================
     LOAD COURSES
  ========================== */

  async function loadCourses() {

    try {

      const response =
        await fetch(
          "https://skilled-trader.onrender.com/api/courses"
        );

      const data =
        await response.json();

      courseSelect.innerHTML =
        '<option value="">Select Course</option>';

      data.courses.forEach((course) => {

        courseSelect.innerHTML += `
          <option value="${course._id}">
            ${course.title}
          </option>
        `;

      });

    } catch (error) {

      console.log(error);

      alert(
        "Unable to load courses."
      );

    }

  }

  /* ==========================
     SAVE CHAPTER
  ========================== */

  contentForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      const chapterData = {

        course:
          courseSelect.value,

        moduleTitle:
          document.getElementById(
            "moduleTitle"
          ).value,

        title:
          document.getElementById(
            "chapterTitle"
          ).value,

        description:
          document.getElementById(
            "chapterDescription"
          ).value,

        videoUrl:
          document.getElementById(
            "videoUrl"
          ).value,

        notesUrl:
          document.getElementById(
            "notesUrl"
          ).value,

        assignmentUrl:
          document.getElementById(
            "assignmentUrl"
          ).value,

        duration:
          document.getElementById(
            "duration"
          ).value,

        order:
          Number(
            document.getElementById(
              "order"
            ).value
          )

      };

      try {

        const response =
          await fetch(
            "https://skilled-trader.onrender.com/api/chapters",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(
                  chapterData
                )
            }
          );

        const data =
          await response.json();

        if (data.success) {

          alert(
            "Chapter Created Successfully ✅"
          );

          contentForm.reset();

        } else {

          alert(
            data.message
          );

        }

      } catch (error) {

        console.log(error);

        alert(
          "Unable to create chapter."
        );

      }

    }
  );

  loadCourses();

});