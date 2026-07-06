document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     SEARCH ASSIGNMENTS
  ========================================= */

  const searchInput =
    document.getElementById("assignmentSearch");

  const assignmentCards =
    document.querySelectorAll(".assignment-card");

  if(searchInput){

    searchInput.addEventListener("keyup", () => {

      const searchValue =
        searchInput.value.toLowerCase();

      assignmentCards.forEach((card) => {

        const title =
          card.querySelector("h3")
          .innerText
          .toLowerCase();

        if(title.includes(searchValue)){

          card.style.display = "block";

        }else{

          card.style.display = "none";

        }

      });

    });

  }


  /* =========================================
     FILTER ASSIGNMENTS
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

      assignmentCards.forEach((card) => {

        const status =
          card.dataset.status;

        if(filter === "all"){

          card.style.display = "block";

        }

        else if(status === filter){

          card.style.display = "block";

        }

        else{

          card.style.display = "none";

        }

      });

    });

  });


  /* =========================================
     FILE UPLOAD PREVIEW
  ========================================= */

  const uploadInputs =
    document.querySelectorAll(".upload-box input");

  uploadInputs.forEach((input) => {

    input.addEventListener("change", () => {

      const file =
        input.files[0];

      if(!file){
        return;
      }

      const uploadBox =
        input.parentElement;

      uploadBox.innerHTML =
        `✅ ${file.name} selected`;

      uploadBox.style.borderColor =
        "#2E7D5B";

      uploadBox.style.background =
        "#EAF6EF";

      uploadBox.style.color =
        "#2E7D5B";

      alert(
        "Assignment file selected. Backend ke baad ye file server par upload hogi."
      );

    });

  });


  /* =========================================
     VIEW SUBMISSION / FEEDBACK BUTTONS
  ========================================= */

  const viewButtons =
    document.querySelectorAll(".view-btn");

  viewButtons.forEach((button) => {

    button.addEventListener("click", () => {

      alert(
        "Submission details and mentor feedback backend ke baad open honge."
      );

    });

  });


  /* =========================================
     CARD SELECT EFFECT
  ========================================= */

  assignmentCards.forEach((card) => {

    card.addEventListener("click", () => {

      assignmentCards.forEach((item) => {

        item.classList.remove("selected-assignment");

      });

      card.classList.add("selected-assignment");

    });

  });

});