// Pobieranie elementów DOM związanych z suwakami i polami input
let slider_pojemnosc = document.getElementById("slider-pojemnosc")
let input_pojemnosc = document.getElementById("input-pojemnosc")

let slider_zawartosc = document.getElementById("slider-zawartosc")
let input_zawartosc = document.getElementById("input-zawartosc")

let input_cena = document.getElementById("input-cena")

// Ustawienie początkowej wartości pola input_pojemnosc na wartość suwaka
input_pojemnosc.value = slider_pojemnosc.value

// Funkcja obliczająca gramaturę i opłacalność na podstawie wartości z suwaków i inputów
let funkcja_obliczajaca = function() {
    let pojemnosc = parseFloat(slider_pojemnosc.value)
    let zawartosc = parseFloat(slider_zawartosc.value)*0.01
    let cena = parseFloat(input_cena.value)
    let gramatura = pojemnosc*zawartosc
    gramatura = gramatura.toFixed(2)
    let oplacalnosc = gramatura/cena
    oplacalnosc = oplacalnosc.toFixed(2)
    let etanol = document.getElementById("etanol")
    
    let rentownoschtml = document.getElementById("rentownosc")
    etanol.innerHTML = gramatura
    rentownoschtml.innerHTML = oplacalnosc 
}

// Obsługa zdarzenia zmiany pojemnosci
slider_pojemnosc.oninput = function () {
    input_pojemnosc.value = this.value
    funkcja_obliczajaca()
}

input_pojemnosc.oninput = function() {
    if (input_pojemnosc.value > 1000) {
        input_pojemnosc.value = 1000
    }
    if (input_pojemnosc.value < 10) {
        input_pojemnosc.value = 10
    }
    slider_pojemnosc.value = this.value
    funkcja_obliczajaca()
}

// Obsługa zdarzenia zmiany zawartości
slider_zawartosc.oninput = function() {
    input_zawartosc.value = this.value
    funkcja_obliczajaca()
}

input_zawartosc.oninput = function() {
    if (input_zawartosc.value > 1000) {
        input_zawartosc.value = 1000
    }
    if (input_zawartosc.value < 10) {
        input_zawartosc.value = 10
    }
    slider_zawartosc.value = this.value
    funkcja_obliczajaca()
}

// Obsługa zdarzenia zmiany ceny
input_cena.oninput = function() {
    if (input_cena.value > 10000) {
        input_cena.value = 10000
    }
    if (input_cena.value < 0) {
        input_cena.value = 0
    }
    funkcja_obliczajaca()
}

// Pobieranie elementów DOM związanych z wyświetlaniem podobnych produktów
let finder2 = document.getElementById("finder")
let podobne1nazwa = document.getElementById("podobne-nazwa1")
let podobne1img = document.getElementById("podobne-image1")
let podobne1rent = document.getElementById("podobne-rent1")
let podobne2nazwa = document.getElementById("podobne-nazwa2")
let podobne2img = document.getElementById("podobne-image2")
let podobne2rent = document.getElementById("podobne-rent2")

// Funkcja czyszcząca zawartość elementów wyświetlających podobne produkty
function czyszczenie() {
    podobne1nazwa.innerHTML = ""
    podobne1img.src = ""
    podobne1rent.innerHTML = ""
    podobne2nazwa.innerHTML = ""
    podobne2img.scr = ""
    podobne2rent.innerHTML = ""
}

// Funkcja wyświetlająca dane podobnych produktów
function wyswietlDanewPodobne(dane){
    let testArray = []
    console.log("Wyswietlam dane podobne")
    czyszczenie()
    let g = parseFloat(document.getElementById("rentownosc").innerHTML)
    for(let i = 0;i<dane.length;i++) {
        let a = dane[i]
        let b=a.name
        let c =a.rentownosc-g
        c = Math.abs(c)
        c = parseFloat(c)
        d = a.image,
        e = a.rentownosc,
        f = a.ocena
        h = a.typ
        let obj = {
        name:b,
        image:d,
        rentownosc:e,
        ocena:f,
        typ:h,
        odleglosc:c

        }
        testArray.push(obj)
        
        
    }
    // Sortowanie produktów według odległości od aktualnej rentowności
    testArray = testArray.sort((a,b)=> a.odleglosc - b.odleglosc)
    let obj1 = testArray[0]
    let obj2 = testArray[1]
    podobne1nazwa.innerHTML = obj1.name
    podobne1img.src = obj1.image
    podobne1rent.innerHTML = obj1.rentownosc
    podobne2nazwa.innerHTML = obj2.name
    podobne2img.src = obj2.image
    podobne2rent.innerHTML = obj2.rentownosc
}

let oblicz = function () {
    console.log("dupa")
}

finder2.onclick = oblicz()


finder2.addEventListener('click', () => {
    fetch('/danepodobne') // Żądanie do endpointu /dane
        .then(response => response.json())
        .then(data => {
            console.log(data.length)
            wyswietlDanewPodobne(data)
        })
        .catch(error => console.error('Błąd:', error));
});
