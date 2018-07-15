import { Model } from './Model';
import IUser     from '../interfaces/IUser';
import jwt =     require('jsonwebtoken');
import bcrypt =  require('bcryptjs');

export class User extends Model {

  protected detailUrl: string;
	protected allUrl: string;
	protected fields: object = {
    "varchar(100)": [
      "nome",
      "email",
      "senha"
    ]
  };

  private static _instance: User;

  private constructor(){
    super(`users`);
  }

  public static get instance(): User{
    return this._instance || (this._instance = new User());
  }

  public get getFields(): object{
    return this.fields;
  }

  public inserirNaTabela(itens: IUser[]): Promise<string[]>{
    const encryptedUsers = this.encrypt(itens);
    return super.inserirNaTabela(encryptedUsers);       
  }

  public seed(): Promise<any>{
    return super.semear();
  }

  public migrate(): Promise<any>{
    return super.migrar();
  }

  private encrypt(itens: IUser[]): IUser[] {
    let response: IUser[]  = itens.map(item => {
      const encyptedPass = bcrypt.hashSync(item.senha, 8);
      const user = item;
      user.senha = encyptedPass;
      return user;
    });

    return response;
  }

  public generateToken({ id, expira }:{id: string, expira?: number}): string{
    const expiresIn = expira || 86400; //24 horas    
    return jwt.sign({id}, process.env.SECRET, {expiresIn});
  }

  public auth(request): {error: boolean, message: string, auth: object}{
    const token = request.headers["x-access-token"];
    let  response = { error: false, message: "", auth: {} };

    if(!token) response = this.deuErro("Token não existe. ");

    jwt.verify(token, process.env.SECRET, (err, result) => {
      if(err) response = this.deuErro("Erro autenticano o token");

      response.auth = result;
    });

    return response;
  }

  private deuErro(msg: string){
    return {error: true, message: msg, auth: null};
  }
}
