import  { Model }  from './Model';

/**
* Classe que representa as cartas
* @extends Model
*/
export class Card extends Model
{

  protected allUrl = 'all_cards';
  protected detailUrl = 'card_info';

  private static _instance: Card;

  private constructor(){
    super(`cards`);
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
    "int null": [
      "number",
      "attack",
      "defense",
      "stars"
    ],
    "varchar(255) null": [
      "name",
      "image_path",
      "thumbnail_path",
      "type",
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

  public seed(): void{
    super.semear();
  }

  public migrate(): Promise<any>{
    return super.migrar();
  }

}
