module.exports = function(app, db){
  let table = 'cards'

  //Get all cards
  app.route('/api/cards/get_all').get((req, res) => {
    db.query(`SELECT * FROM ${table}`, (err, rows) => {
      if(err) throw err;
      res.send(rows);
    });
  });

  //Get card info by name
  app.route('/api/cards/:name').get((req, res) => {
    db.query(`SELECT * FROM ${table} WHERE name = ?`, req.params.name, (err, rows) => {
      if(err) throw err;
      res.send(rows);
    });
  });

  //Get card info by it's number
  app.route('/api/cards/:number').get((req, res) => {
    db.query(`SELECT * FROM ${table} WHERE number = ?`, req.params.number, (err, rows) => {
      if(err) throw err;
      res.send(rows);
    });
  });
  
}
