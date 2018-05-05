export default (app, Card) => {
  const table = 'cards';

  //Get all cards
  app.route('/api/cards/get_all').get(async (req, res) => {
    let all = await Card.instance.all();
	res.send(all);
  });

  //Get card info by name
  app.route('/api/cards/name/:name').get(async (req, res) => {
    let card = await Card.instance.getByField({field: 'name', value: req.params.name});
	res.send(card);
  });

  //Get card info by it's number
  app.route('/api/cards/number/:number').get(async (req, res) => {
    let card = await Card.instance.getByField({field: 'number', value: req.params.number});
	res.send(card);
  });

}
