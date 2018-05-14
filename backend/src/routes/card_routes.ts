export default (app, Card) => {
  const table = 'cards';

  //Get all cards
  app.route('/api/cards/get_all').get(async (req, res) => {
    console.log(`GET ${req.originalUrl}`);

    let all = await Card.instance.all(req.query.orderBy || null);
    res.json(all);
  });

  //Exemplo: /api/cards?orderBy=attack%20asc&limit=20
  //Pega as 20 cartas com maior attack
  app.route('/api/cards/:field?/:value?').get(async (req, res) => {
    console.log(`GET ${req.originalUrl}`);

    try{
      let card = await Card.instance.getByField({
        field:   req.params.field                       || null,
        value:   req.params.value ? [req.params.value]   : null,
        orderBy: req.query.orderBy                      || null,
        limit:   req.query.limit                        || null
      });
      res.json(card);
    }
    catch(e){
      console.error(e);
      res.send(e)
    }
  });

}
