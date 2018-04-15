export default (app, Card) => {
  const table = 'cards';

  //Get all cards
  app.route('/api/cards/get_all').get(async (req, res) => {
    return await Card.instance.all();
  });

  //Get card info by name
  app.route('/api/cards/name/:name').get(async (req, res) => {
    return await Card.instance.getByField({field: 'name', value: req.params.name});
  });

  //Get card info by it's number
  app.route('/api/cards/number/:number').get(async (req, res) => {
    return await Card.instance.getByField({field: 'name', value: req.params.number});
  });

}
