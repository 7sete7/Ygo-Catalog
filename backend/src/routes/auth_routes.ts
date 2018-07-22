import { app } from '../index';
import { User } from '../models';
import { Auth } from '../Util';
import bcrypt = require('bcryptjs');

export default () => {
    
    app.route('/api/v1/auth')
    .get(async (req, res) => {//Valida o token e envia info do usuário
        const response = Auth.auth(req);
        if(response.error) return res.status(500).send(response);

        const user = await User.instance.getByField({field: "id", value: response.auth["id"], limit: 1});
        if(!user) res.status(404).send({error: "Usuário não encontrado!"});
        user[0]["senha"] = undefined;

        response.auth = {...response.auth, ...user[0]};
        res.status(200).json(response);
    })
    .post(async (req, res) => {//Loga e envia o token
        try{
            if(!req.body.email || !req.body.senha) 
                throw new Error("Request sem corpo");

            let user = await User.instance.getByField({field: "email", value: req.body.email, limit: 1});
            user = user[0]; //Não pode fazer isso quando usando o await

            if(!user) return res.status(404).json({error: "Usuário não encontrado!"});

            const validPass = bcrypt.compareSync(req.body.senha, user.senha);
            if(!validPass) return res.status(401).json({auth: false, token: null});

            const token = Auth.generateToken({id: user.id});
            res.status(200).json({auth: true, token});
        }
        catch(e){
            res.status(404).json({error: e.message});
            console.error(e);
        }
    });
}