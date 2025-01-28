const login_button = document.getElementById("login-button")
const register_button = document.getElementById("register-button")

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
      console.log('Dane dodane do MongoDB:', data);
      console.log("Pomyslna rejestracja");
  })
  .catch(error => console.error('Błąd:', error));

  

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
        const data = await response.json();
        if (data.message) {
            alert(data.message); // Wyświetlenie komunikatu
        }}

      } catch (error) {
        console.log(error)

  }


});