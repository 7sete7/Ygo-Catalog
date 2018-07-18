import {   UserDeck   } from './index';
import {     Auth     } from '../Util';
import { IDeck, IUser } from '../interfaces';
import {     Model    } from './Model';

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

  public update({where, values}): Promise<any> {
    return super.update({where, values});
  }

  public inserirNaTabela(itens: IUser[]): Promise<string[]>{
    const encryptedUsers = Auth.encrypt(itens);
    return super.inserirNaTabela(encryptedUsers);       
  }

  public migrate(): Promise<any>{
    return super.migrar();
  }

  public getInfo(id: number): Promise<any>{
    return new Promise((resolve, reject) => {
      Promise.all([
        User.instance.getByField({field: "id", value: id, limit: 1}),
        User.instance.getDecks(id)
      ])
      .then(response => {
        let [usuario, ...deqs] = response;        
        resolve({user: usuario[0], decks: deqs[0]});
      })
      .catch(reject);
      
    });
  }

  /**
   * Pega os decks do usuário pelo id
   * @param {number} id - O id do usuário
   * @returns Array contendo os decks
   */
  public getDecks(id: number): Promise<IDeck>{
    return new Promise((resolve, reject) => {
      UserDeck.instance.getByField({field: "user", value: id})
        .then(resolve)
        .catch(reject);
    }); 
  }

}
