async function register() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    const res = await apiCall("auth/register", "POST", {
      username,
      email,
      password
    });
  
    document.getElementById("msg").innerText = res.message;
  }
  
  async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    const res = await apiCall("auth/login", "POST", { email, password });
  
    if (res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("userId", res.userId);
      window.location.href = "chat.html";
    }
  }
  