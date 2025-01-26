const button = document.getElementById('pobierzDane');
const button2 = document.getElementById('aktualizujDane')
const tabela_baza = document.getElementById("Tabela_baza").getElementsByTagName('tbody')[1]

button.addEventListener('click', () => {
    fetch('/dane') // Żądanie do endpointu /dane
        .then(response => response.json())
        .then(data => {
            console.log('Dane z MongoDB:', data);
            // Tutaj możesz dodać kod do wyświetlania danych na stronie
            console.log(data.length)
            wyswietlDanewTabeli(data)
        })
        .catch(error => console.error('Błąd:', error));
});

function wyswietlDanewTabeli(dane){
    console.log("test")
    tabela_baza.innerHTML = '';
    for(let i = 0;i<dane.length;i++){
        const wiersz = tabela_baza.insertRow()
        const idKomorka = wiersz.insertCell()
        const imageKomorka = wiersz.insertCell()
        const nameKomorka = wiersz.insertCell()
        const rentownoscKomorka = wiersz.insertCell()
        const ocenaKomorka = wiersz.insertCell()


        idKomorka.textContent = dane[i].id

        const img = document.createElement("img")
        img.src = dane[i].image
        imageKomorka.appendChild(img)
        img.style.maxWidth = "50px"
        nameKomorka.textContent = dane[i].name
        rentownoscKomorka.textContent = dane[i].rentownosc
        ocenaKomorka.textContent = dane[i].ocena

    }
}

button2.addEventListener('click', () => {
    const id = prompt("Podaj ID produktu")
    const proposedOcena = prompt("Podaj oceną produktu")

    fetch('/proposeUpdate', {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            id:parseFloat(id),
            proposedOcena:proposedOcena,
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Dane do MongoDB:', data);
    })
    .catch(error => console.error('Błąd:', error));
});