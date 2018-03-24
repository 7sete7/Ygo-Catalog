let cardRoutes = require('./card_routes');
let setRoutes = require('./set_routes');

module.exports = function(app, db){
  cardRoutes(app, db);
  setRoutes(app, db);
}
