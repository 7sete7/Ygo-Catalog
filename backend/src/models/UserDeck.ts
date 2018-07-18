import { Model } from "./Model";
import { Card  } from "./";
import { ICard } from "../interfaces";

export class UserDeck extends Model {
  protected allUrl: string;
  protected detailUrl: string;

  protected fields = {
    fk: ["user"],
    json: ["card"],
    "varchar(30)": ["deckName", "visibility"]
  };

  private static _instance: UserDeck;
  public static get instance(): UserDeck {
      return this._instance || (this._instance = new UserDeck());
  }

  private constructor(){
      super(`userDeck`);
  }

  public migrate(): Promise<any> {
      return super.migrar("id int NOT NULL AUTO_INCREMENT, PRIMARY KEY (id), ");
  }

  public async getCards(id: number): Promise<ICard[]>{
    try{
        const cardIds = await UserDeck.instance.getByField({field: "id", value: id, select: "card", limit: 1});
        const cards =  await Card.instance.getByField({field: "id", value: JSON.parse(cardIds[0]["card"])});
        return cards;
    }
    catch(e){
        console.error(e);
    }
  }

  public insertCards({where, values}: {where: string, values: number[]}): Promise<any> {
      return new Promise((resolve, reject) => {
        this.con.query(`UPDATE ${this.tableName} SET card = JSON_MERGE(
            (SELECT card FROM (SELECT * FROM ${this.tableName} WHERE ${where}) as S),
            "$",
            "JSON_ARRAY(${values.join()})"
        )`, 
        (err, result) => {
            if(err) reject(err);
            else    resolve(result);
        });
      });
  }

  public removeCards({where, values}: {where: string, values: number[]}): Promise<any> {
    return new Promise((resolve, reject) => {
        this.con.query(`SELECT card from ${this.tableName} WHERE userdeck.${where}`, 
        (err, result) => {
            if(err) return reject(err);
            let cards = JSON.parse(JSON.parse(JSON.stringify(result))[0]["card"]);          
            
            let cont = 0;
            for(const item of values){
                let index = cards.indexOf(item);
                if(index != -1){
                    cards.splice(index, 1);
                    cont++;
                }
            }
            if(cont > 0)
                this.update({
                    where: `${this.tableName}.${where}`, 
                    values: {"card": `JSON_ARRAY(${cards.join()})`}
                })
                .then(resolve)
                .catch(reject);
        });
    });
  }

}
