import { app } from '../index';
import { User } from '../models';
import IUser from '../interfaces/IUser';
import bcrypt = require('bcryptjs');

export default () => {
 
  //Register
  app.route('/api/user/new').post(async (req, res) => {
    if(!req || !req.body) res.status(500).send("Request inválido!");
    
    const data: IUser = {...req.body as IUser};

    try{
      const id = await User.instance.inserirNaTabela([data]);      
      const token = User.instance.generateToken({id: id[0]});

      res.status(200).json({auth: true, token});
    }
    catch(e){
      res.status(500).send(e.message);
    }
  });

  //Authentication
  app.route('/api/user')
  .get(async (req, res) => {
    const response = User.instance.auth(req);
    if(response.error) return res.status(500).send(response);

    const user = await User.instance.getByField({field: "id", value: response.auth["id"]});
    if(!user) res.status(404).send("Usuário não encontrado!");
    user.senha = undefined;

    response.auth = {...response.auth, ...user[0]};
    res.status(200).json(response);
  })
  .post(async (req, res) => {
    try{
      let user = await User.instance.getByField({field: "email", value: req.body.email});
      user = user[0]; //Não pode fazer isso quando usando o await
      
      if(!user) return res.status(404).send("Usuário não encontrado!");

      const validPass = bcrypt.compareSync(req.body.senha, user.senha);
      if(!validPass) return res.status(401).json({auth: false, token: null});

      const token = User.instance.generateToken({id: user.id});
      res.status(200).json({auth: true, token});
    }
    catch(e){
      res.status(404).send("Usuário não encontrado!");
      console.error(e);
    }
  });

}
