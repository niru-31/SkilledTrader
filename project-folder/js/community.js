document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     SMOOTH SCROLL
  ========================================= */

  const joinBtn =
    document.querySelector(".primary-btn");

  const benefitsBtn =
    document.querySelector(".secondary-btn");

  if(joinBtn){

    joinBtn.addEventListener("click", (e) => {

      e.preventDefault();

      const joinSection =
        document.querySelector("#join");

      if(joinSection){

        joinSection.scrollIntoView({
          behavior:"smooth"
        });

      }

    });

  }

  if(benefitsBtn){

    benefitsBtn.addEventListener("click", (e) => {

      e.preventDefault();

      const benefitsSection =
        document.querySelector("#benefits");

      if(benefitsSection){

        benefitsSection.scrollIntoView({
          behavior:"smooth"
        });

      }

    });

  }


  /* =========================================
     BENEFIT CARD HOVER
  ========================================= */

  const benefitCards =
    document.querySelectorAll(".benefit-card");

  benefitCards.forEach((card) => {

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
     RULE CARD EFFECT
  ========================================= */

  const ruleCards =
    document.querySelectorAll(".rule-card");

  ruleCards.forEach((card) => {

    card.addEventListener("click", () => {

      card.style.background =
        "#2E7D5B";

      card.style.color =
        "#ffffff";

      setTimeout(() => {

        card.style.background =
          "#ffffff";

        card.style.color =
          "#111111";

      }, 500);

    });

  });


  /* =========================================
     ACTIVITY CARD ACTIVE
  ========================================= */

  const activities =
    document.querySelectorAll(".activity-item");

  activities.forEach((activity) => {

    activity.addEventListener("click", () => {

      activities.forEach((item) => {

        item.classList.remove("active");

      });

      activity.classList.add("active");

    });

  });


  /* =========================================
     COMMUNITY JOIN BUTTON
  ========================================= */

  const communityJoinBtn =
    document.querySelector(".join-btn");

  if(communityJoinBtn){

    communityJoinBtn.addEventListener("click", (e) => {

      e.preventDefault();

      alert(
        "Community joining system will be connected with WhatsApp / Discord in backend."
      );

    });

  }


  /* =========================================
     COUNTER ANIMATION
  ========================================= */

  const stats =
    document.querySelectorAll(".community-stat h2");

  stats.forEach((stat) => {

    const finalValue =
      parseInt(stat.innerText);

    if(isNaN(finalValue)) return;

    let current = 0;

    const timer =
      setInterval(() => {

        current += Math.ceil(finalValue / 30);

        if(current >= finalValue){

          current = finalValue;

          clearInterval(timer);

        }

        stat.innerText =
          current + "+";

      }, 50);

  });

});