
export class Card {
  name: string;
  image_path: string;
  thumbnail_path: string;
  description: string;
  type: string;
  number: number;
  price_low: string;
  price_avg: string;
  price_high: string;
  tcgplayer_link: string;
  is_monster: boolean;
  is_spell: boolean;
  is_illegal: boolean;
  is_trap: boolean;
  has_name_condition: boolean;
  species: string;
  monster_types: string[] = [];
  attack: number;
  defense: number;
  stars: number;
  attribute: string;
  is_pendulum: boolean;
  is_xyz: boolean;
  is_synchro: boolean;
  is_fusion: boolean;
  is_link: boolean;
  is_extra_deck: boolean;
  has_materials: boolean;
}
