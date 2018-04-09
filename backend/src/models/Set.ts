import { Model } from './Model';

export class Set extends Model
{

  protected allUrl = 'all_sets';
  protected detailUrl = 'set_info';

  private static _instance: Set;

  private constructor() {
    super(`sets`);
  }

  public static get instance(){
    return this._instance || (this._instance = new Set());
  }

  protected fields = {
    "varchar(255) null": [
      "name",
      "type"
    ],
    "json null": [
      "languages",
      "language_cards"
    ]
  };

  public seed(): Promise<any>{
    return super.semear();
  }

  public migrate(): Promise<any>{
    return super.migrar();
  }

}
