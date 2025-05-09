const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 6789;
// directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.set('view engine', 'ejs');
// suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului este views/layout.ejs
app.use(expressLayouts);
// directorul 'public' va conține toate resursele accesibile direct de către client (e.g., fișiere css, javascript, imagini)
app.use(express.static('public'))
// corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în format json în req.body
app.use(bodyParser.json());
// utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(bodyParser.urlencoded({ extended: true }));

// la accesarea din browser adresei http://localhost:6789/ se va returna textul 'Hello World'
// proprietățile obiectului Request - req - https://expressjs.com/en/api.html#req
// proprietățile obiectului Response - res - https://expressjs.com/en/api.html#res
app.get('/', (req, res) => res.send('Hello World'));

// la accesarea din browser adresei http://localhost:6789/chestionar se va apela funcția specificată
app.get('/chestionar', (req, res) => {   
    fs.readFile('intrebari.json', (err, data) => {
        if (err) throw err;
        const listaIntrebari = JSON.parse(data);
        const raspCorecte = listaIntrebari.map(item => item.corect);
        res.render('chestionar', {intrebari: listaIntrebari});
    });
});
app.post('/rezultat-chestionar', (req, res) => {
    fs.readFile('intrebari.json', (err, data) => {
        if (err) throw err;
        const listaIntrebari = JSON.parse(data);
        const raspCorecte = listaIntrebari.map(item => item.corect);
        const raspuns = req.body;
        res.render('rezultat-chestionar', { layout: 'layout', titlu: 'Rezultate', raspunsuri: raspuns , corect: raspCorecte});
    });
});
app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:${port}/`));