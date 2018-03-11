const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const rp = require('request-promise');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

let con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'ygo-catalog'
});
con.connect((err) => {
  if(err) throw err;
  console.log("Conexão com banco de dados!");

  require('./routes/index')(app, con);
  let db = require('./seeder')(con, rp);

  app.listen(8000, () => {
    console.log("Servidor iniciado na porta 8000!");
  });
});

module.exports.seed = function(){
  require('./seeder')(con, rp).seed();
}

module.exports.migrate = function(){
  require('./seeder')(con, rp).migrate()
}
