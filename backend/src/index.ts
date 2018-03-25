import { app, mysql, rp, bodyParser } from '../index';
import { conectarBD, doThings } from './Database';

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  bodyParser.urlencoded({ extended: true });
});

let con = conectarBD(doThings);

export { app, mysql, rp, con };
