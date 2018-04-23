import { Card } from './models/Card';
import { Set } from './models/Set';
import { Banlist } from './models/Banlist';
import { BanCard } from './models/BanCard';
import { SetCard } from './models/SetCard';
import { mysql, app } from './index';
import routes from './routes/index';

/**
* Aqui onde as models são chamadas.
*/
export async function generateBD(){
  let card: Card = Card.instance;
  let set: Set = Set.instance;
  let bn: Banlist = Banlist.instance;
  let banCard: BanCard = BanCard.instance;
  let setCard: SetCard = SetCard.instance;

  // let migrates = [card.migrate(), set.migrate(), bn.migrate(), banCard.migrate(), setCard.migrate()];
  // await Promise.all(migrates);

  let seeds = [card.seed(), bn.seed(), set.seed()];
  await Promise.all(seeds);

  let dependentes = [banCard.seed(), setCard.seed()];
  await Promise.all(dependentes);
}

/**
* Cria a conexão com o banco de dados e inicia o servidor.
*/
export function conectarBD(callback: () => void): any{
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

    routes(app, con);

    app.listen(porta, () => {
      console.log(`Servidor iniciado na porta ${porta}!`);
      callback();
    });
  });
  return con;
};
