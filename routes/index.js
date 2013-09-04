
/*
 * GET home page.
 */


// this should be in a controller ...
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};