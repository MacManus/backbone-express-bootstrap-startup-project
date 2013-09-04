// Define db connection
var Mongolian = require('mongolian'),
	ObjectId = Mongolian.ObjectId;


ObjectId.prototype.toJSON = function toJSON() { return this.toString(); };

var server = new Mongolian();

// SETUP DB NAME
var db = server.db('DBNAME');

module.exports.ObjectId = ObjectId;

module.exports.collections  = {
	// Define access to collections
	// Ex : contents: db.collection('contents'),
	contents: db.collection('contents'),
};

