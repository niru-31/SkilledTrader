document.addEventListener("DOMContentLoaded", () => {

  const API = "http://localhost:5000/api";

  const token =
    localStorage.getItem("token");

  const form =
    document.getElementById("liveSessionForm");

  const courseSelect =
    document.getElementById("courseSelect");

  const liveSessionsList =
    document.getElementById("liveSessionsList");

  if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
  }

  async function loadCourses() {
    try {
      const response =
        await fetch(`${API}/courses`);

      const data =
        await response.json();

      if (!data.success) {
        courseSelect.innerHTML =
          `<option value="">Unable to load courses</option>`;
        return;
      }

      courseSelect.innerHTML =
        `<option value="">Select Course</option>`;

      data.courses.forEach((course) => {
        const option =
          document.createElement("option");

        option.value =
          course._id;

        option.textContent =
          course.title;

        courseSelect.appendChild(option);
      });

    } catch (error) {
      console.log(error);

      courseSelect.innerHTML =
        `<option value="">Backend not connected</option>`;
    }
  }

  async function loadLiveSessions() {
    try {
      const response =
        await fetch(`${API}/live-sessions`);

      const data =
        await response.json();

      if (!data.success) {
        liveSessionsList.innerHTML =
          `<p>Unable to load live sessions.</p>`;
        return;
      }

      renderLiveSessions(
        data.liveSessions || []
      );

    } catch (error) {
      console.log(error);

      liveSessionsList.innerHTML =
        `<p>Backend not connected.</p>`;
    }
  }

  function renderLiveSessions(sessions) {
    if (sessions.length === 0) {
      liveSessionsList.innerHTML =
        `<p>No live sessions created yet.</p>`;
      return;
    }

    liveSessionsList.innerHTML = "";

    sessions.forEach((session) => {
      const courseTitle =
        session.course
          ? session.course.title
          : "No Course";

      const date =
        new Date(session.sessionDate)
          .toLocaleString();

      const card =
        document.createElement("div");

      card.className =
        "session-card";

      card.innerHTML =
        `
        <h3>${session.title}</h3>

        <p>
          <strong>Course:</strong>
          ${courseTitle}
        </p>

        <p>
          <strong>Date:</strong>
          ${date}
        </p>

        <p>
          <strong>Room:</strong>
          ${session.roomName}
        </p>

        <span class="status ${session.status}">
          ${session.status}
        </span>

        <div class="action-buttons">

          ${
            session.status === "upcoming"
              ? `
              <button
                class="start-btn"
                data-id="${session._id}"
              >
                Start
              </button>
              `
              : ""
          }

          ${
            session.status === "live"
              ? `
              <button
                class="end-btn"
                data-id="${session._id}"
              >
                End
              </button>
              `
              : ""
          }

        </div>
        `;

      liveSessionsList.appendChild(card);
    });

    attachActionEvents();
  }

  function attachActionEvents() {
    const startButtons =
      document.querySelectorAll(".start-btn");

    startButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const id =
          button.dataset.id;

        await startSession(id);
      });
    });

    const endButtons =
      document.querySelectorAll(".end-btn");

    endButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const id =
          button.dataset.id;

        const recordingUrl =
          prompt(
            "Paste recording URL if available. Otherwise leave blank."
          );

        await endSession(id, recordingUrl);
      });
    });
  }

  async function startSession(id) {
    try {
      const response =
        await fetch(
          `${API}/live-sessions/start/${id}`,
          {
            method: "PUT",
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const data =
        await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      alert("Live session started.");
      loadLiveSessions();

    } catch (error) {
      console.log(error);
      alert("Unable to start session.");
    }
  }

  async function endSession(id, recordingUrl) {
    try {
      const response =
        await fetch(
          `${API}/live-sessions/end/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                `Bearer ${token}`
            },
            body: JSON.stringify({
              recordingUrl:
                recordingUrl || ""
            })
          }
        );

      const data =
        await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      alert("Live session ended.");
      loadLiveSessions();

    } catch (error) {
      console.log(error);
      alert("Unable to end session.");
    }
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const title =
        document.getElementById("sessionTitle").value;

      const course =
        document.getElementById("courseSelect").value;

      const description =
        document.getElementById("sessionDescription").value;

      const date =
        document.getElementById("sessionDate").value;

      const time =
        document.getElementById("sessionTime").value;

      const duration =
        document.getElementById("sessionDuration").value;

      const roomName =
        document.getElementById("roomName").value;

      const notesUrl =
        document.getElementById("notesUrl").value;

      if (!course) {
        alert("Please select a course.");
        return;
      }

      const sessionDate =
        new Date(`${date}T${time}`);

      try {
        const response =
          await fetch(
            `${API}/live-sessions/create`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization:
                  `Bearer ${token}`
              },
              body: JSON.stringify({
                title,
                course,
                description,
                sessionDate,
                duration,
                roomName,
                notesUrl
              })
            }
          );

        const data =
          await response.json();

        if (!data.success) {
          alert(data.message);
          return;
        }

        alert("Live session created successfully.");

        form.reset();

        loadLiveSessions();

      } catch (error) {
        console.log(error);
        alert("Unable to create live session.");
      }
    });
  }

  loadCourses();
  loadLiveSessions();

  setInterval(() => {
  loadLiveSessions();
}, 10000);

});