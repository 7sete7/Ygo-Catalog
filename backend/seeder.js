module.exports = function(request, db) {

  let tableName;
  let base_url = "https://www.ygohub.com/api";
  let cards = [];
  let todasCartas = [];

  con.query(`SELECT * FROM ${tableName}`, (err, rows) => {
    if(err) throw err;
    if(!rows.length){
      console.log('Seeding database...');

      request.get(`${base_url}/all_cards`, (err, res, body) => {
        if(err) throw err;
        cards = body;
      });

      for(let nome of cards){
        request.get(`${base_url}/card_info?name=${nome}`, (err, res, body) => {
          todasCartas.push(body);
        });
      }

      let campos = "";
      for(let key in todasCartas[0])
        campos += todasCartas[0][key] + ', ';

      con.query(`INSERT INTO ${tableName} (${campos.slice(0, -2)}) VALUES ?`,
        todasCartas, (err, result) => {
          console.log(`Table ${tableName} got seeded with ${result.affectedRows} rows!`);
      });
    }
  });

}
