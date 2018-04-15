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

  public seed(): Promise<number> {
    console.log("Semeando banlists...")
    return new Promise(resolve => {
      let arrayDosCampos = [];
      for(let key in this.fields)
        arrayDosCampos.push(...this.fields[key]);

      this.con.query(`SELECT * FROM ${this.tableName}`, (err, result) => {
        if(result.length){
          resolve(1);
          return console.log(`Tabela ${this.tableName} já possui registros!`);
        }

        this.rp(this.requestOptions).then(body => {
          this.banlists = body.banlists;

          let lista = this.pegaItens(body);
          resolve(1);

          this.inserirNaTabela(arrayDosCampos, lista);
        })
        .catch(err => console.log(`Erro pegando todas ${this.tableName}! \n${Error(err)}`));
      });
    });
  }

  public migrate(): Promise<any>{
    return super.migrar();
  }

/**
* Função que pega e separa as banlists vindas da api.
* @param {object} banlists - Objeto de resposta da api contendo todas banlists.
* @return {object[]} - Array de objetos bonitinho com os dados das banlists.
*/
  private pegaItens({banlists: bn}): object[] {
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
