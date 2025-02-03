// Importowanie wymaganych modułów
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto-js');

// Inicjalizacja aplikacji Express
const app = express();
const port = 3000;
const uri = 'mongodb://127.0.0.1:27017/db_webapp'; // Twój URI

// Importowanie danych inicjalizacyjnych z pliku baza_init.js
const { AlkoholeArrSortedId, UpdatesArr } = require("./baza_init");

// Łączenie z bazą danych MongoDB
mongoose.connect(uri, {}).then(() => console.log('Połączono z MongoDB'))
    .catch(err => console.error('Błąd połączenia z MongoDB', err));

// Definiowanie schematów Mongoose dla kolekcji Alcohols, Updates i Users
const daneSchemaAlk = new mongoose.Schema({
    id: Number,
    name: String,
    image: String,
    rentownosc: Number,
    ocena: Number,
    typ: String,
});

const daneSchemaUpdate = new mongoose.Schema({
    id: Number,
    proposedOcena: Number,
});

const daneUsers = new mongoose.Schema({
    login: String,
    password: String
});

// Tworzenie modeli Mongoose na podstawie schematów
const DaneAlk = mongoose.model('DaneAlk', daneSchemaAlk, 'Alcohols');
const DaneUpdates = mongoose.model('DaneUpdates', daneSchemaUpdate, 'Updates');
const DaneUsers = mongoose.model("DaneUsers", daneUsers, "Users");

// Funkcja dodająca dane inicjalizacyjne do kolekcji Alcohols, jeśli kolekcja jest pusta
async function pierwszeDodanie() {
    try {
        const count = await DaneAlk.countDocuments({});
        if (count === 0) {
            await DaneAlk.insertMany(AlkoholeArrSortedId);
            console.log("DZIALA");
        } else {
            console.log("Kolekcja nie jest pusta");
        }
    } catch (error) {
        console.error("Błąd dodawania danych", error);
    }
}
pierwszeDodanie();

// Funkcja dodająca dane inicjalizacyjne do kolekcji Updates, jeśli kolekcja jest pusta
async function drugieDodanie() {
    try {
        const count = await DaneUpdates.countDocuments({});
        if (count === 0) {
            await DaneUpdates.insertMany(UpdatesArr);
            console.log("Dodano rekordy do Updates");
        } else {
            console.log("Kolekcja Updates nie jest pusta");
        }
    } catch (error) {
        console.error("Błąd dodawania danych", error);
    }
}
drugieDodanie();

// Obsługa plików statycznych 
app.use(express.static(path.join(__dirname, '..'))); // Cofamy się o jeden katalog

// Endpoint główny, który zwraca plik baza.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'baza.html')); // Ścieżka do baza.html
});

// Endpoint zwracający wszystkie rekordy z kolekcji Alcohols
app.get('/dane', async (req, res) => {
    try {
        const dane = await DaneAlk.find({});
        res.json(dane);
    } catch (error) {
        console.error('Błąd pobierania danych:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera' });
    }
});

// Nasłuchiwanie na określonym porcie
app.listen(port, () => {
    console.log(`Serwer nasłuchuje na porcie ${port}`);
});

// Endpoint do zapisywania proponowanej oceny dla danego alkoholu
app.post("/proposeUpdate", express.json(), async (req, res) => {
    try {
        const { id, proposedOcena } = req.body;
        const newProposal = new DaneUpdates({
            id: parseInt(id),
            proposedOcena,
        });

        let checkexistance = await DaneAlk.find({ id: parseFloat(id) });
        if (checkexistance.length > 0) {
            console.log("ISTNIEJE taki rekord", checkexistance.length);
            await newProposal.save();

            res.status(201).json({ message: "Propozycja zapisana" });
            console.log(newProposal);

            let daneOcen = await DaneUpdates.find({ id: parseFloat(id) });
            let wyliczSrednia = function () {
                let averageOcena = 0;
                let ocenaCount = 0;
                for (let i = 0; i < daneOcen.length; i++) {
                    let ocena = daneOcen[i].proposedOcena;
                    averageOcena = averageOcena + ocena;
                    ocenaCount = ocenaCount + 1;
                }
                let sredniaOcena = averageOcena / ocenaCount;
                console.log(sredniaOcena);
                return sredniaOcena.toFixed(2);
            };

            const alcoholDoZmiany = await DaneAlk.findOneAndUpdate(
                { id: parseFloat(id) },
                { ocena: wyliczSrednia() },
                { new: true }
            );
        } else {
            console.log("Nie ma takiego ID - nie dodano rekordu do kolekcji Updates");
        }
    } catch (error) {
        console.error("Błąd zapisu", error);
        res.status(500).json({ error: "Wystąpił błąd serwera" });
    }
});

