export default (app, Set) => {

  //Get all set names
  app.route('/api/sets/get_all').get(async (req, res) => {
    return await Set.instance.all();
  });

  //Get set info by it's name
  app.route('/api/sets/:name').get(async (req, res) => {
    return await Set.instance.getByField({field: 'name', value: req.params.name});
  });
}
