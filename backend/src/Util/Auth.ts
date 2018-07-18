import jwt    = require('jsonwebtoken');
import bcrypt = require('bcryptjs');
import { IUser } from '../interfaces';


    const encrypt = (itens: IUser[]): IUser[] => {
        let response: IUser[]  = itens.map(item => {
            const encyptedPass = bcrypt.hashSync(item.senha, 8);
            const user = item;
            user.senha = encyptedPass;
            return user;
        });

        return response;
    }
    
    const generateToken = ({ id, expira }:{id: string, expira?: number}): string => {
        const expiresIn = expira || 86400; //24 horas    
        return jwt.sign({id}, process.env.SECRET, {expiresIn});
    }
    
    const auth = (request): {error: boolean, message: string, auth: object} => {
        const token = request.headers["x-access-token"];
        let  response = { error: false, message: "", auth: {} };

        if(!token) response = deuErro("Token não existe. ");

        jwt.verify(token, process.env.SECRET, (err, result) => {
            if(err) response = this.deuErro("Erro autenticano o token");

            response.auth = result;
        });

        return response;
    }
    
    const deuErro = (msg: string) => {
        return {error: true, message: msg, auth: null};
    }

    export default Object.freeze({auth, generateToken, encrypt});
