export default interface ICard {

  name:            string;
  image_path:      string;
  thumbnail_path:  string;
  type:            string;
  tcgplayer_link?: string;
  number:          number;
  attack?:         number;
  defense?:        number;
  stars?:          number;
  price_low?:      number;
  price_avg?:      number;
  price_high?:     number;
  is_monster?:     boolean;
  is_spell?:       boolean;
  is_illegal?:     boolean;
  is_trap?:        boolean;
  has_name_condition?: boolean;
  species?:        string;
  attribute?:      string;
  is_pendulum?:    boolean;
  is_xyz?:         boolean;
  is_synchro?:     boolean;
  is_fusion?:      boolean;
  is_link?:        boolean;
  is_extra_deck?:  boolean;
  has_materials?:  boolean;
  text?:           string;
  
  legality?:       { [key: string]: string | string[] };
  releases?:       { [key: string]: string | string[] };
  monster_types?:  { [key: string]: string | string[] };
}
