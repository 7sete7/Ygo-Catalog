import { con } from '../index';
import * as rp from 'request-promise';
import { Card } from './Card';
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
        catch(e){ return reject(e); }

        res = this.formatDate(res);
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
        catch(e){ return reject(e); }

        res = this.formatDate(res);
        resolve(res);
      });
    });
  }

  /**
  * Cria a tabela no banco de dados,
  * Usa a variável fields das classes filhas.
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
        if(Array.isArray(result) && result.length){
          resolve(1);
          return console.log(`Tabela ${this.tableName} já possui registros!`);
        }

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

      if(this.recursao.current >= this.cards.length){
        this.recursao.terminou++;
        if(this.recursao.terminou == this.recursao.totalLoop)
          resolve(this.inserirNaTabela(this.todosItems));
        return;
      }

      let nome = this.cards[this.recursao.current++];

      this.request(`${this.baseUrl}/${this.detailUrl}?name=${nome}`)
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
  protected inserirNaTabela(itens: object[]): void
  {
    //Testa se tem 'none', '?', ' ', ''.
    let regex = new RegExp(/^\s?none\s?$|\?|^\s+$|^$/g);

    itens.forEach(async (item, i) => {
      let values = await this.con.escape(Object.keys(item).map(key => {
        return item[key] && !regex.test(item[key]) ? item[key] : null;
      }));

      await this.con.query(`
        INSERT INTO ${this.tableName} (${this.arrayDosCampos().join(', ')})
        VALUES (${values})`,
        err => {
          if(err) return console.error(`Erro no insert!\n> ${err}`);
        }
      );
    });
    console.log(`Tabela ${this.tableName} semeada com aproximadamente ${itens.length} registros!`);
  }

  protected request(url: string = null): Promise<any>{
    let op = this.requestOptions;
    op["url"] = url || op["url"];

    return new Promise((resolve, reject) => {
      this.rp(op)
      .then(res => resolve(res))
      .catch(e => reject(e));
    });
  }

  /**
  * Função que liga uma carta com outra tabela com as cartas do cards.
  * @param {object[]} cartas - Objeto correspondente a uma carta para ser ligada;
  * @param {string} name - Nome do campo da tabela de ligação;
  * @param {int} id - Id da tabela ligada;
  * @return {object[]} - Array de objetos contendo o id do card e banlist.
  */
    protected async assignForeign(cartas: object[], opc): Promise<object[]>
    {
      try{
        let {name, id, ...resto} = opc;
        let names = cartas.map(card => card["card_name"]);
        let as = await Card.instance.getByField({field: "name", value: names, limit: 999});
        let cards: object[] = [];

        await as.forEach(({id: card, name: nomeCarta}) => {
          let [carta,] = cartas.filter(c => c["card_name"] == nomeCarta);
          let aux = {};

          for(let key in carta)
            if(key != "card_name" && key != "set_number" && this.arrayDosCampos().indexOf(`\`${key}\``) != -1)
              aux[key] = carta[key];

          cards.push({
            "card": card,
            [name]: id,
            ...aux,
            ...resto
          });
        });

        return cards;
      }
    catch(e){ console.error(`Erro no foreign do ${this.tableName}`, e) }
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
    let alowedTypes = ["varchar", "json", "int", "text", "date", "bool", "float", "fk"];
    let query = ``;

    for(let key in this.fields){
      if(!alowedTypes.some(itm => key.toLowerCase().search(itm) > -1))
        throw new TypeError(`Chave ${key} não pertence às chaves permitidas!`);

      this.fields[key].map(item => {
        query += `\`${item}\` ${key != `fk`? key : `int`}, `;
      });
    }

    if(this.fields["fk"])
      for(let item in this.fields["fk"])
        query +=`FOREIGN KEY (\`${this.fields["fk"][item]}\`) REFERENCES ${this.fields["fk"][item]}s(id), `;
    else
      query = `id int NOT NULL AUTO_INCREMENT, PRIMARY KEY (id), ${query}`;

    return query;
  }

/**
* Função projetada exclusivamente para pegar dados da banlist.
* Tira o TZ que vem após a data por um motivo desconhecido -> 2005-06-01 T03:00:00Z.
* @param {object[]} res - O response da query
* @return {object[]} - O response formatado se veio da banlist, senão só retorna.
*/
  private formatDate(res: object[]): object[]{
    if(Array.isArray(res) && res.length && res[0].hasOwnProperty("start")){
      for(let item of res){
        item["start"] = item["start"] ? item["start"].split(/T[0-9]{2}:/g)[0] : null;
        item["end"] = item["end"] ? item["end"].split(/T[0-9]{2}:/g)[0] || item["end"] : null;
      }
    }
    return res;
  }

/**
* Gera um array contendo o nome de todos os campos da Model.
* @return {string[]} - O array dos campos.
*/
  private arrayDosCampos(): string[]{
    let arr = [];
    for(let key in this.fields)
      for(let value of this.fields[key])
        arr.push(`\`${value}\``);

    return arr;
  }

}
