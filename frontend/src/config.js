// import env from './env'; //Módulo linkado ao env.js do backend.
import Clasche from "./Util/Cache";
let env = {};

let cache = new Clasche();

export default {
  API_URL : `http://${env.DB_HOST || "localhost"}:${env.API_PORT || 8080}/api`,
  CACHE: cache,
};
