import { app, mysql, rp, bodyParser } from '../index';
import { conectarBD, generateBD } from './Database';

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  bodyParser.urlencoded({ extended: true });
});

let con = conectarBD(generateBD);

export { app, mysql, rp, con };
