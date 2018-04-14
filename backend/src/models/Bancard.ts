import { Model } from './Model';
import { Banlist } from './Banlist';

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
    "int null": ["card"],
    "varchar(100)": [
      "name",
      "status",
      "previous_status"
    ]
  }

  public seed(lista: object[]): void {
    console.log("Semeando bancards...");
    let opcoes = this.requestOptions;
    let cartas = [];

    for(let bl of lista){
      opcoes["url"] = `${this.baseUrl}/banlist_info?region=${bl["region"]}&start_date=${bl["start_date"]}&game_type=${bl["game_type"]}`;
      this.rp(opcoes)
        .then(body => {
          for(let carta of body["banlist"]["cards"]){
            this.assignForeign(carta).then(id => {
              if(!id) throw new Error();
              cartas.push({
                "card_id": id,
                "card_name": carta["card_name"],
                "status": carta["status"],
                "previous_status": carta["previous_status"]
              });
            })
            .catch(e => console.log(`Não achei o nome ${carta["card_name"]}`));
          }
        })
        .catch(err => console.error(`Erro no bancard > ${err}`));
    }
  }

  public migrate(): Promise<number> {
    return super.migrar();
  }

  public assignForeign(card_name): Promise<number> {
    return new Promise(resolve => {
      this.con.query(`SELECT id FROM cards WHERE name = '${card_name}'`, (err, result) => {
        resolve(JSON.parse(JSON.stringify(result))["id"]);
      });
    });
  }

}
