import Database from './db_connection';

const express = require('express');
const app = express();

app.listen(8000, () => {
  console.log("Servidor iniciado na porta 8000!");
});

//Get all cards
app.route('/api/cards/get_all').get((req, res) => {

});

//Get card info by name
app.route('/api/cards/:name').get((req, res) => {

});

//Get card info by it's number
app.route('/api/cards/:number').get((req, res) => {

});

//Get latest 20 cards
app.route('/api/cards/new').get((req, res) => {

});


//Get all set names
app.route('/api/sets/get_all').get((req, res) => {

});

//Get set info by it's name
app.route('/api/sets/:name').get((req, res) => {

});
