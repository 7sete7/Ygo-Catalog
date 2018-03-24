import  { Model }  from './Model';

export default class Card extends Model
{
  constructor(){
    super(`cards`);
    const APIURL = `${super.baseUrl}/`
  }

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

  seed(): void{

  }




}
