document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     SMOOTH SCROLL
  ========================================= */

  const viewStoriesBtn =
    document.querySelector(".btn-primary");

  if(viewStoriesBtn){

    viewStoriesBtn.addEventListener("click", (e) => {

      e.preventDefault();

      const storiesSection =
        document.querySelector("#stories");

      if(storiesSection){

        storiesSection.scrollIntoView({
          behavior:"smooth"
        });

      }

    });

  }


  /* =========================================
     STORY CARD ACTIVE EFFECT
  ========================================= */

  const storyCards =
    document.querySelectorAll(".story-card");

  storyCards.forEach((card) => {

    card.addEventListener("click", () => {

      storyCards.forEach((item) => {

        item.classList.remove("active-story");

      });

      card.classList.add("active-story");

    });

  });


  /* =========================================
     CERTIFICATE CARD EFFECT
  ========================================= */

  const certificateCards =
    document.querySelectorAll(".certificate-card");

  certificateCards.forEach((card) => {

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
     VIDEO REVIEW PLACEHOLDER
  ========================================= */

  const reviewCards =
    document.querySelectorAll(".video-review-card");

  reviewCards.forEach((card, index) => {

    card.addEventListener("click", () => {

      alert(
        "Student Review " +
        (index + 1) +
        " will be connected after backend integration."
      );

    });

  });


  /* =========================================
     COUNTER ANIMATION
  ========================================= */

  const counters =
    document.querySelectorAll(".stat-box h2");

  counters.forEach((counter) => {

    const originalText =
      counter.innerText;

    const finalNumber =
      parseInt(originalText);

    if(isNaN(finalNumber)) return;

    let current = 0;

    const timer =
      setInterval(() => {

        current +=
          Math.ceil(finalNumber / 40);

        if(current >= finalNumber){

          current = finalNumber;

          clearInterval(timer);

        }

        if(originalText.includes("%")){

          counter.innerText =
            current + "%";

        }

        else if(originalText.includes("+")){

          counter.innerText =
            current + "+";

        }

        else{

          counter.innerText =
            current;

        }

      }, 40);

  });


  /* =========================================
     CTA BUTTON
  ========================================= */

  const ctaBtn =
    document.querySelector(".cta-card a");

  if(ctaBtn){

    ctaBtn.addEventListener("click", () => {

      console.log(
        "Redirecting to courses..."
      );

    });

  }

});