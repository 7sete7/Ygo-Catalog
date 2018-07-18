import { app } from '../index';
import { Set } from '../models/Set';

export default () => {

  //Get all set names
  app.route('/api/v1/sets/get_all').get(async (req, res) => {
    Set.instance.all(req.query.orderBy || null)
    .then(set => res.status(200).json(set))
    .catch(e => res.sendStatus(500));
  });

  //Get set info by it's name
  app.route('/api/v1/sets/:name').get(async (req, res) => {
    Set.instance.getByField({
      field: 'name',
      value: req.params.name,
      orderBy: req.query.orderBy || null
   })
   .then(set => res.status(200).json(set))
   .catch(e => res.sendStatus(500));
  });
}
