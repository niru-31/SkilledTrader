document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     SMOOTH SCROLL BUTTONS
  ========================================= */

  const outlookBtn =
    document.querySelector(".btn-primary");

  const watchlistBtn =
    document.querySelector(".btn-secondary");

  if(outlookBtn){

    outlookBtn.addEventListener("click", (e) => {

      e.preventDefault();

      const outlookSection =
        document.querySelector("#outlook");

      if(outlookSection){

        outlookSection.scrollIntoView({
          behavior:"smooth"
        });

      }

    });

  }

  if(watchlistBtn){

    watchlistBtn.addEventListener("click", (e) => {

      e.preventDefault();

      const watchlistSection =
        document.querySelector("#watchlist");

      if(watchlistSection){

        watchlistSection.scrollIntoView({
          behavior:"smooth"
        });

      }

    });

  }


  /* =========================================
     WATCHLIST CARD EFFECT
  ========================================= */

  const watchCards =
    document.querySelectorAll(".watch-card");

  watchCards.forEach((card) => {

    card.addEventListener("click", () => {

      watchCards.forEach((item) => {

        item.classList.remove("active-watch");

      });

      card.classList.add("active-watch");

    });

  });


  /* =========================================
     OUTLOOK CARD EFFECT
  ========================================= */

  const outlookCards =
    document.querySelectorAll(".outlook-card");

  outlookCards.forEach((card) => {

    card.addEventListener("mouseenter", () => {

      card.style.transform =
        "translateY(-8px)";

    });

    card.addEventListener("mouseleave", () => {

      card.style.transform =
        "translateY(0px)";

    });

  });


  /* =========================================
     PDF DOWNLOAD BUTTON
  ========================================= */

  const downloadBtn =
    document.querySelector(".download-btn");

  if(downloadBtn){

    downloadBtn.addEventListener("click", (e) => {

      e.preventDefault();

      alert(
        "Weekly Outlook PDF will be connected after backend integration."
      );

    });

  }


  /* =========================================
     COUNTER EFFECT
  ========================================= */

  const numbers =
    document.querySelectorAll(
      ".summary-list strong"
    );

  numbers.forEach((item) => {

    item.style.opacity = "0";

    setTimeout(() => {

      item.style.transition =
        "0.5s";

      item.style.opacity = "1";

    }, 300);

  });


  /* =========================================
     CTA BUTTON
  ========================================= */

  const ctaBtn =
    document.querySelector(".cta-card a");

  if(ctaBtn){

    ctaBtn.addEventListener("click", () => {

      console.log(
        "Redirecting to Free Course..."
      );

    });

  }

});