const login_button = document.getElementById("login-button")
const register_button = document.getElementById("register-button")
const register_message = document.getElementById("register-message");
const login_message = document.getElementById("login-message");

register_button.addEventListener('click', () => {
  const login = document.getElementById("register-username").value
  const password = document.getElementById("register-password").value

  fetch('/dodajUzytkownik', {
      method: "POST",
      headers: {
          "Content-Type":"application/json"
      },
      body: JSON.stringify({
        login:login,
        password:password
      })
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === "Propozycja zapisana") {
      register_message.textContent = "Rejestracja udana!";
      register_message.style.color = "green";
    } else {
      register_message.textContent = "Istnieje już taki użytkownik!";
      register_message.style.color = "red";
    }
  })
  .catch(error => {
    console.error('Błąd:', error);
    register_message.textContent = "Rejestracja nie udana :(";
    register_message.style.color = "red";
  });
});

login_button.addEventListener('click', async () => {
  const login = document.getElementById("login-username").value
  const password = document.getElementById("login-password").value

  try {
    const response = await fetch('/login', {
      method: "POST",
      headers: {
          "Content-Type":"application/json"
      },
      body: JSON.stringify({
        login:login,
        password:password
      })})

      if (response.redirected) {
        // Przekierowanie na inną stronę
        window.location.href = response.url;
      } else {
        if (data.message) {
          login_message.textContent = "Błędny login/hasło";
          login_message.style.color = "red";
        }
      }
    } catch (error) {
      console.log(error);
      login_message.textContent = "Błędny login/hasło";
      login_message.style.color = "red";
    }


});
