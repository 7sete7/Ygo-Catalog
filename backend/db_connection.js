let mysql = require('mysql');

class Database
{
  let con;

  constructor(){
    con = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });
    
    con.connect((err) => {
      if(err) throw err;
      console.log('Conexão com database estabelecida!');
    });
  }



}

export default Database;
