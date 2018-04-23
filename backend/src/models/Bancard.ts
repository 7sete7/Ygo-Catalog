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

  public async seed()
  {
    let _this_ = BanCard.instance;
	  try{
      console.log("Semeando bancards...");
      let cartas = [];
      let lista = await Banlist.instance.all();

      let promises = lista.map(_this_.getCardInfo, _this_);
      let cards = await Promise.all<object[][]>(promises);

      await _this_.inserirNaTabela([].concat(...cards));
    }
    catch(e){ console.error(`Erro no Bancard`, e) }

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
