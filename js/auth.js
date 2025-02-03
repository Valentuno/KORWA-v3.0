// Pobieranie elementów DOM związanych z przyciskami logowania i rejestracji oraz komunikatami
const login_button = document.getElementById("login-button")
const register_button = document.getElementById("register-button")
const register_message = document.getElementById("register-message");
const login_message = document.getElementById("login-message");

// Obsługa zdarzenia kliknięcia przycisku rejestracji
register_button.addEventListener('click', () => {
  // Pobranie wartości login i hasła z pól input
  const login = document.getElementById("register-username").value
  const password = document.getElementById("register-password").value

  // Wysłanie żądania POST do endpointu /dodajUzytkownik
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
  .then(response => response.json()) // Przetworzenie odpowiedzi na JSON
  .then(data => {
    console.log("Odpowiedź z serwera:", data);
    if (data.message === "Propozycja zapisana") {
      // Jeśli rejestracja się powiodła, wyświetl komunikat 
      register_message.textContent = "Rejestracja udana!";
      register_message.style.color = "green";
    } else {
      // Jeśli użytkownik już istnieje, wyświetl odpowiedni komunikat
      register_message.textContent = "Istnieje już taki użytkownik!";
      register_message.style.color = "red";
    }
  })
  .catch(error => {
    // Obsługa błędów podczas rejestracji
    console.error('Błąd:', error);
    register_message.textContent = "Rejestracja nie udana :(";
    register_message.style.color = "red";
  });
});

// Obsługa zdarzenia kliknięcia przycisku logowania
login_button.addEventListener('click', async () => {
  // Pobranie wartości login i hasła z pól input
  const login = document.getElementById("login-username").value
  const password = document.getElementById("login-password").value

  try {
    // Wysłanie żądania POST do endpointu /login
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
        // Jeśli odpowiedź zawiera przekierowanie, przejdź do nowej strony
        window.location.href = response.url;
      } else {
        // Jeśli nie ma przekierowania, przetwórz odpowiedź jako JSON
        const data = await response.json();
        if (data.message) {
          // Jeśli odpowiedź zawiera komunikat o błędzie, wyświetl go
          login_message.textContent = "Błędny login/hasło";
          login_message.style.color = "red";
        }
      }
    } catch (error) {
      // Obsługa błędów podczas logowania
      console.log(error);
      login_message.textContent = "Błędny login/hasło";
      login_message.style.color = "red";
    }
});
