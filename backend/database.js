let base_url = "https://www.ygohub.com/api";
let cards = [];
let totalCards;
let current = 0;
let terminou = 0;
let totalLoop = 10;
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

  // TODO: Tirar o slice do seed quando completo e ageitar o result.affectedRows
  return{

    seed: function(){

      rp(options)
      .then((body) => {
        cards = body['cards'].slice(0, 5);
        console.log('All cards');

        totalCards = cards.length;

        for(let i = 0; i < totalLoop; i++){
          geting(rp);
        }

        checkFlag(() => {
          getFields(rp, false).then(fields => {

            let arrayCartas = [];
            for(let carta of todasCartas)
              arrayCartas.push(Object.values(carta));

            con.query(`INSERT INTO ${tableName} (${fields}) VALUES ?`,
             [arrayCartas], (err, result) => {
              if(err)
                return console.error(err);

              console.log(`Table ${tableName} got seeded with ${result} rows!`);
            });
          });
        })
        .catch((err) => {
          console.log("Erro ->"+ err);
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
  options['url'] = `${base_url}/card_info?name=${nome}`;

  if(current >= totalCards){
    console.log("Terminou");
    terminou++;
    return;
  }

  rp(options)
  .then((body) => {
    let aux = Object.assign({}, asKeys);
    for(let k in aux){
      body['card'].hasOwnProperty(k) ?
      aux[k] = body.card[k] :
      aux[k] = null;
    }

    todasCartas.push(aux);
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
        `${key}${typing ? ' json NULL' : ''}, `:
        `${key}${typing ? ' varchar(255) NULL' : ''}, `;
      }
      resolve(fields.slice(0, -2));
    });

  });
}

function checkFlag(callback){
  if(totalLoop == terminou)
    callback();
  else
    setTimeout(() => checkFlag(callback), 100);
}

let asKeys = {
 "name": 0,
 "image_path": 0,
 "thumbnail_path": 0,
 "text": 0,
 "type": 0,
 "number": 0,
 "price_low": 0,
 "price_avg": 0,
 "price_high": 0,
 "tcgplayer_link": 0,
 "is_monster": 0,
 "is_spell": 0,
 "is_illegal": 0,
 "is_trap": 0,
 "has_name_condition": 0,
 "species": 0,
 "monster_types": 0,
 "attack": 0,
 "defense": 0,
 "stars": 0,
 "attribute": 0,
 "is_pendulum": 0,
 "is_xyz": 0,
 "is_synchro": 0,
 "is_fusion": 0,
 "is_link": 0,
 "is_extra_deck": 0,
 "has_materials": 0,
 "legality": 0,
 "releases": 0
};
