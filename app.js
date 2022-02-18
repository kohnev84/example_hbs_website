const express = require("express");
const app = express();
const path = require('path');
const pg = require('pg');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Подключаем статику
app.use(express.static(path.join(__dirname, 'public')));

// Подключаем views(hbs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const config = {
    user: 'postgres',
    database: 'kr_psql',
    password: 'postgres',
    port: 5432

}

const pool = new pg.Pool(config);

// Отображаем главную страницу с использованием шаблона "index.hbs"
app.get('/', function (req, res) {
    res.render('index', req.query);
});

app.get('/users', function (req, res) {
    res.render('users', req.query);
});

app.post("/saveuser", (req, res, next) => {
    console.log(req.body.name, req.body.last_name)
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        client.query(`INSERT INTO users (name, last_name) VALUES ( '${req.body.name}', '${req.body.last_name}');`)
        done();
        if (err) {
            console.log(err);
            res.status(400).send(err);

        }
        res.status(200).send({
            result_save: "success"
        })
    })

})

const port = process.env.PORT || 3002;
app.listen(port, () => console.log("Listening on " + port));