
// load the controllers we need - default set to home
var home = require('./controllers/home_controller');


/*
 * define our routes
 */

module.exports = function (app) {
	// default set to home.index
	app.get('/', home.index);
	//webb app urls
	
	//exemple
	// app.get('/contents', contents.index); 				// show all contents
	// app.get('/contents/:id', contents.show); 			// show 1 contents

	// CRUD 

	// exemple
	// app.get('/api/contents', contents.index); 			// get all contents
	// app.post('/api/contents', contents.create);			// create an contents
	// app.get('/api/contents/:id', contents.show);		// get 1 contents
	// app.put('/api/contents/:id', contents.update);		// update 1 contents
	// app.delete('/api/contents/:id', contents.destroy);	// delte 1 contents
}



