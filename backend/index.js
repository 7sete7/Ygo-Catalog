const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

let con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ygo-catalog'
});
con.connect((err) => {
  if(err) throw err;
  console.log("Conexão com banco de dados!");
});
require('./routes/index')(app, con);
require('./seeder')(request, con);

app.listen(8000, () => {
  console.log("Servidor iniciado na porta 8000!");
});
