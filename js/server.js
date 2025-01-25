const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;
const uri = 'mongodb://127.0.0.1:27017/db_webapp'; // Twój URI

const AlkoholeArrSortedId = require("./baza_init")

mongoose.connect(uri, {

}).then(() => console.log('Połączono z MongoDB'))
.catch(err => console.error('Błąd połączenia z MongoDB', err));

const daneSchemaAlk = new mongoose.Schema({
    id:Number,
    name:String,
    image:String,
    rentownosc:Number,
    ocena:Number,
    typ:String,

});

const DaneAlk = mongoose.model('DaneAlk', daneSchemaAlk, 'Alcohols');

async function pierwszeDodanie(){
    try {
        const count = await DaneAlk.countDocuments({})
        if (count === 0) {
            await DaneAlk.insertMany(AlkoholeArrSortedId)
            console.log("DZIALA")
    
        }else {
            console.log("Kolekcja nie jest pustaa")
        }
        
    } catch (error) {
        console.error("Błąd dodawania danych", error)
    }
}
pierwszeDodanie()


// Obsługa plików statycznych (ważne!)
app.use(express.static(path.join(__dirname, '..'))); // Cofamy się o jeden katalog

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'baza.html')); // Ścieżka do baza.html
});

app.get('/dane', async (req, res) => {
    try {
        const dane = await DaneAlk.find({});
        res.json(dane);
    } catch (error) {
        console.error('Błąd pobierania danych:', error);
        res.status(500).json({ error: 'Wystąpił błąd serwera' });
    }
});

app.listen(port, () => {
    console.log(`Serwer nasłuchuje na porcie ${port}`);
});