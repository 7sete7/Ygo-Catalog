import { con } from '../index';
import * as rp from 'request-promise';

/**
* Super classe que todas as models descenderão.
*/
export abstract class Model
{

  private SELECTALL: string;

  protected abstract fields: Object;
  protected tableName: string;
  protected baseUrl: string;

  protected get opcoes(): object{
    return {
      url: `${this.baseUrl}/all_cards`,
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true
    }
  }

  protected get con(){
    return con;
  }
  protected get rp(){
    return rp;
  }

  protected constructor(name: string){
    this.tableName = name;
    this.SELECTALL = `SELECT * FROM ${this.tableName}`;
    this.baseUrl = `https://www.ygohub.com/api`;
  }

  /**
  * Retorna todos registros da tabela
  */
  protected all() {
    con.query(`${this.SELECTALL}`, (err, result) => {
      if(err) return console.error(err);

      return result;
    });
  }

  /**
  * Retorna o primeiro registro da tabela cujo @param field for igual ao @param value .
  * @param {string} field - O campo a ser pesquisado;
  * @param {any} value - O valor que será pesquisado;
  * @return {object} O objeto representado o registro da tabela,
  * retorna um objeto vazio se não encontrar.
  */
  protected getByField({field, value}){
    con.query(`${this.SELECTALL} WHERE ${field} = ${value} LIMIT 1`, (err, result) => {
      if(err) return console.error(err);

      return result;
    });
  }

  /**
  * Cria a tabela no banco de dados,
  * Usa a variável {object} fields das classes filhas.
  * Sintaxe:
  * key => {string} Representa o tipo e opções do campo, como null ou tamanho.
  * value => {string[]} Um nome de campo em cada posição.
  */
  protected migrate(): void {
    console.log(`Migrating...`);

    let alowedTypes = ["varchar", "json", "int", "text"];
    let query = ``;

    for(let key in this.fields){
      if(!alowedTypes.some(itm => key.search(itm) > -1))
        throw new TypeError(`Chave ${key} não pertence às chaves permitidas!`);

      this.fields[key].map((item) => {
        query += `${item} ${key}, `;
      });
    }
    con.query(`SHOW TABLES FROM \`ygo-catalog\` LIKE '${this.tableName}'`, (err, result) => {
      if(err) return console.error(err);
      if(result.length) return console.log(`Tabela ${this.tableName} já existe!`);
      if(!query) throw new Error(`Erro na migration, variavel dos campos está vazia!`);

      con.query(`CREATE TABLE ${this.tableName} (${query.slice(0, -2)})`, (err, result) => {
        if(err) return console.error(err);

        console.log(`Tabela ${this.tableName} criada com sucesso!`);
      });
    });
  }

  /**
  * Checa determinada flag a cada 100 milisegundos.
  * @param {boolean} flag - A flag a ser testada;
  * @param {function} callback - O calback que será chamado quando a flag for true.
  */
  protected checarFlag(flag: boolean, callback: () => void): void{
    if(flag) callback();
    else setTimeout(() => this.checarFlag(flag, callback), 100);
  }

}
// declare global {
//   interface Object{
//     assign(from: object, other: object);
//   }
// }
