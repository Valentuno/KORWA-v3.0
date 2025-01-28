function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
  
    // Prosty przykład weryfikacji (w rzeczywistości dane powinny być sprawdzane na backendzie)
    if (username === 'admin' && password === '1234') {
      alert('Zalogowano pomyślnie!');
    } else {
      errorMessage.textContent = 'Nieprawidłowa nazwa użytkownika lub hasło';
    }
  }
  