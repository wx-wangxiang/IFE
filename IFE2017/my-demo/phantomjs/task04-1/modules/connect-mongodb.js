const mongoose = require('mongoose');
const DB_CONN_STR = 'mongodb://localhost:27017/spider';
const db = mongoose.connection;

mongoose.Promise = global.Promise = require('bluebird');

function connect(DB_CONN_STR) {
	return new Promise(function(resolve, reject) {
		mongoose.connect(DB_CONN_STR);
		db.on('error', ()=>{
			console.error.bind(console, 'connection error: ');
			reject('error');
		});
		db.on('open', ()=>{
			console.log('mongodb connected');
			resolve(mongoose);
		})
	});
}

const connectMongodb = async function(DB_CONN_STR) {
	const connectResult = await connect(DB_CONN_STR);

	return connectResult;
}

function setModel() {
	const resultSchema = mongoose.Schema({
		no: Number,
		keyword: String,
		device: String,
		time: String,
		title: String,
		info: String,
		link: String,
		pic: String,
		localImg: String
	});

	return mongoose.model('result', resultSchema);
}

function getModel(callback) {
	mongoose.connect(DB_CONN_STR);
	db.on('error', () => {
		console.error.bind(console, 'connection error: ');
	});
	db.on('open', ()=>{
		console.log('mongodb connected');
		const model = setModel();

		callback(model);
	})
}

module.exports = getModel