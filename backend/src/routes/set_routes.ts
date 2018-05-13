export default (app, Set) => {

  //Get all set names
  app.route('/api/sets/get_all').get(async (req, res) => {
    console.log(`GET ${req.originalUrl}`);

    let set = await Set.instance.all(req.query.orderBy || null);
    res.json(set);
  });

  //Get set info by it's name
  app.route('/api/sets/:name').get(async (req, res) => {
    console.log(`GET ${req.originalUrl}`);
    
    let set = await Set.instance.getByField({
      field: 'name',
      value: req.params.name,
      orderBy: req.query.orderBy || null
   });
    res.json(set);
  });
}
