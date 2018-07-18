import { app } from '../index';
import { User, UserDeck } from '../models';
import IUser from '../interfaces/IUser';
import { Auth } from '../Util';
import bcrypt = require('bcryptjs');

export default () => {
 
  //Register
  app.route('/api/v1/user/new').post(async (req, res) => {
    if(!req || !req.body) res.status(500).send("Request inválido!");
    
    const data: IUser = {...req.body as IUser};

    try{
      const id = await User.instance.inserirNaTabela([data]);      
      const token = Auth.generateToken({id: id[0]});

      res.status(200).json({auth: true, token});
    }
    catch(e){
      res.status(500).send(e.message);
    }
  });

  //Pega informaçoes de perfil do usuário e seus decks pelo id
  app.route('/api/v1/user/:id').get(async (req, res) => {
    try{     
      const userInfo = await User.instance.getInfo(req.params.id);
      if(!userInfo || !userInfo.user) 
        return res.status(404).send("Usuário não encontrado!");
      
      res.status(200).json(userInfo);
      
    }
    catch(e){
      res.status(500).send(e.message);
    }
  });

  

}
