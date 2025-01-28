const button = document.getElementById('pobierzDane');
const button2 = document.getElementById('aktualizujDane')
const button3 = document.getElementById("dodajDane")
const button4 = document.getElementById("usunDane")
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
    if (proposedOcena >= 0 && proposedOcena <=10) {
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
    }
    else {
        window.alert("Podaj poprawne dane")
    }
    

});

button3.addEventListener('click', () => {
    const name = prompt("Podaj nazwę produktu")
    const image = prompt("Podaj ścieżkę do zdjęcia produktu")
    const rentownosc = prompt("Podaj rentownosc produktu")
    const ocena = prompt("Podaj ocenę produktu")
    const typ = prompt("Podaj typ produktu")
    fetch('/dodajRekord', {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            name:name,
            image:image,
            rentownosc:rentownosc,
            ocena:ocena,
            typ:typ
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Dane dodane do MongoDB:', data);
    })
    .catch(error => console.error('Błąd:', error));

    

});

button4.addEventListener("click", () => {
    const id = prompt("Podaj ID do usunięcia")
    fetch('/danedous/' + id, {
        method: "DELETE",
    })
    .then(response => response.json())
    .catch(error => console.error('Błąd:', error));
});
