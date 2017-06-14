const mongoose = require('mongoose');
const DB_CONN_STR = 'mongodb://localhost:27017/spider';
const db = mongoose.connection;

mongoose.Promise = global.Promise = require('bluebird');

function setModel() {
	const resultSchema = mongoose.Schema({
		no: Number,
		keyword: String,
		device: String,
		time: String,
		title: String,
		info: String,
		link: String,
		pic: String
	});
	const result = mongoose.model('result', resultSchema);

	return result;
}

function getModel(callback) {
	mongoose.connect(DB_CONN_STR);
	db.on('error', console.error.bind(console, 'connection error: '));
	db.on('open', ()=>{
		console.log('mongodb connected');
		const result = setModel();

		callback(result);
	})

}

module.exports = getModel