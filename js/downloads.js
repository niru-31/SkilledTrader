document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     SEARCH DOWNLOADS
  ========================================= */

  const searchInput =
    document.getElementById("downloadSearch");

  const downloadCards =
    document.querySelectorAll(".download-card");

  if(searchInput){

    searchInput.addEventListener("keyup", () => {

      const searchValue =
        searchInput.value.toLowerCase();

      downloadCards.forEach((card) => {

        const title =
          card.querySelector("h3")
          .innerText
          .toLowerCase();

        if(title.includes(searchValue)){

          card.style.display = "flex";

        }else{

          card.style.display = "none";

        }

      });

    });

  }


  /* =========================================
     FILTER DOWNLOADS
  ========================================= */

  const filterButtons =
    document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

      filterButtons.forEach((btn) => {

        btn.classList.remove("active");

      });

      button.classList.add("active");

      const filter =
        button.innerText.toLowerCase();

      downloadCards.forEach((card) => {

        const category =
          card.dataset.category;

        if(filter === "all"){

          card.style.display = "flex";

        }

        else if(category === filter){

          card.style.display = "flex";

        }

        else{

          card.style.display = "none";

        }

      });

    });

  });


  /* =========================================
     DOWNLOAD BUTTON
  ========================================= */

  const downloadButtons =
    document.querySelectorAll(".download-btn");

  downloadButtons.forEach((button) => {

    button.addEventListener("click", () => {

      const fileName =
        button.closest(".download-card")
        .querySelector("h3")
        .innerText;

      alert(
        `${fileName} download started.\n\nBackend ke baad actual PDF/file download hoga.`
      );

    });

  });


  /* =========================================
     LOCKED FILE
  ========================================= */

  const lockedButtons =
    document.querySelectorAll(".locked-btn");

  lockedButtons.forEach((button) => {

    button.addEventListener("click", () => {

      alert(
        "This resource is locked. Complete the required course to unlock it."
      );

    });

  });


  /* =========================================
     CARD SELECT EFFECT
  ========================================= */

  downloadCards.forEach((card) => {

    card.addEventListener("click", () => {

      downloadCards.forEach((item) => {

        item.classList.remove("selected-download");

      });

      card.classList.add("selected-download");

    });

  });


  /* =========================================
     STATS ANIMATION
  ========================================= */

  const statNumbers =
    document.querySelectorAll(".stat-card h2");

  statNumbers.forEach((stat) => {

    const originalText =
      stat.innerText;

    const target =
      parseInt(originalText);

    if(isNaN(target)) return;

    let count = 0;

    const timer =
      setInterval(() => {

        count++;

        stat.innerText =
          count;

        if(count >= target){

          stat.innerText =
            originalText;

          clearInterval(timer);

        }

      }, 50);

  });

});