import { app, mysql, rp, bodyParser } from '../index';
import { conectarBD, generateBD } from './Database';

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  bodyParser.json();
  bodyParser.urlencoded({ extended: true });
  next();
});

let con = conectarBD(generateBD);

export { app, mysql, rp, con };
