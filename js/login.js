const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const toggleBtn = document.getElementById("toggleBtn");

const welcomeTitle = document.getElementById("welcomeTitle");
const welcomeText = document.getElementById("welcomeText");

const API_URL = "http://localhost:5000/api/auth";

let isLogin = true;

// TOGGLE LOGIN/SIGNUP
toggleBtn.addEventListener("click", () => {

  if(isLogin){

    loginForm.classList.remove("active-form");
    signupForm.classList.add("active-form");

    welcomeTitle.innerText = "Hello Friend!";
    welcomeText.innerText =
    "Create your account and start your journey with us.";

    toggleBtn.innerText = "Already have an account? Signin.";

  } else {

    signupForm.classList.remove("active-form");
    loginForm.classList.add("active-form");

    welcomeTitle.innerText = "Welcome Back!";
    welcomeText.innerText =
    "Welcome back! We are so happy to have you here.";

    toggleBtn.innerText = "No account yet? Signup.";
  }

  isLogin = !isLogin;
});


// LOGIN WITH BACKEND
loginForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const email =
    loginForm.querySelector('input[type="email"]').value;

  const password =
    document.getElementById("loginPassword").value;

  try{

    const response =
      await fetch(`${API_URL}/login`, {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          email,
          password
        })
      });

    const data =
      await response.json();

    if(!data.success){

      alert(data.message);
      return;

    }

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    alert("Login Successful!");

    window.location.href = "index.html";

  }catch(error){

    console.log(error);
    alert("Backend not connected. Please start backend server.");

  }

});


// SIGNUP WITH BACKEND
signupForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const name =
    signupForm.querySelector('input[type="text"]').value;

  const email =
    signupForm.querySelector('input[type="email"]').value;

  const password =
    document.getElementById("signupPassword").value;

  try{

    const response =
      await fetch(`${API_URL}/register`, {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          name,
          email,
          password
        })
      });

    const data =
      await response.json();

    if(!data.success){

      alert(data.message);
      return;

    }

    alert("Signup Successful! Now please signin.");

    signupForm.classList.remove("active-form");
    loginForm.classList.add("active-form");

    welcomeTitle.innerText = "Welcome Back!";
    welcomeText.innerText =
    "Welcome back! We are so happy to have you here.";

    toggleBtn.innerText = "No account yet? Signup.";

    isLogin = true;

  }catch(error){

    console.log(error);
    alert("Backend not connected. Please start backend server.");

  }

});


/* =========================================
   SHOW / HIDE PASSWORD
========================================= */

const toggleButtons =
document.querySelectorAll(".toggle-password");

toggleButtons.forEach((btn) => {

  btn.addEventListener("click", () => {

    const input =
    document.getElementById(
      btn.dataset.target
    );

    if(input.type === "password"){

      input.type = "text";

      btn.classList.remove("fa-eye");
      btn.classList.add("fa-eye-slash");

    }else{

      input.type = "password";

      btn.classList.remove("fa-eye-slash");
      btn.classList.add("fa-eye");

    }

  });

});