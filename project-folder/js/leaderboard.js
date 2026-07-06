document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("leaderboardSearch");
  const rows = document.querySelectorAll(".table-row:not(.table-head)");
  const filterButtons = document.querySelectorAll(".filter-btn");

  if(searchInput){
    searchInput.addEventListener("keyup", () => {
      const value = searchInput.value.toLowerCase();

      rows.forEach((row) => {
        const student = row.children[1].innerText.toLowerCase();
        row.style.display = student.includes(value) ? "grid" : "none";
      });
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.innerText.toLowerCase();

      rows.forEach((row) => {
        const category = row.dataset.category;

        if(filter === "all"){
          row.style.display = "grid";
        }else if(category === filter){
          row.style.display = "grid";
        }else{
          row.style.display = "none";
        }
      });
    });
  });

  document.querySelectorAll(".rank-card").forEach((card) => {
    card.addEventListener("click", () => {
      alert("Student profile preview will be connected after backend integration.");
    });
  });

});