import { app } from '../index';
import { Set } from '../models/Set';

export default () => {

  //Get all set names
  app.route('/api/sets/get_all').get(async (req, res) => {
    console.log(`GET ${req.originalUrl}`);

    Set.instance.all(req.query.orderBy || null)
    .then(set => res.status(200).json(set))
    .catch(e => res.sendStatus(500));
  });

  //Get set info by it's name
  app.route('/api/sets/:name').get(async (req, res) => {
    console.log(`GET ${req.originalUrl}`);

    Set.instance.getByField({
      field: 'name',
      value: req.params.name,
      orderBy: req.query.orderBy || null
   })
   .then(set => res.status(200).json(set))
   .catch(e => res.sendStatus(500));
  });
}
