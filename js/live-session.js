document.addEventListener("DOMContentLoaded", () => {

  const API = "https://skilled-trader.onrender.com/api";

  const joinBtn = document.querySelector(".btn-primary");
  const upcomingBtn = document.querySelector(".btn-secondary");

  const jitsiContainer = document.getElementById("jitsiContainer");

  const liveStatusPill = document.getElementById("liveStatusPill");
  const nextSessionTitle = document.getElementById("nextSessionTitle");
  const nextSessionCourse = document.getElementById("nextSessionCourse");
  const nextSessionTime = document.getElementById("nextSessionTime");

  const liveSessionMeta = document.getElementById("liveSessionMeta");
  const currentSessionTitle = document.getElementById("currentSessionTitle");
  const currentSessionDescription = document.getElementById("currentSessionDescription");
  const sessionTags = document.getElementById("sessionTags");
  const recordingPath = document.getElementById("recordingPath");
  const classNotesList = document.getElementById("classNotesList");
  const downloadNotesBtn = document.getElementById("downloadNotesBtn");
  const upcomingGrid = document.getElementById("upcomingGrid");

  let jitsiApi = null;

  let currentLiveSessionId = null;

  if (joinBtn) {
    joinBtn.addEventListener("click", (e) => {
      e.preventDefault();

      document.querySelector("#live-class")
        ?.scrollIntoView({
          behavior: "smooth"
        });
    });
  }

  if (upcomingBtn) {
    upcomingBtn.addEventListener("click", (e) => {
      e.preventDefault();

      document.querySelector("#upcoming")
        ?.scrollIntoView({
          behavior: "smooth"
        });
    });
  }

  async function loadLiveSessions() {
    try {
      const response =
        await fetch(`${API}/live-sessions`);

      const data =
        await response.json();

      if (!data.success) {
        showWaitingState();
        return;
      }

      const sessions =
        data.liveSessions || [];

      renderUpcomingSessions(sessions);

      const liveSession =
        sessions.find((session) => {
          return session.status === "live";
        });

      if (liveSession) {
        updateLiveSessionUI(liveSession);
        startJitsi(liveSession);
      } else {
        const nextSession =
          sessions.find((session) => {
            return session.status === "upcoming";
          });

        showWaitingState(nextSession);
      }

    } catch (error) {
      console.log(error);
      showWaitingState();
    }
  }

  function showWaitingState(nextSession = null) {
    if (liveStatusPill) {
      liveStatusPill.textContent =
        "● Waiting for Host";
    }

    if (nextSession) {
      const courseTitle =
        nextSession.course
          ? nextSession.course.title
          : "SkilledTrader Course";

      const time =
        new Date(nextSession.sessionDate)
          .toLocaleString();

      if (nextSessionTitle) {
        nextSessionTitle.textContent =
          nextSession.title;
      }

      if (nextSessionCourse) {
        nextSessionCourse.textContent =
          courseTitle;
      }

      if (nextSessionTime) {
        nextSessionTime.textContent =
          time;
      }

    } else {
      if (nextSessionTitle) {
        nextSessionTitle.textContent =
          "No Live Session Scheduled";
      }

      if (nextSessionCourse) {
        nextSessionCourse.textContent =
          "Please check again later.";
      }

      if (nextSessionTime) {
        nextSessionTime.textContent =
          "Waiting";
      }
    }

    if (liveSessionMeta) {
      liveSessionMeta.textContent =
        "Waiting for session";
    }

    if (currentSessionTitle) {
      currentSessionTitle.textContent =
        "Waiting for Live Session";
    }

    if (currentSessionDescription) {
      currentSessionDescription.textContent =
        "The live class will appear here when the mentor starts the session.";
    }

    if (jitsiContainer) {
      jitsiContainer.innerHTML =
        `
        <div class="video-placeholder">
          <div class="play-circle">⏳</div>
          <h2>Waiting for Host</h2>
          <p>Live class has not started yet.</p>
        </div>
        `;
    }
  }

  function updateLiveSessionUI(session) {
    const courseTitle =
      session.course
        ? session.course.title
        : "SkilledTrader Course";

    const time =
      new Date(session.sessionDate)
        .toLocaleString();

    if (liveStatusPill) {
      liveStatusPill.textContent =
        "● Live Now";
    }

    if (nextSessionTitle) {
      nextSessionTitle.textContent =
        session.title;
    }

    if (nextSessionCourse) {
      nextSessionCourse.textContent =
        courseTitle;
    }

    if (nextSessionTime) {
      nextSessionTime.textContent =
        time;
    }

    if (liveSessionMeta) {
      liveSessionMeta.textContent =
        courseTitle;
    }

    if (currentSessionTitle) {
      currentSessionTitle.textContent =
        session.title;
    }

    if (currentSessionDescription) {
      currentSessionDescription.textContent =
        session.description ||
        "Join the live class and learn with your mentor.";
    }

    if (sessionTags) {
      sessionTags.innerHTML =
        `
        <span>${courseTitle}</span>
        <span>Live Class</span>
        <span>${session.status}</span>
        `;
    }

    if (recordingPath) {
      recordingPath.textContent =
        `${courseTitle} → Live Recording`;
    }

    if (classNotesList) {
      classNotesList.innerHTML =
        `
        <li>Class notes will be shared by mentor.</li>
        <li>Recording may be added after session ends.</li>
        `;
    }

    if (downloadNotesBtn) {
      downloadNotesBtn.onclick = (e) => {
        e.preventDefault();

        if (!session.notesUrl) {
          alert("Notes not available yet.");
          return;
        }

        window.open(session.notesUrl, "_blank");
      };
    }
  }

  function startJitsi(session) {

  if (!jitsiContainer) return;

  // Agar wahi meeting already open hai to dobara load mat karo
  if (currentLiveSessionId === session._id) {
    return;
  }

  currentLiveSessionId = session._id;

  if (typeof JitsiMeetExternalAPI === "undefined") {

    jitsiContainer.innerHTML =
      "<p>Jitsi failed to load.</p>";

    return;

  }

  jitsiContainer.innerHTML = "";

  if (jitsiApi) {
    jitsiApi.dispose();
  }

  jitsiApi =
    new JitsiMeetExternalAPI(
      "meet.jit.si",
      {

        roomName: session.roomName,

        width: "100%",

        height: 700,

        parentNode: jitsiContainer,

        userInfo: {
          displayName: "SkilledTrader Student"
        },

        configOverwrite: {
          startWithAudioMuted: true,
          startWithVideoMuted: true
        }

      }
    );

}
  function renderUpcomingSessions(sessions) {
    if (!upcomingGrid) return;

    const upcomingSessions =
      sessions.filter((session) => {
        return session.status === "upcoming";
      });

    if (upcomingSessions.length === 0) {
      upcomingGrid.innerHTML =
        `
        <div class="upcoming-card">
          <div class="upcoming-date">No Session</div>
          <h3>No upcoming sessions</h3>
          <p>Please check again later.</p>
          <span>--</span>
        </div>
        `;
      return;
    }

    upcomingGrid.innerHTML = "";

    upcomingSessions.forEach((session, index) => {
      const courseTitle =
        session.course
          ? session.course.title
          : "SkilledTrader Course";

      const date =
        new Date(session.sessionDate);

      const card =
        document.createElement("div");

      card.className =
        index === 0
          ? "upcoming-card active-session"
          : "upcoming-card";

      card.innerHTML =
        `
        <div class="upcoming-date">
          ${date.toLocaleDateString()}
        </div>

        <h3>
          ${session.title}
        </h3>

        <p>
          ${courseTitle}
        </p>

        <span>
          ${date.toLocaleTimeString()}
        </span>
        `;

      card.addEventListener("click", () => {
        document
          .querySelectorAll(".upcoming-card")
          .forEach((item) => {
            item.classList.remove("active-session");
          });

        card.classList.add("active-session");
      });

      upcomingGrid.appendChild(card);
    });
  }

  const liveDot =
    document.querySelector(".live-dot");

  if (liveDot) {
    setInterval(() => {
      liveDot.classList.toggle("blink");
    }, 700);
  }

  loadLiveSessions();

  setInterval(() => {
  loadLiveSessions();
}, 10000);

});