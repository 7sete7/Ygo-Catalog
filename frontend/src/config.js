import cache from 'memory-cache';
import env from 'env'; //Módulo linkado ao env.js do backend.

export default {
  API_URL : `http://${env.DB_HOST || "localhost"}:${env.API_PORT || 8080}/api`,
  CACHE: cache
};
