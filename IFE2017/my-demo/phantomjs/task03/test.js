var getMongoModel = require('./mongodb.js');

getMongoModel(function(mongoModel) {
	console.log(mongoModel);
})