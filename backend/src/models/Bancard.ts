import { Model } from './Model';
import { Banlist } from './Banlist';
import { Card } from './Card';

export class BanCard extends Model
{

  protected detailUrl: string;
	protected allUrl: string;
  protected fields = {
    "int": ["card", "banlist"],
    "varchar(100) null": [
      "name",
      "status",
      "previous_status"
    ]
  }

  private static _instance: BanCard;

  private constructor(){
    super(`banCard`);
  }

  public static get instance(){
    return this._instance || (this._instance = new BanCard());
  }

  public async seed()
  {
    let _this_ = BanCard.instance;

    try{
      console.log("Semeando bancards...");
      let opcoes = BanCard.instance.requestOptions;
      let cartas = [];
      let lista = await Banlist.instance.all();

      let car = await Promise.all(lista.map(async bl => {
        opcoes["url"] = `${_this_.baseUrl}/banlist_info?region=${bl["region"]}&start_date=${bl["start"]}&game_type=${bl["game_type"]}`;

        _this_.rp(opcoes)
          .then(async res => {
            try{
              if(res["status"] == "error") throw new URIError(`Banlist não encontrada! \n${opcoes["url"]}`);
              return await _this_.assignForeign(res["banlist"]["cards"], bl);
            }
            catch(e){ console.error(e) }
          })
          .catch(e => `Erro no bancard \n>${e}`);
      }));
      console.log(car);
    }
    catch(e){ console.error(e) }

  };

  public migrate(): Promise<number> {
    return super.migrar();
  }

/**
* Função que liga a carta do banlist com as cartas do cards.
* @return {object[]} - Array de objetos contendo o id do card e banlist.
*/
  protected async assignForeign(cartas: object[], {id: id_bl}): Promise<object[]>
  {
    let names = cartas.map(card => card["card_name"]);
    let as = await Card.instance.getByField({field: "name", value: names, limit: 999});
    let cards: object[] = [];

    await as.forEach(({id, name}) => {
      let [carta,] = cartas.filter(c => c["card_name"] == name);
      cards.push({
        "card": id,
        "banlist": id_bl,
        "status": carta["status"],
        "previous_status": carta["previous_status"],
      });
    });

    return cards;
  }

}
