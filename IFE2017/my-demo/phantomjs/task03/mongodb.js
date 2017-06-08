var DB_CONN_STR = 'mongodb://localhost:27017/spider';
var mongoose = require('mongoose');

mongoose.Promise = global.Promise = require('bluebird'); //不加这段代码，save的时候会报警告

function getMongoModel(callback) {
	mongoose.connect(DB_CONN_STR);

	var db = mongoose.connection;

	db.on('error', console.error.bind(console, 'connection error: '));
	db.once('open', function() {
		console.log('mongodb connected...');

		//定义schema
		var spiderDataSchema = mongoose.Schema({
			info: String,
			link: String,
			pic: String,
			title: String
		})

		//定义model
		var spiderData = mongoose.model('spiderData', spiderDataSchema);

		callback(spiderData);
	})
}

module.exports = getMongoModel;