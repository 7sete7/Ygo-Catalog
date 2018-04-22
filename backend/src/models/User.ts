import { Model } from './Model';

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
}