// Endpoint do dodawania nowego rekordu do kolekcji Alcohols
app.post("/dodajRekord", express.json(), async (req, res) => {
    try {
        const { name, image, rentownosc, ocena, typ } = req.body;
        let liczbaArray = await DaneAlk.find({});
        const newRecord = new DaneAlk({
            id: liczbaArray.length,
            name,
            image,
            rentownosc,
            ocena,
            typ
        });

        let checkexistance = await DaneAlk.findOne({ name: name });
        console.log("CHECKED", checkexistance);
        if (checkexistance == null) {
            await newRecord.save();
            res.status(201).json({ message: "Propozycja zapisana" });
            console.log("Dodano do bazy", newRecord);
        } else {
            console.log("Istnieje juz taki rekord");
        }
    } catch (error) {
        console.error("Błąd zapisu", error);
        res.status(500).json({ error: "Wystąpił błąd serwera" });
    }
});

// Endpoint do usuwania rekordu z kolekcji Alcohols na podstawie ID
app.delete('/danedous/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let checkexistance = await DaneAlk.findOne({ id: id });
        if (checkexistance) {
            const deletedDocument = await DaneAlk.findOneAndDelete({ id: id });
            res.json({ message: "Usunieto rekord" });
            console.log("USUNELO");
        } else {
            console.log("Takie ID nie istnieje");
        }
    } catch (error) {
        console.error('Błąd pobierania danych:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera' });
    }
});

// Endpoint do dodawania nowego użytkownika do kolekcji Users
app.post("/dodajUzytkownik", express.json(), async (req, res) => {
    try {
        const { login, password } = req.body;
        let hashedPassword = crypto.SHA256(password).toString();
        const newRecord = new DaneUsers({
            login,
            password: hashedPassword,
        });

        let checkexistance = await DaneUsers.findOne({ login: login });
        console.log(checkexistance);
        if (checkexistance == null) {
            await newRecord.save();
            res.status(201).json({ message: "Propozycja zapisana" });
            console.log("Dodano do bazy", newRecord);
        } else {
            console.log("Istnieje juz taki uzytkownik");
            res.status(400).json({ message: "Istnieje już taki użytkownik" });
        }
    } catch (error) {
        console.error("Błąd zapisu", error);
        res.status(500).json({ error: "Wystąpił błąd serwera" });
    }
});

// Endpoint do logowania użytkownika
app.post("/login", express.json(), async (req, res) => {
    try {
        const { login, password } = req.body;
        let hashedPassword = crypto.SHA256(password).toString();
        let checkexistance = await DaneUsers.findOne({ login: login });
        if (checkexistance) {
            if (checkexistance.password == hashedPassword) {
                console.log("UDANE ZALOGWANIE");
                return res.redirect('/udanarejestracja.html');
            } else {
                console.log("podałeś błędne hasło");
                res.status(400).json({ message: "Błędny login/hasło" });
            }
        } else {
            console.log("nie ma takiego uzytkownika");
            res.status(400).json({ message: "nie ma takiego uzytkownika" });
        }
    } catch (error) {
        console.error("Błąd zapisu", error);
        res.status(500).json({ error: "Wystąpił błąd serwera" });
    }
});

// Endpoint zwracający wszystkie rekordy z kolekcji Alcohols (podobne jak /dane)
app.get('/danepodobne', async (req, res) => {
    try {
        const dane = await DaneAlk.find({});
        res.json(dane);
    } catch (error) {
        console.error('Błąd pobierania danych:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera' });
    }
});
