import { Card } from './models/Card';
import { Set } from './models/Set';
import { Banlist } from './models/Banlist';
import { BanCard } from './models/BanCard';
import { mysql, app } from './index';

/**
* Aqui onde as models são chamadas.
*/
function doThings(){
  let card: Card = Card.instance;
  let set: Set = Set.instance;
  let bn: Banlist = Banlist.instance;
  let bc: BanCard = BanCard.instance;
  Promise.all<any>([
    card.migrate(),
    set.migrate(),
    bn.migrate()
  ])
  .then(() => {
    Promise.all([
      card.seed(),
      set.seed(),
      bn.seed()
    ])
    .then(value => bc.seed(value[2]));
  });
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
