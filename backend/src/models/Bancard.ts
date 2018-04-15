import { Model } from './Model';
import { Banlist } from './Banlist';
import { Card } from './Card';

export class BanCard extends Model
 {

  protected detailUrl: string;
	protected allUrl: string;

  private static _instance: BanCard;

  private constructor(){
    super(`banCard`);
  }

  public static get instance(){
    return this._instance || (this._instance = new BanCard());
  }

  protected fields = {
    "int": ["card", "banlist"],
    "varchar(100) null": [
      "name",
      "status",
      "previous_status"
    ]
  }

  public async seed()
  {
    try{
      console.log("Semeando bancards...");
      let opcoes = this.requestOptions;
      let cartas = [];
      let lista = await Banlist.instance.all();


      await Promise.all(lista.map(bl => {
        opcoes["url"] = `${this.baseUrl}/banlist_info?region=${bl["region"]}&start_date=${bl["start_date"]}&game_type=${bl["game_type"]}`;

        this.rp(opcoes)
          .then(async res => {
            try{
              let arrayCartas = await this.assignForeign(res, bl);
              console.log(arrayCartas);
            }
            catch(e){console.error(e)}
          })
          .catch(e => `Erro no bancard \n>${e}`);
      }));
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
      let [carta,] = cartas.filter(c => c["name"] == name);
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
