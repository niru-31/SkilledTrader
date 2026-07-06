document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     PROFILE SAVE
  ========================================= */

  const profileForm =
    document.getElementById("profileForm");

  if(profileForm){

    profileForm.addEventListener("submit", (e) => {

      e.preventDefault();

      alert(
        "Profile updated successfully.\n\nBackend connect hone ke baad data database me save hoga."
      );

    });

  }


  /* =========================================
     PASSWORD UPDATE
  ========================================= */

  const passwordBtn =
    document.getElementById("passwordBtn");

  if(passwordBtn){

    passwordBtn.addEventListener("click", () => {

      const passwordInputs =
        document.querySelectorAll(
          ".security-box input"
        );

      const currentPassword =
        passwordInputs[0].value;

      const newPassword =
        passwordInputs[1].value;

      if(
        currentPassword.trim() === "" ||
        newPassword.trim() === ""
      ){

        alert(
          "Please fill all password fields."
        );

        return;

      }

      if(newPassword.length < 6){

        alert(
          "New password must be at least 6 characters."
        );

        return;

      }

      alert(
        "Password updated successfully.\n\nBackend connect hone ke baad real password change hoga."
      );

      passwordInputs[0].value = "";
      passwordInputs[1].value = "";

    });

  }


  /* =========================================
     PROFILE STATS ANIMATION
  ========================================= */

  const statNumbers =
    document.querySelectorAll(
      ".profile-stats h3"
    );

  statNumbers.forEach((stat) => {

    const target =
      parseInt(stat.innerText);

    if(isNaN(target)) return;

    let count = 0;

    stat.innerText = "0";

    const timer =
      setInterval(() => {

        count++;

        stat.innerText = count;

        if(count >= target){

          clearInterval(timer);

        }

      }, 80);

  });


  /* =========================================
     SUMMARY STATS HOVER
  ========================================= */

  const summaryRows =
    document.querySelectorAll(
      ".summary-list div"
    );

  summaryRows.forEach((row) => {

    row.addEventListener("mouseenter", () => {

      row.style.transform =
        "translateX(6px)";

      row.style.transition =
        ".3s";

    });

    row.addEventListener("mouseleave", () => {

      row.style.transform =
        "translateX(0)";

    });

  });


  /* =========================================
     PROFILE AVATAR CLICK
  ========================================= */

  const avatar =
    document.querySelector(
      ".profile-avatar"
    );

  if(avatar){

    avatar.addEventListener("click", () => {

      alert(
        "Profile photo upload feature Phase 6 backend me add hoga."
      );

    });

  }


  /* =========================================
     LEARNING LEVEL CHANGE
  ========================================= */

  const selects =
    document.querySelectorAll("select");

  selects.forEach((select) => {

    select.addEventListener("change", () => {

      console.log(
        "Updated:",
        select.value
      );

    });

  });


  /* =========================================
     FUTURE BACKEND PLAN
  ========================================= */

  /*
    MongoDB User Collection

    {
      name,
      email,
      phone,
      city,
      learningLevel,
      goal,
      profileImage,
      courses,
      certificates,
      streak,
      score
    }

    Future Features:

    - Upload Profile Photo
    - Edit Bio
    - Social Media Links
    - Change Password
    - Email Verification
    - Account Delete
    - Activity History
  */

});