let base_url = "https://www.ygohub.com/api";
let cards = [];
let totalCards;
let current = 0;
let todasCartas = [];
let options = {
  url: `${base_url}/all_cards`,
  headers: {
  'User-Agent': 'Request-Promise'
  },
  json: true
}

module.exports = function(con, rp) {

  let tableName = 'cards';

  return{

    seed: function(){

      rp(options)
      .then((body) => {
        cards = body['cards'].slice(0, 5);
        console.log('All cards');

        let totalLoop = 10;
        totalCards = cards.length;

        for(let i = 0; i < totalLoop; i++){
          geting(rp);
        }

        getFields(rp, false).then(fields => {

          let arrayCartas = Array.from(todasCartas, (carta) => {
            let arr = [];
            for(key in carta)
              arr.push(carta[key]);
            return arr;
          });



          con.query(`INSERT INTO ${tableName} (${fields}) VALUES ?`,
           [arrayCartas], (err, result) => {
            if(err){
              console.error(err);
              return;
            }

            console.log(`Table ${tableName} got seeded with ${result} rows!`);
          });
        });

      })
      .catch((err) => {
        console.log("Erro "+ err);
      });

    },

    migrate: function(){

      getFields(rp, true).then(fields => {
        con.query(`SHOW TABLES FROM \`ygo-catalog\` LIKE '${tableName}'`, (err, result) => {
          if(result.length){
            console.log(`Tabela ${tableName} já existe`);
            return;
          }
          con.query(`CREATE TABLE ${tableName} (${fields})`, (err, result) => {
            if(err) console.error(err);

            console.log(`Tabela ${tableName} criada com sucesso!`);
          });
        });
      })
      .catch(err => {
        console.log('Deu ruim '+ err);
      });
    }

  }
}

function geting(rp){
  let nome = cards[current++];
  console.log(nome);
  options['url'] = `${base_url}/card_info?name=${nome}`;

  if(current >= totalCards){
    console.log("Terminou");
    return;
  }

  rp(options)
  .then((body) => {
    todasCartas.push(body['card']);
    geting(rp);
  })
  .catch((err) => {
    console.log(`Erro no número ${current} -> `+ err);
    geting(rp);
  });
}

function getFields(rp, typing){
  return new Promise((resolve, reject) => {

    options['url'] = `${base_url}/card_info?name=Souleater`;
    rp(options)
    .then((body) => {
      let fields = "";
      for (var key in body['card']) {
        fields += key === 'legality' || key === 'releases'?
        `${key}${typing ? ' json' : ''}, `:
        `${key}${typing ? ' varchar(255)' : ''}, `;
      }
      resolve(fields.slice(0, -2));
    });

  });
}
