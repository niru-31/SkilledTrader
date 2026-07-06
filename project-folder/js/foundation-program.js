document.addEventListener("DOMContentLoaded", () => {

  const modulesContainer = document.getElementById("modulesContainer");
  const courseVideoFrame = document.getElementById("courseVideoFrame");
  const lessonTitle = document.getElementById("lessonTitle");
  const lessonMeta = document.getElementById("lessonMeta");
  const lessonDescription = document.getElementById("lessonDescription");

  const markCompleteBtn = document.getElementById("markCompleteBtn");
  const progressPercent = document.getElementById("progressPercent");
  const progressText = document.getElementById("progressText");
  const progressFill = document.querySelector(".progress-fill");

  const certificateCard = document.getElementById("certificateCard");
  const certificateStudentName = document.getElementById("certificateStudentName");
  const certificateCourseName = document.getElementById("certificateCourseName");

  const courseTitle = document.getElementById("courseTitle");
  const courseSubtitle = document.getElementById("courseSubtitle");
  const courseLabel = document.getElementById("courseLabel");

  const viewNotesBtn = document.getElementById("viewNotesBtn");
  const viewAssignmentBtn = document.getElementById("viewAssignmentBtn");
  const resourceModal = document.getElementById("resourceModal");
  const resourceFrame = document.getElementById("resourceFrame");
  const closeResourceBtn = document.getElementById("closeResourceBtn");

  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("courseId");
  const token = localStorage.getItem("token");

  let chapters = [];
  let completedChapters = [];
  let activeChapterId = null;
  let certificateIssued = false;

  if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
  }

  if (!courseId) {
    alert("Course ID missing.");
    window.location.href = "courses.html";
    return;
  }

  async function loadCourse() {
    try {
      const response = await fetch(
        `https://skilled-trader.onrender.com/api/courses/${courseId}`
      );

      const data = await response.json();

      if (!data.success) return;

      const course = data.course;

      if (courseTitle) {
        courseTitle.innerHTML = course.title;
      }

      if (courseSubtitle) {
        courseSubtitle.textContent = course.description;
      }

      if (courseLabel) {
        courseLabel.innerHTML =
          `<span></span>${course.isFree ? "Free Course" : "Premium Program"} · ${course.level}`;
      }

      if (certificateCourseName) {
        certificateCourseName.textContent = course.title;
      }

      const user = JSON.parse(localStorage.getItem("user"));

      if (user && certificateStudentName) {
        certificateStudentName.textContent = user.name;
      }

    } catch (error) {
      console.log(error);
    }
  }

  async function loadChapters() {
    try {
      const response = await fetch(
        `https://skilled-trader.onrender.com/api/chapters/${courseId}`
      );

      const data = await response.json();

      if (!data.success) {
        modulesContainer.innerHTML = "<p>Unable to load chapters.</p>";
        return;
      }

      chapters = data.chapters;

      if (chapters.length === 0) {
        modulesContainer.innerHTML = "<p>No chapters added yet.</p>";
        return;
      }

      renderModules();
      await loadProgress();
      setActiveChapter(chapters[0]);

    } catch (error) {
      console.log(error);
      modulesContainer.innerHTML = "<p>Backend not connected.</p>";
    }
  }

  function renderModules() {
    modulesContainer.innerHTML = "";

    const groupedModules = {};

    chapters.forEach((chapter) => {
      const moduleName = chapter.moduleTitle || "Module 01";

      if (!groupedModules[moduleName]) {
        groupedModules[moduleName] = [];
      }

      groupedModules[moduleName].push(chapter);
    });

    Object.keys(groupedModules).forEach((moduleName, index) => {
      const moduleGroup = document.createElement("div");

      moduleGroup.className =
        index === 0 ? "module-group active" : "module-group";

      const chapterButtons = groupedModules[moduleName]
        .map((chapter) => {
          return `
            <button
              class="chapter-item"
              data-id="${chapter._id}">
              <span>○</span>
              ${chapter.title}
            </button>
          `;
        })
        .join("");

      moduleGroup.innerHTML = `
        <button class="module-title">
          <span>${moduleName}</span>
          Course Module
        </button>

        <div class="chapter-items">
          ${chapterButtons}
        </div>
      `;

      modulesContainer.appendChild(moduleGroup);
    });

    attachModuleEvents();
    attachChapterEvents();
  }

  function attachModuleEvents() {
    const moduleTitles = document.querySelectorAll(".module-title");

    moduleTitles.forEach((title) => {
      title.addEventListener("click", () => {
        const module = title.closest(".module-group");

        if (!module) return;

        module.classList.toggle("active");
      });
    });
  }

  function attachChapterEvents() {
    const chapterItems = document.querySelectorAll(".chapter-item");

    chapterItems.forEach((item) => {
      item.addEventListener("click", () => {
        const chapterId = item.dataset.id;

        const chapter = chapters.find((ch) => ch._id === chapterId);

        if (chapter) {
          setActiveChapter(chapter);
        }
      });
    });
  }

  function setActiveChapter(chapter) {
    activeChapterId = chapter._id;

    const chapterItems = document.querySelectorAll(".chapter-item");

    chapterItems.forEach((item) => {
      item.classList.remove("active");

      if (item.dataset.id === activeChapterId) {
        item.classList.add("active");
      }
    });

    if (courseVideoFrame) {
  courseVideoFrame.src = chapter.videoUrl || "";
}

    if (lessonTitle) {
      lessonTitle.textContent = chapter.title;
    }

    if (lessonMeta) {
      lessonMeta.textContent = chapter.moduleTitle || "Chapter";
    }

    if (lessonDescription) {
      lessonDescription.textContent =
        chapter.description || "Continue learning this chapter.";
    }

    if (viewNotesBtn) {
      viewNotesBtn.onclick = () => {
        if (!chapter.notesUrl) {
          alert("Notes not available.");
          return;
        }

        resourceFrame.src = chapter.notesUrl;
        resourceModal.classList.add("active");
      };
    }

    if (viewAssignmentBtn) {
      viewAssignmentBtn.onclick = () => {
        if (!chapter.assignmentUrl) {
          alert("Assignment not available.");
          return;
        }

        resourceFrame.src = chapter.assignmentUrl;
        resourceModal.classList.add("active");
      };
    }

    updateProgressUI();
    updateButtonState();
  }

  async function loadProgress() {
    try {
      const response = await fetch(
        `https://skilled-trader.onrender.com/api/progress/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (
        data.success &&
        data.progress &&
        data.progress.completedChapters
      ) {
        completedChapters = data.progress.completedChapters.map((ch) => {
          return ch._id || ch;
        });
      }

      updateProgressUI();

    } catch (error) {
      console.log(error);
    }
  }

  async function markChapterComplete() {
    if (!activeChapterId) return;

    try {
      const response = await fetch(
        "https://skilled-trader.onrender.com/api/progress/mark-complete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            courseId,
            chapterId: activeChapterId
          })
        }
      );

      const data = await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      if (!completedChapters.includes(activeChapterId)) {
        completedChapters.push(activeChapterId);
      }

      updateProgressUI();
      updateButtonState();

    } catch (error) {
      console.log(error);
      alert("Progress not saved.");
    }
  }

  function updateProgressUI() {
    const total = chapters.length;
    const completed = completedChapters.length;

    const percent =
      total === 0 ? 0 : Math.round((completed / total) * 100);

    if (progressPercent) {
      progressPercent.textContent = `${percent}%`;
    }

    if (progressText) {
      progressText.textContent =
        `${completed} of ${total} chapters completed`;
    }

    if (progressFill) {
      progressFill.style.width = `${percent}%`;
    }

    const chapterItems = document.querySelectorAll(".chapter-item");

    chapterItems.forEach((item) => {
      const icon = item.querySelector("span");

      if (completedChapters.includes(item.dataset.id)) {
        item.classList.add("completed");

        if (icon) icon.textContent = "✓";
      } else {
        item.classList.remove("completed");

        if (icon) {
          icon.textContent =
            item.classList.contains("active") ? "▶" : "○";
        }
      }
    });

    if (
  percent === 100 &&
  certificateCard
) {
  certificateCard.classList.remove(
    "locked-certificate"
  );

  if (!certificateIssued) {
    certificateIssued = true;
    issueCertificate();
  }
}
  }

  async function issueCertificate() {
  try {
    const response =
      await fetch(
        "https://skilled-trader.onrender.com/api/certificates/issue",
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
  data.success &&
  data.message === "Certificate issued"
) {

  alert(
    "🎉 Congratulations! Your certificate has been unlocked."
  );

}
  } catch (error) {
    console.log(error);
  }
}

  function updateButtonState() {
    if (!markCompleteBtn) return;

    if (completedChapters.includes(activeChapterId)) {
      markCompleteBtn.textContent = "Chapter Completed";
      markCompleteBtn.disabled = true;
    } else {
      markCompleteBtn.textContent = "Mark Chapter as Complete";
      markCompleteBtn.disabled = false;
    }
  }

  if (markCompleteBtn) {
    markCompleteBtn.addEventListener("click", markChapterComplete);
  }

  if (closeResourceBtn) {
    closeResourceBtn.addEventListener("click", () => {
      resourceModal.classList.remove("active");
      resourceFrame.src = "";
    });
  }

  loadCourse();
  loadChapters();

});