const API_BASE_URL = "http://localhost:5000/api";

function getToken(){
  return localStorage.getItem("token");
}

function getUser(){
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

function requireLogin(){
  const token = getToken();

  if(!token){
    window.location.href = "login.html";
  }
}

function logout(){
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("loggedIn");

  window.location.href = "login.html";
}