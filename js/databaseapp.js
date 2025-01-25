const button = document.getElementById('pobierzDane');

button.addEventListener('click', () => {
    fetch('/dane') // Żądanie do endpointu /dane
        .then(response => response.json())
        .then(data => {
            console.log('Dane z MongoDB:', data);
            // Tutaj możesz dodać kod do wyświetlania danych na stronie
        })
        .catch(error => console.error('Błąd:', error));
});