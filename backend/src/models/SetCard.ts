import { Model } from './Model';
import { Set } from './Set';
import * as cliProgress from 'cli-progress';

export class SetCard extends Model {

  private bar;

  protected detailUrl: string;
	protected allUrl: string;
	protected fields: object = {
    "fk": [
      "card",
      "set"
    ],
    "varchar(25) NULL": [
      "linguagem"
    ]
  };

  private static _instance: SetCard;
  private constructor(){
    super(`setCard`);
    this.bar = new cliProgress.Bar({}, cliProgress.Presets.shades_classic);
  }

  public static get instance(): SetCard{
    return this._instance || (this._instance = new SetCard());
  }

  public seed(): Promise<number>
  {
    return new Promise<number>((resolve, reject) => {
      this.con.query(`SELECT * FROM ${this.tableName}`, async (err, result) => {
        if(Array.isArray(result) && result.length){
          resolve(0);
          return console.log(`Tabela ${this.tableName} já possui registros!`);
        }

      	try{
          console.log(`Semeando ${this.tableName}...`);

      	  let sets = await Set.instance.all();
      	  SetCard.instance.bar.start(sets.length, 0);

      	  let cards = sets.map(this.cardInfo);
      	  let cartas = await Promise.all<object[][]>(cards);

      	  await SetCard.instance.inserirNaTabela([].concat(...cartas));
          resolve(1);
        }
        catch(e){ console.error(`Erro no seed setCard\n`, e); reject(e); }
      });
    });
  }

  public migrate(): Promise<any>{
    return super.migrar();
  }

  private async cardInfo(set, i: number){
    let array = [];
    let languages = JSON.parse(set["languages"]);

    try{
      for(let lingua of languages){
        let cards = JSON.parse(set["language_cards"]);
        if(!cards) continue;
        if(!cards[lingua]) continue;

        let a = await SetCard.instance.assignForeign(
          cards[lingua],
          {"name": "set", "id": set.id, "linguagem": lingua}
        );
        array.push(...a);
      }
    }
    catch(e){ console.error(e) }

    SetCard.instance.bar.increment();
    return array;
  }
}
