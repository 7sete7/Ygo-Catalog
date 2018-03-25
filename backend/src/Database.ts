import { Card } from './models/Card';
import { mysql, app } from './index';

/**
* Aqui onde as models são chamadas.
*/
function doThings(){
  let card: Card = Card.instance;
  card.migrate();
  setTimeout(() => card.seed(), 200);
}

/**
* Cria a conexão com o banco de dados e inicia o servidor.
*/
function conectarBD(callback: () => void): any{
  let porta = 8080;

  var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'ygo-catalog'
  });
  con.connect((err) => {
    if(err) throw err;
    console.log("Conexão com banco de dados!");

    //require('./routes/index')(app, con);

    app.listen(porta, () => {
      console.log(`Servidor iniciado na porta ${porta}!`);
      callback();
    });
  });
  return con;
};

export { doThings, conectarBD };