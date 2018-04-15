import { con } from '../index';
import * as rp from 'request-promise';

/**
* Super classe que todas as models descenderão.
*/
export abstract class Model
{

  public cards: any[];
  private recursao = {
    totalLoop: 10,
    terminou: 0,
    current: 0
  }
  protected todosItems: object[] = [];
  private url : string;
  protected abstract detailUrl: string;
  protected abstract allUrl: string;

  private SELECTALL: string;
  private arrayDosCampos: string[] = [];

  protected abstract fields: object;
  protected tableName: string;
  protected baseUrl: string;
  protected fnGetItens: (objeto: object) => void = this.fn;

  protected get requestOptions(): object{
    return {
      url: `${this.baseUrl}/${this.allUrl}`,
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
  public all(): Promise<any> {
    return new Promise((resolve, reject) => {
      con.query(`${this.SELECTALL}`, (err, result) => {
        if(err) return reject(err);
        let res;

        try{ res = JSON.parse(JSON.stringify(result)); }
        catch(e){ return reject(err); }

        resolve(res);
      });
    });
  }

  /**
  * Retorna o primeiro registro da tabela cujo @param field for igual ao @param value .
  * @param {string} field - O campo a ser pesquisado;
  * @param {any} value - O valor que será pesquisado;
  * @return {object} O objeto representado o registro da tabela,
  * retorna um objeto vazio se não encontrar.
  */
  public getByField({field, value, limit = 1}): Promise<any>{
    return new Promise((resolve, reject) => {
      con.query(`${this.SELECTALL} WHERE ${field} IN (?) LIMIT ${limit}`, [value],
      (err, result) => {
        if(err) return reject(err);
        let res;

        try{ res = JSON.parse(JSON.stringify(result)); }
        catch(e){ return reject(err); }

        resolve(res);
      });
    });
  }

  /**
  * Cria a tabela no banco de dados,
  * Usa a variável {object} fields das classes filhas.
  * Sintaxe:
  * key => {string} Representa o tipo e opções do campo, como null ou tamanho.
  * value => {string[]} Um nome de campo em cada posição.
  */
  protected migrar(): Promise<any> {
    return new Promise(resolve => {

      let query = this.generateQuery();

      con.query(`SHOW TABLES FROM \`ygo-catalog\` LIKE '${this.tableName}'`, (err, result) => {
        if(err) return console.error(err);
        if(!query) throw new Error(`Erro na migration, variavel dos campos está vazia!`);
        if(result.length){
          resolve(1);
          return console.log(`Tabela ${this.tableName} já existe!`);
        }

        con.query(`CREATE TABLE ${this.tableName} (${query.slice(0, -2)})`, (err, result) => {
          if(err) return console.error(err);
          resolve(1);
          console.log(`Tabela ${this.tableName} criada com sucesso!`);
        });
      });
    });
  }

  /**
  * Semeia a tabela card pegando os dados da {@link https://www.ygohub.com/api | API}
  */
  protected semear(): Promise<any>{
    console.log(`Semeando ${this.tableName}...`);

    return new Promise(resolve => {
      this.con.query(`SELECT * FROM ${this.tableName}`, (err, result) => {
        if(result.length){
          resolve(1);
          return console.log(`Tabela ${this.tableName} já possui registros!`);
        }

        for(let key in this.fields)
          this.arrayDosCampos.push(...this.fields[key]);

        this.rp(this.requestOptions).then(body => {
          this.cards = body.cards || body.sets;

          for(let i = 0; i < this.recursao.totalLoop; i++)
            this.pegarAsCartas().then((a) => resolve(1));
        })
        .catch(err => console.log(`Erro pegando todas ${this.tableName}! \n> ${err}`));
      });
    });
  }

  /**
  * Função recursiva que roda simultâneamente {@link totalLoop | totalLoop} vezes,
  * pega os dados das cartas e guarda em {@link todosItems | todosItems}.
  * @param {string[]} arrayDosCampos - Array contendo o nome dos campos na tabela.
  */
  private pegarAsCartas(): Promise<any>
  {
    return new Promise<any>(resolve => {
      let nome = this.cards[this.recursao.current++];
      let op = this.requestOptions;
      op["url"] = `${this.baseUrl}/${this.detailUrl}?name=${nome}`;

      if(this.recursao.current >= this.cards.length){
        this.recursao.terminou++;
        if(this.recursao.terminou == this.recursao.totalLoop)
          resolve(this.inserirNaTabela(this.arrayDosCampos, this.todosItems));
        return;
      }

      this.rp(op)
        .then(body => {
          let arr = this.arrayDosCampos;
          this.fnGetItens({body, arr});
          this.pegarAsCartas();
        })
        .catch(err => {
          console.log(`Erro no número ${this.recursao.current} -> ${err}`);
          this.pegarAsCartas();
        });
    });
  }

/**
* Insere dados na tabela
* @param {string[]} arrayDosCampos - Array contendo o nome dos campos a ser usado.
* @param {object[]} itens - Array de objetos contento os dados a serem inseridos.
*/
  protected inserirNaTabela(arrayDosCampos: string[], itens: object[]): void
  {
    //Testa se tem 'none', '?', ' ', ''.
    let regex = new RegExp(/^\s?none\s?$|\?|^\s+$|^$/g);

    itens.forEach(async (item, i) => {
      let values = await this.con.escape(Object.keys(item).map(key => {
        return item[key] && !regex.test(item[key]) ? item[key] : null;
      }));

      this.con.query(`
        INSERT INTO ${this.tableName} (${arrayDosCampos.join(', ')})
        VALUES (${values})`,
        err => {
          if(err) console.error(`Erro no insert!\n> ${err}`);
        }
      );
    });
    console.log(`Tabela ${this.tableName} semeada com aproximadamente ${itens.length} registros!`);
  }

/**
* Função padrão para pegar separar e guardar os dados que vem da api
* Vai para a @see fnGetItens, pode ser sobrescrito para um comportamento diferente.
* @param {object} body - O corpo da response da api
* @param {string[]} arrayDosCampos - Array contendo o nome dos campos.
*/
  private fn({body: body, arr: arrayDosCampos}){
    let singular: string = this.tableName.slice(0, -1);
    if(body[singular]){
        let aux = {};
        for(let k of arrayDosCampos){
          aux[k] = body[singular].hasOwnProperty(k)
                    ? this.fields["json null"].filter(itm => itm == k).length
                      ? JSON.stringify(body[singular][k])
                      : body[singular][k]
                    : null;
        }
        this.todosItems.push(aux);
      }
  }

/**
* Função que gera a query para criação da tabela.
* @return {string} - A query dos campos da tabela.
*/
  private generateQuery(): string{
    let alowedTypes = ["varchar", "json", "int", "text", "date", "bool", "float"];
    let query = ``;

    if(this.tableName != `banCard`)
      query += `id int NOT NULL AUTO_INCREMENT, PRIMARY KEY (id), `;

    for(let key in this.fields){
      if(!alowedTypes.some(itm => key.toLowerCase().search(itm) > -1))
        throw new TypeError(`Chave ${key} não pertence às chaves permitidas!`);

      this.fields[key].map((item) => {
        query += `${item} ${key}, `;
      });
    }

    if(this.tableName == `bancard`)
      query += `FOREIGN KEY card REFERENCES cards(id), FOREIGN KEY banlist REFERENCES banlist(id), `;

    return query;
  }

}
