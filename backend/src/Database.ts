import { Card, Set, Banlist, BanCard, SetCard, User, UserDeck } from './models';
import { mysql, app } from './index';
import setUpRoutes from './routes';

/**
* Aqui onde as models são chamadas.
*/
export async function generateBD(){
  let card:    Card     = Card.instance;
  let set:     Set      = Set.instance;
  let bn:      Banlist  = Banlist.instance;
  let banCard: BanCard  = BanCard.instance;
  let setCard: SetCard  = SetCard.instance;
  let user:    User     = User.instance;
  let userDk:  UserDeck = UserDeck.instance;

  let migrates = [card.migrate(), set.migrate(), bn.migrate(),
                banCard.migrate(), setCard.migrate(), user.migrate(), userDk.migrate()];
  await Promise.all(migrates);

  let seeds = [card.seed(), bn.seed(), set.seed()];
  await Promise.all(seeds);

  let dependentes = [banCard.seed(), setCard.seed()];
  await Promise.all(dependentes);
}

/**
* Cria a conexão com o banco de dados e inicia o servidor.
*/
export function conectarBD(callback: () => void): any{
  let porta = process.env.API_PORT || 8080;

  var con = mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME     || 'ygo-catalog'
  });
  con.connect((err) => {
    if(err) throw err;
    console.log("Conexão com banco de dados!");

    app.listen(porta, () => {
      console.log(`Servidor iniciado na porta ${porta}!`);
      setUpRoutes(con);
      callback();
    });
  });
  return con;
};
