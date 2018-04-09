import { Model } from './Model';

export class Banlist extends Model
{
  private banlists: object;

  protected detailUrl: string = `banlist_info`;
	protected allUrl: string = `all_banlists`;
	protected fields = {
    "varchar(15) NULL": ["game_type"],
    "varchar(3) NULL": ["region"],
    "Date NULL": [
      "start",
      "end"
    ]
  };

  private static _instance: Banlist;

  private constructor(){
    super(`banlist`);
  }

  public static get instance(): Banlist{
    return this._instance || (this._instance = new Banlist());
  }

  public seed(): Promise<string[][]> {
    console.log("Semeando banlists...")
    return new Promise(resolve => {
      let arrayDosCampos = [];
      for(let key in this.fields)
        arrayDosCampos.push(...this.fields[key]);

      this.con.query(`SELECT * FROM ${this.tableName}`, (err, result) => {
        if(result.length) return console.error(`${this.tableName} precisa ser esvaziado!`);

        this.rp(this.requestOptions).then(body => {
          this.banlists = body.banlists;

          let lista = this.pegaItens(body);
          resolve(lista);

          this.inserirNaTabela(arrayDosCampos, lista);
        })
        .catch(err => console.log(`Erro pegando todas ${this.tableName}! \n${Error(err)}`));
      });
    });
  }

  public migrate(): Promise<any>{
    return super.migrar();
  }

  private pegaItens({banlists: bn}): string[][] {
    let aux = [];
    let o = {};

    for(let type in bn){
      for(let region in bn[type]){
        for(let start_date in bn[type][region]){
          let end_date = bn[type][region][start_date]["end_date"] || null;
          o["game_type"] = type;
          o["region"] = region;
          o["start_date"] = start_date;
          o["end_date"] = end_date
          aux.push(o);
          o = {};
        }
      }
    }
    return aux;
  }
}
