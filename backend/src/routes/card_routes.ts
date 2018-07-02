import { Card } from '../models/Card';
import { app } from '../index';

export default () => {
  const table = 'cards';

  //Get all cards
  app.route('/api/cards/get_all').get(async (req, res) => {
    console.log(`GET ${req.originalUrl}`);

    Card.instance.all(req.query.orderBy || null)
    .then(cards => res.status(200).json(cards))
    .catch(e => res.sendStatus(500));
  });

  //Exemplo: /api/cards?orderBy=attack%20asc&limit=20
  //Pega as 20 cartas com maior attack
  app.route('/api/cards/:field?/:value?').get(async (req, res) => {
    console.log(`GET ${req.originalUrl}`);

    Card.instance.getByField({
      field:   req.params.field    || null,
      value:   req.params.value    || null,
      orderBy: req.query.orderBy   || null,
      limit:   req.query.limit     || null
    })
    .then(set => res.status(200).json(set))
    .catch(e => res.sendStatus(500));
  });

}
