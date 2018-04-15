import cardRoutes from './card_routes';
import setRoutes from './set_routes';
import { Card } from '../models/Card';
import { Set } from '../models/Set';

export default (app, db) => {
  cardRoutes(app, Card);
  setRoutes(app, Set);
}
