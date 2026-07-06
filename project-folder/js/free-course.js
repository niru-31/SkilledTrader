document.addEventListener("DOMContentLoaded", () => {

  const moduleGroups = document.querySelectorAll(".module-group");
  const moduleTitles = document.querySelectorAll(".module-title");
  const chapterItems = document.querySelectorAll(".chapter-item");

  const courseVideo = document.querySelector("#courseVideo");
  const lessonTitle = document.querySelector("#lessonTitle");
  const lessonMeta = document.querySelector("#lessonMeta");
  const lessonDescription = document.querySelector("#lessonDescription");

  const markReadBtn = document.querySelector(".mark-read-btn");
  const progressPercent = document.querySelector("#progressPercent");
  const progressText = document.querySelector("#progressText");
  const progressFill = document.querySelector(".progress-fill");

  const totalChapters = chapterItems.length;

  let completedChapters =
    JSON.parse(localStorage.getItem("freeCourseCompletedChapters")) || [];

  let activeChapterIndex =
    Number(localStorage.getItem("freeCourseActiveChapter")) || 0;

  const descriptions = [
    "Understand what the stock market is and how beginners should start learning safely.",
    "Learn the basics of NSE, BSE and SEBI in the Indian market.",
    "Understand equity, index, sectors and basic market structure.",

    "Learn the difference between trading and investing.",
    "Understand short-term and long-term market mindset.",
    "Choose the right beginner path before moving to advanced concepts.",

    "Learn how candlesticks are formed on a chart.",
    "Understand bullish and bearish candles.",
    "Learn basic candlestick patterns for beginners.",

    "Understand what support is and why price reacts there.",
    "Understand what resistance is and why sellers become active there.",
    "Learn how to mark important support and resistance levels.",

    "Learn basic position sizing.",
    "Understand stop loss and risk reward.",
    "Build discipline, patience and emotional control."
  ];

  function updateActiveChapter(index) {
    chapterItems.forEach((item) => {
      item.classList.remove("active");
    });

    const currentChapter = chapterItems[index];

    if (!currentChapter) return;

    currentChapter.classList.add("active");

    const parentModule = currentChapter.closest(".module-group");

    moduleGroups.forEach((module) => {
      module.classList.remove("active");
    });

    if (parentModule) {
      parentModule.classList.add("active");
    }

    const videoSrc = currentChapter.dataset.video;
    const title = currentChapter.dataset.title;
    const meta = currentChapter.dataset.meta;

    if (courseVideo && videoSrc) {
      const source = courseVideo.querySelector("source");
      source.src = videoSrc;
      courseVideo.load();
    }

    if (lessonTitle) {
      lessonTitle.textContent = title;
    }

    if (lessonMeta) {
      lessonMeta.textContent = meta;
    }

    if (lessonDescription) {
      lessonDescription.textContent =
        descriptions[index] || "Continue learning this chapter.";
    }

    activeChapterIndex = index;

    localStorage.setItem(
      "freeCourseActiveChapter",
      activeChapterIndex
    );

    updateButtonState();
  }

  function updateProgress() {
    const completedCount = completedChapters.length;

    const percent = Math.round(
      (completedCount / totalChapters) * 100
    );

    if (progressPercent) {
      progressPercent.textContent = `${percent}%`;
    }

    if (progressText) {
      progressText.textContent =
        `${completedCount} of ${totalChapters} chapters completed`;
    }

    if (progressFill) {
      progressFill.style.width = `${percent}%`;
    }

    chapterItems.forEach((item, index) => {
      const icon = item.querySelector("span");

      if (completedChapters.includes(index)) {

        item.classList.add("completed");

        if (icon) {
          icon.textContent = "✓";
        }

      } else {

        item.classList.remove("completed");

        if (icon) {
          icon.textContent =
            item.classList.contains("active") ? "▶" : "○";
        }

      }
    });

    localStorage.setItem(
      "freeCourseCompletedChapters",
      JSON.stringify(completedChapters)
    );
  }

  function updateButtonState() {
    if (!markReadBtn) return;

    if (completedChapters.includes(activeChapterIndex)) {
      markReadBtn.textContent = "Chapter Completed";
      markReadBtn.disabled = true;
    } else {
      markReadBtn.textContent = "Mark Chapter as Read";
      markReadBtn.disabled = false;
    }
  }

  moduleTitles.forEach((title) => {
    title.addEventListener("click", () => {

      const module = title.closest(".module-group");

      if (!module) return;

      module.classList.toggle("active");

    });
  });

  chapterItems.forEach((chapter, index) => {
    chapter.addEventListener("click", () => {
      updateActiveChapter(index);
      updateProgress();
    });
  });

  if (markReadBtn) {
    markReadBtn.addEventListener("click", () => {

      if (!completedChapters.includes(activeChapterIndex)) {
        completedChapters.push(activeChapterIndex);

        updateProgress();
        updateButtonState();
      }

    });
  }

  updateActiveChapter(activeChapterIndex);
  updateProgress();

});

