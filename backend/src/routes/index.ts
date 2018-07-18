import cardRoutes from './card_routes';
import setRoutes from  './set_routes';
import userRoutes from './user_routes';
import authRoutes from './auth_routes';

export default (db) => {
  cardRoutes();
  setRoutes();
  userRoutes();
  authRoutes();
}
