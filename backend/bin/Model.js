import con from '../index';
export class Model {
    constructor(name) {
        this.tableName = name;
        this.SELECTALL = `SELECT * FROM ${this.tableName}`;
        this.baseUrl = `https://www.ygohub.com/api`;
    }
    all() {
        con.query(`${this.SELECTALL}`, (err, result) => {
            if (err)
                return console.error(err);
            return result;
        });
    }
    getByField({ field, value }) {
        con.query(`${this.SELECTALL} WHERE ${field} = ${value} LIMIT 1`, (err, result) => {
            if (err)
                return console.error(err);
            return result;
        });
    }
    migrate() {
        let alowedTypes = ["varchar", "json", "int", "text"];
        let output = ``;
        for (let key in this.fields) {
            if (!alowedTypes.find(itm => itm.includes(key)))
                throw new TypeError(`Chave ${key} não pertence às chaves permitidas!`);
            this.fields[key].map((item) => {
                output += `${item} ${key}`;
            });
        }
        con.query(`SHOW TABLES FROM \`ygo-catalog\` LIKE '${this.tableName}'`, (err, result) => {
            if (err)
                return console.error(err);
            if (result.length)
                return console.log(`Tabela ${this.tableName} já existe!`);
            if (!output)
                throw new Error(`Erro na migration, variavel dos campos está vazia!`);
            con.query(`CREATE TABLE ${this.tableName} (${output})`, (err, result) => {
                if (err)
                    return console.error(err);
                console.log(`Tabela ${this.tableName} criada com sucesso!`);
            });
        });
    }
}
//# sourceMappingURL=Model.js.map