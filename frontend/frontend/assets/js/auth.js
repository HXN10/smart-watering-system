function getToken() {
    return localStorage.getItem("token");
  }
  
  function requireAuth() {
    if (!getToken()) {
      window.location.href = "./";
    }
  }
  