document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("notificationSearch");
  const cards = document.querySelectorAll(".notification-card");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const markAllBtn = document.getElementById("markAllBtn");

  if(searchInput){
    searchInput.addEventListener("keyup", () => {
      const value = searchInput.value.toLowerCase();

      cards.forEach((card) => {
        const title = card.querySelector("h3").innerText.toLowerCase();

        card.style.display = title.includes(value) ? "flex" : "none";
      });
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.innerText.toLowerCase();

      cards.forEach((card) => {
        const category = card.dataset.category;

        if(filter === "all"){
          card.style.display = "flex";
        }else if(filter === "unread" && card.classList.contains("unread")){
          card.style.display = "flex";
        }else if(category === filter){
          card.style.display = "flex";
        }else{
          card.style.display = "none";
        }
      });
    });
  });

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.remove("unread");

      const status = card.querySelector(".notify-top span");

      if(status){
        status.innerText = "Read";
        status.classList.add("read");
      }
    });
  });

  if(markAllBtn){
    markAllBtn.addEventListener("click", () => {
      cards.forEach((card) => {
        card.classList.remove("unread");

        const status = card.querySelector(".notify-top span");

        if(status){
          status.innerText = "Read";
          status.classList.add("read");
        }
      });

      alert("All notifications marked as read.");
    });
  }

});