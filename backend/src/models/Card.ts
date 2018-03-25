import  { Model }  from './Model';
export interface IrecursionOptions{
  totalLoop: number;
  current: number;
  terminou: number;
}
/**
* Classe que representa as cartas
* @extends Model
*/
export class Card extends Model
{
  public cards: any[];
  private static _instance: Card;

  private requestOptions: object;
  private recursao = {
    totalLoop: 10,
    current: 0,
    terminou: 0
  }
  private todasCartas: object[];

  private constructor(){
    super(`cards`);
    this.requestOptions = this.opcoes;
  }

  /**
  * Usar isso ao invés do new Card, pois Card é um singleton
  * @return {Card} A instância de Card
  */
  public static get instance(): Card{
    return this._instance || (this._instance = new Card());
  }

  /**
  * Variável especificando os campos da tabela no bd.
  * Ver @see {Model.migrate} para mais informações.
  */
  protected fields = {
    "varchar(255) null": [
      "name",
      "image_path",
      "thumbnail_path",
      "type",
      "number",
      "price_low",
      "price_avg",
      "price_high",
      "tcgplayer_link",
      "is_monster",
      "is_spell",
      "is_illegal",
      "is_trap",
      "has_name_condition",
      "species",
      "attack",
      "defense",
      "stars",
      "attribute",
      "is_pendulum",
      "is_xyz",
      "is_synchro",
      "is_fusion",
      "is_link",
      "is_extra_deck",
      "has_materials",
    ],
    "text null": ["text"],
    "json null": [
      "legality",
      "releases",
      "monster_types"
    ]
  }

  /**
  * Semeia a tabela card pegando os dados da {@link https://www.ygohub.com/api | API}
  */
  public seed(): void{
    console.log("Seeding...");

    this.con.query(`SELECT * FROM ${this.tableName}`, (err, result) => {
      if(result.length) return console.error(`Tabela ${this.tableName} já possui registros!`);

      let carta: string[] = [];
       for(let key in this.fields)
         carta.push(...this.fields[key]);

      this.rp(this.requestOptions).then(body => {
        this.cards = body["cards"].slice(0, 15);
        console.log("All cards");

        for(let i = 0; i < this.recursao.totalLoop; i++)
          this.pegarAsCartas(carta);

        super.checarFlag(this.recursao.totalLoop == this.recursao.terminou, () => {
          for(let item of this.todasCartas){
            this.con.query(`INSERT INTO ${this.tableName} (${carta.join(', ')})
            VALUES ${this.con.escape(Object.keys(item).map(key => item[key]))}`, (err, result) => {
              if(err) return console.error(`Erro no insert!\n ${err}`);

              console.log(`Tabela ${this.tableName} semeada com sucesso!`);
            });

          }
        });
      })
      .catch(err => {
        console.log(`Erro pegando todas cartas!`);
      });
    });
  }

  /**
  * Função recursiva que roda simultâneamente {@link totalLoop | totalLoop} vezes,
  * pega os dados das cartas e guarda em {@link todasCartas | todasCartas}.
  * @param {string[]} carta - Array contendo o nome dos campos na tabela.
  */
  private pegarAsCartas(carta: string[]): void
  {
    let nome = this.cards[this.recursao.current++];
    this.requestOptions["url"] = `${this.baseUrl}/card_info?name=${nome}`;

    if(this.recursao.current >= this.cards.length){
      this.recursao.terminou++;
      return;
    }

    this.rp(this.requestOptions)
     .then(body => {
        if(body["card"]){
          let aux = {};
          for(let k in carta){
            aux[k] = body["card"].hasOwnProperty(k)
                      ? this.fields["json null"].filter(itm => itm == k).length
                        ? JSON.stringify(body["card"][k])
                        : body["card"][k]
                      : null
          }
          this.todasCartas.push(aux);
        }
        this.pegarAsCartas(carta);
    })
    .catch(err => {
      console.log(`Erro no número ${this.recursao.current} -> ${err}`);
      this.pegarAsCartas(carta);
    });
  }

  /**
  * Chama a função de migrate da {@link Model | super Model}.
  */
  public migrate(): void{
    super.migrate();
  }

}
