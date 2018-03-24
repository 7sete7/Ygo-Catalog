const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const rp = require('request-promise');
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  bodyParser.urlencoded({ extended: true });
});

// IMPORTANTE: Se mudar a porta aqui, tem que mudar na baseUrl do angular
let porta = process.env.PORT || 8080;

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'ygo-catalog'
});
con.connect((err) => {
  if(err) throw err;
  console.log("Conexão com banco de dados!");

  require('./routes/index')(app, con);
  let db = require('./database')(con, rp);

  app.listen(porta, () => {
    console.log(`Servidor iniciado na porta ${porta}!`);
    db.migrate();
    setTimeout(() => db.seed(), 1000);
  });
});

module.exports.seed = function(){
  require('./database')(con, rp).seed();
}

module.exports.migrate = function(){
  require('./database')(con, rp).migrate();
}

export con;
