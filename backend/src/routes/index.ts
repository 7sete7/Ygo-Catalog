import cardRoutes from './card_routes';
import setRoutes from  './set_routes';
import userRoutes from './user_routes';

export default (db) => {
  cardRoutes();
  setRoutes();
  userRoutes();
}
