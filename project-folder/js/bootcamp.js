document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     COUNTDOWN TIMER
  ========================================= */

  const daysEl =
    document.getElementById("days");

  const hoursEl =
    document.getElementById("hours");

  const minutesEl =
    document.getElementById("minutes");

  const secondsEl =
    document.getElementById("seconds");

  const targetDate =
    new Date().getTime() +
    (3 * 24 * 60 * 60 * 1000);

  function updateCountdown(){

    const now =
      new Date().getTime();

    const distance =
      targetDate - now;

    const days =
      Math.floor(
        distance / (1000 * 60 * 60 * 24)
      );

    const hours =
      Math.floor(
        (distance % (1000 * 60 * 60 * 24))
        / (1000 * 60 * 60)
      );

    const minutes =
      Math.floor(
        (distance % (1000 * 60 * 60))
        / (1000 * 60)
      );

    const seconds =
      Math.floor(
        (distance % (1000 * 60))
        / 1000
      );

    if(daysEl){
      daysEl.textContent =
        String(days).padStart(2, "0");
    }

    if(hoursEl){
      hoursEl.textContent =
        String(hours).padStart(2, "0");
    }

    if(minutesEl){
      minutesEl.textContent =
        String(minutes).padStart(2, "0");
    }

    if(secondsEl){
      secondsEl.textContent =
        String(seconds).padStart(2, "0");
    }

  }

  setInterval(updateCountdown, 1000);

  updateCountdown();


  /* =========================================
     SMOOTH SCROLL BUTTONS
  ========================================= */

  const registerBtn =
    document.querySelector(".btn-primary");

  if(registerBtn){

    registerBtn.addEventListener("click", (e) => {

      e.preventDefault();

      const registerSection =
        document.querySelector("#register");

      if(registerSection){

        registerSection.scrollIntoView({
          behavior:"smooth"
        });

      }

    });

  }

  const agendaBtn =
    document.querySelector(".btn-secondary");

  if(agendaBtn){

    agendaBtn.addEventListener("click", (e) => {

      e.preventDefault();

      const agendaSection =
        document.querySelector("#agenda");

      if(agendaSection){

        agendaSection.scrollIntoView({
          behavior:"smooth"
        });

      }

    });

  }


  /* =========================================
     REGISTER FORM
  ========================================= */

  const registerForm =
    document.querySelector(".register-form");

  if(registerForm){

    registerForm.addEventListener("submit", (e) => {

      e.preventDefault();

      const name =
        document.getElementById("bootName");

      const email =
        document.getElementById("bootEmail");

      const phone =
        document.getElementById("bootPhone");

      const level =
        document.getElementById("bootLevel");

      if(
        !name.value ||
        !email.value ||
        !phone.value ||
        !level.value
      ){

        alert(
          "Please fill all details."
        );

        return;

      }

      alert(
        "Bootcamp registration successful!"
      );

      registerForm.reset();

    });

  }


  /* =========================================
     AGENDA CARD ACTIVE EFFECT
  ========================================= */

  const agendaCards =
    document.querySelectorAll(".agenda-card");

  agendaCards.forEach((card) => {

    card.addEventListener("click", () => {

      agendaCards.forEach((item) => {

        item.classList.remove("active-agenda");

      });

      card.classList.add("active-agenda");

    });

  });


  /* =========================================
     TESTIMONIAL HOVER EFFECT
  ========================================= */

  const testimonialCards =
    document.querySelectorAll(".testimonial-card");

  testimonialCards.forEach((card) => {

    card.addEventListener("mouseenter", () => {

      card.style.transform =
        "translateY(-8px)";

    });

    card.addEventListener("mouseleave", () => {

      card.style.transform =
        "translateY(0px)";

    });

  });

});