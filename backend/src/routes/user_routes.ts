import { app } from '../index';
import { User } from '../models';

export default () => {

  //Get all users
  app.route('/api/user/get_all').get(async (req, res) => {
    console.log(`GET ${req.originalUrl}`);

    User.instance.all(req.query.orderBy || null)
    .then(users => res.status(200).json(users))
    .catch(e => res.sendStatus(500));
  });

  //Get user info by it's id
  app.route('/api/user/:id').get(async (req, res) => {
    console.log(`GET ${req.originalUrl}`);

    User.instance.getByField({
      field:   'id',
      value:   req.params.id,
      orderBy: req.query.orderBy || null
    })
    .then(user => res.status(200).json(user))
    .catch(e => res.sendStatus(500));
  });

  app.route('/api/user').post((req, res) => {
    console.log(`POST ${req.originalUrl}`);

    const fields: string[] = [].concat(...Object.values(User.instance.getFields));
    const data = {};
    console.log(res)
    console.log(req.query);
    fields.forEach(item => data[item] = req.body[item]);

    try{
      User.instance.inserirNaTabela([data]);
      res.sendStatus(200);
    }
    catch(e){
      res.sendStatus(500);
    }
  });
}
