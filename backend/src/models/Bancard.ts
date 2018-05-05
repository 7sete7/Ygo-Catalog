import { Model } from './Model';
import { Banlist } from './Banlist';
import { Card } from './Card';

export class BanCard extends Model
{

  protected detailUrl: string;
	protected allUrl: string;
  protected fields = {
    "fk": ["card", "banlist"],
    "varchar(100) null": [
      "status",
      "previous_status"
    ]
  }

  private static _instance: BanCard;

  private constructor(){
    super(`banCards`);
  }

  public static get instance(): BanCard{
    return this._instance || (this._instance = new BanCard());
  }

  public seed(): Promise<number>
  {
    let _this_ = BanCard.instance;
    return new Promise<number>((resolve, reject) => {
      this.con.query(`SELECT * FROM ${this.tableName}`, async (err, result) => {
        if(Array.isArray(result) && result.length){
          resolve(1);
          return console.log(`Tabela ${this.tableName} já possui registros!`);
        }

    	  try{
          console.log("Semeando bancards...");
          let cartas = [];
          let lista = await Banlist.instance.all();

          let promises = lista.map(_this_.getCardInfo, _this_);
          let cards = await Promise.all<object[][]>(promises);

          await _this_.inserirNaTabela([].concat(...cards));
          resolve(1);
        }
        catch(e){ console.error(`Erro no Bancard`, e); reject(e); }
      });
    });
  };

  public migrate(): Promise<number> {
    return super.migrar();
  }

  private async getCardInfo(banlist): Promise<object>{
    let url = `${this.baseUrl}/banlist_info?region=${banlist["region"]}&start_date=${banlist["start"]}&game_type=${banlist["game_type"]}`;

    try{
      let response = await this.request(url);

      if(response.status == "error") throw new URIError(`Banlist não encontrada! \n${url}`);
      return await this.assignForeign(response["banlist"]["cards"],{"name": "banlist", "id": banlist.id});
    }
    catch(e){
      console.error(`Erro ne getCardInfo`, e);
      return null;
    }
  }

}
