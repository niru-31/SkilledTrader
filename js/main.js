// CHECK LOGIN
if(localStorage.getItem("loggedIn") !== "true"){
  window.location.href = "login.html";
}


// NAVBAR SCROLL EFFECT
const nav = document.getElementById("nav");

if(nav){

  window.addEventListener("scroll", () => {

    nav.classList.toggle("scrolled", window.scrollY > 50);

  });

}


// SCROLL REVEAL
const revealObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if(entry.isIntersecting){

        entry.target.classList.add("visible");

        revealObserver.unobserve(entry.target);

      }

    });

  },
  { threshold:0.1 }
);

document.querySelectorAll(".reveal").forEach((el) => {

  revealObserver.observe(el);

});


// LOGOUT
function logout(){

  localStorage.removeItem("loggedIn");

  window.location.href = "login.html";

}


// MOBILE HAMBURGER MENU
document.addEventListener("DOMContentLoaded", () => {

  const hamburger =
    document.getElementById("hamburger");

  const navLinks =
    document.querySelector(".nav-links");

  if(hamburger && navLinks){

    hamburger.addEventListener("click", () => {

      navLinks.classList.toggle("active");

    });

  }

});